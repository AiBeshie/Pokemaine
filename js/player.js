 // ================== PLAYER INIT ==================
if (!window.player) {
  window.player = {
    level: 71,
    coins: 250,
    stardust: 500,
    party: [],
    items: {},
    activeIndex: null
  };
} else if (window.player.activeIndex == null || window.player.activeIndex >= window.player.party.length) {
  window.player.activeIndex = 0;
}

// Catching lock
window.isCatching = false;
let isSwitching = false;

// ================== IV APPRAISAL ==================
function getIVAppraisal(ivs) {
  const atk = ivs.attack || 0;
  const def = ivs.defense || 0;
  const hp  = ivs.stamina || 0;
  const total = atk + def + hp;

  if (atk === 15 && def === 15 && hp === 15) return { stars: 4, label: "PERFECT", color: "#ff4d4d" };
  if (total >= 37) return { stars: 3, label: "Excellent", color: "#FFD700" };
  if (total >= 30) return { stars: 3, label: "Great", color: "#FFD700" };
  if (total >= 23) return { stars: 2, label: "Good", color: "#1E90FF" };
  if (total >= 1)  return { stars: 1, label: "OK", color: "#aaa" };
  return { stars: 0, label: "Trash", color: "#555" };
}

function renderStars(count, color) {
  if (!count) return `<span style="color:#555;">No Stars</span>`;
  return Array(count).fill(`<span style="color:${color}; font-size:1.1em;">★</span>`).join("");
}

function renderIVBar(value, color = "lime") {
  let bar = "";
  for (let i = 0; i < 15; i++) {
    bar += `<span style="display:inline-block;width:9px;height:6px;margin-right:1px;background:${i < value ? color : '#444'};border-radius:1px;"></span>`;
  }
  return `<div style="margin-top:2px;">${bar}</div>`;
}

let partyTooltip = null;
let tooltipTimeout = null;
let isTooltipVisible = false;

// -------------------- SHOW TOOLTIP --------------------
function showTooltip(poke, target) {
  clearTimeout(tooltipTimeout);

  if (!partyTooltip) {
    partyTooltip = document.createElement("div");
    Object.assign(partyTooltip.style, {
      position: "absolute",
      backgroundColor: "#222",
      color: "#fff",
      border: "1px solid #555",
      padding: "10px",
      boxShadow: "3px 3px 8px rgba(0,0,0,0.7)",
      zIndex: 1000,
      minWidth: "240px",
      maxWidth: "320px",
      borderRadius: "8px",
      fontFamily: "monospace",
      fontSize: "0.95em",
      transition: "opacity 0.15s",
      opacity: 0,
      display: "none",
    });
    document.body.appendChild(partyTooltip);

    // Keep tooltip visible when hovering over it
    partyTooltip.addEventListener("mouseenter", () => clearTimeout(tooltipTimeout));
    partyTooltip.addEventListener("mouseleave", hideTooltip);
  }

  // Prepare Pokémon data
  poke.ivs = poke.ivs || generateIVs();
  poke.nature = poke.nature || determineNature(poke.ivs);
  poke.talents = poke.talents || assignTalents(poke);
  applyTalentModifiers(poke);
  if (!poke.max_cp || poke.max_cp <= 0) calculateCP(poke);

  const shinyIcon = poke.shiny ? "✨ " : "";
  const natureColor = natureColors[poke.nature] || "white";
  const level = poke.level || 1;
  const cp = poke.current_cp ?? calculateCP(poke);

  // Bonus stats
  const effectiveLevel = Math.min(level, MAX_LEVEL);
  const cpmLevel = Math.min(effectiveLevel, CPM_MAX_LEVEL);
  const cpm = CPM[cpmLevel];
  const levelMultiplier = 1 + (effectiveLevel - 1) * 0.02;

  const baseAtk = ((poke.base_attack || 10) + (poke.ivs.attack || 0)) * cpm * levelMultiplier;
  const baseDef = ((poke.base_defense || 10) + (poke.ivs.defense || 0)) * cpm * levelMultiplier;
  const baseSta = ((poke.base_stamina || 10) + (poke.ivs.stamina || 0)) * cpm * levelMultiplier;

  const bonus = {
    atk: (poke.atkTotal - baseAtk).toFixed(1),
    def: (poke.defTotal - baseDef).toFixed(1),
    sta: (poke.staTotal - baseSta).toFixed(1),
    critRate: ((poke.critRateTotal - (poke.critRate || 0)) * 100).toFixed(1),
    critDmg: (poke.critDmgTotal - (poke.critDmg || 1.5)).toFixed(1),
    dodge: ((poke.dodgeRateTotal - (poke.dodgeRate || 0.05)) * 100).toFixed(1),
  };

  const maxHP = Math.floor(poke.staTotal * 2);
  const currentHP = poke.currentHP ?? maxHP;
  const atk = poke.atkTotal.toFixed(1);
  const def = poke.defTotal.toFixed(1);

  const formatBonus = (value, suffix = "") => {
    const num = parseFloat(value);
    if (!num) return "";
    return ` <span style="color:${num > 0 ? 'lime' : 'red'}">(${num > 0 ? '+' : ''}${value}${suffix})</span>`;
  };

  const renderIVBar = (value, color = "lime") => {
    let bar = "";
    for (let i = 0; i < 15; i++) {
      bar += `<span style="display:inline-block;width:9px;height:6px;margin-right:1px;background:${i < value ? color : '#444'};border-radius:1px;"></span>`;
    }
    return `<div style="margin-top:2px;">${bar}</div>`;
  };

  const appraisal = getIVAppraisal(poke.ivs);

  const expPercent = ((poke.exp || 0) / (poke.expToNext || 100)) * 100;
  const expBarHTML = `
    <div style="margin-top:4px; width:100%; background:#555; border-radius:4px; height:8px;">
      <div style="width:${expPercent}%; background:#1E90FF; height:100%; border-radius:4px;"></div>
    </div>
    <div style="font-size:0.75em; color:#aaa; text-align:right; margin-top:2px;">
      EXP: ${poke.exp ?? 0} / ${poke.expToNext ?? 100}
    </div>
  `;

  // Tooltip HTML
  partyTooltip.innerHTML = `
    <div style="display:flex; align-items:center; gap:12px; margin-bottom:10px;">
      <img src="${getPokemonSprite(poke.pokemon_id, poke.shiny)}" style="width:64px;height:64px;">
      <div>
        <strong style="font-size:1.1em;">${shinyIcon}${poke.pokemon_name}</strong><br>
        Lv ${poke.level} | CP: ${cp}<br>
        <em>Nature: <span style="color:${natureColor}">${poke.nature}</span></em>
        ${expBarHTML}
      </div>
      <div style="display:flex; flex-direction:column; gap:4px; margin-left:8px;">
        <button id="evolveButton" style="background:#ffcc00;color:#222;border:none;padding:5px 10px;border-radius:4px;cursor:pointer;font-weight:bold;">Evolve</button>

<button id="randomTalentButton" style="
  background:#1E90FF;color:#fff;
  border:none;padding:5px 10px;
  border-radius:4px;cursor:pointer;
  font-weight:bold;">Random Talent</button>

        <button id="transferButton" style="background:#ff4444;color:#fff;border:none;padding:5px 10px;border-radius:4px;cursor:pointer;font-weight:bold;">Transfer</button>
      </div>
    </div>

    <div style="display:flex; flex-direction:column; font-size:0.9em; margin-bottom:8px;">
      <strong style="color:#7CFC00;">Base IV Stats (0–15):</strong>
      <div>Atk: ${poke.ivs.attack ?? 0} / 15 ${renderIVBar(poke.ivs.attack ?? 0, "lime")}</div>
      <div>Def: ${poke.ivs.defense ?? 0} / 15 ${renderIVBar(poke.ivs.defense ?? 0, "cyan")}</div>
      <div>HP: ${poke.ivs.stamina ?? 0} / 15 ${renderIVBar(poke.ivs.stamina ?? 0, "orange")}</div>
    </div>

    <div style="margin-bottom:8px; padding:6px; border:1px solid #444; border-radius:6px; text-align:center; background:#111;">
      <div style="font-size:1.2em;">${renderStars(appraisal.stars, appraisal.color)}</div>
      <div style="font-size:0.85em; color:${appraisal.color}; font-weight:bold;">
        ${appraisal.label} IV (${poke.ivs.attack + poke.ivs.defense + poke.ivs.stamina}/45)
      </div>
    </div>

    <div style="display:flex; gap:12px; font-size:0.9em; margin-bottom:6px;">
      <div style="flex:1;">
        <strong style="color:#FFD700;">Main Stats:</strong>
        <div>Atk: ${atk}${formatBonus(bonus.atk)}</div>
        <div>Def: ${def}${formatBonus(bonus.def)}</div>
        <div>HP: ${currentHP} / ${maxHP}${formatBonus(bonus.sta)}</div>
      </div>
      <div style="flex:1;">
        <strong style="color:#FF4500;">Combat Stats:</strong>
        <div>Crit: ${(poke.critRateTotal * 100).toFixed(1)}%${formatBonus(bonus.critRate, "%")}</div>
        <div>Crit Dmg: ${poke.critDmgTotal.toFixed(1)}${formatBonus(bonus.critDmg)}</div>
        <div>Dodge: ${(poke.dodgeRateTotal * 100).toFixed(1)}%${formatBonus(bonus.dodge, "%")}</div>
      </div>
    </div>

    <div style="margin-top:8px; display:flex; flex-wrap:wrap; align-items:center; gap:4px;">
      <strong style="color:#1E90FF;">Talent:</strong>
      ${poke.talents?.length ? poke.talents.map(t => `<span style="display:inline-block;">${renderTalentWithIcon(t)}</span>`).join("") : "<em>No talents</em>"}
    </div>
  `;
document.getElementById("randomTalentButton")?.addEventListener("click", () => {
  poke.talents = getRandomTalents(poke); // calls our randomizer
  applyTalentModifiers(poke); // reapply bonuses
  calculateCP(poke); // recalc CP
  showTooltip(poke, target); // refresh tooltip display
});

  // BUTTON HANDLERS
  document.getElementById("evolveButton")?.addEventListener("click", async () => {
    const oldHPPercent = poke.currentHP / (poke.staTotal * 2);
    await evolvePokemon(poke);
    calculateCP(poke);
    poke.currentHP = Math.max(1, Math.round((poke.staTotal * 2) * oldHPPercent));
    poke.currentEnergy = poke.currentEnergy || 0;
    hideTooltip();
    updatePartyDisplay();
  });

  document.getElementById("transferButton")?.addEventListener("click", () => {
    if (typeof transferPokemon === "function") transferPokemon(poke);
    hideTooltip();
  });

  // POSITION
  const rect = target.getBoundingClientRect();
  const margin = 6;

  partyTooltip.style.display = "block";
  partyTooltip.style.opacity = 0;

  setTimeout(() => {
    let top = rect.top + window.scrollY - partyTooltip.offsetHeight - margin;
    let left = rect.left + window.scrollX;
    if (left + partyTooltip.offsetWidth > window.innerWidth - 10) {
      left = window.innerWidth - partyTooltip.offsetWidth - 10;
    }
    partyTooltip.style.top = `${top}px`;
    partyTooltip.style.left = `${left}px`;
    partyTooltip.style.opacity = 1;
    isTooltipVisible = true;
  }, 0);
}

// -------------------- HIDE TOOLTIP --------------------
function hideTooltip() {
  clearTimeout(tooltipTimeout);
  tooltipTimeout = setTimeout(() => {
    if (partyTooltip) {
      partyTooltip.style.opacity = 0;
      setTimeout(() => {
        partyTooltip.style.display = "none";
        isTooltipVisible = false;
      }, 150);
    }
  }, 100);
}
// -------------------- ATTACH TOOLTIP --------------------
function attachTooltip(iconElement, poke) {
  iconElement.addEventListener("click", e => {
    e.stopPropagation();
    showTooltip(poke, iconElement);
  });

  // Click/tap outside closes tooltip
  document.addEventListener("click", e => {
    if (isTooltipVisible && (!partyTooltip.contains(e.target) && e.target !== currentTooltipTarget)) {
      hideTooltip();
    }
  });
  document.addEventListener("touchstart", e => {
    if (isTooltipVisible && (!partyTooltip.contains(e.target) && e.target !== currentTooltipTarget)) {
      hideTooltip();
    }
  });
}

// ================== PARTY DISPLAY ==================
function updatePartyDisplay() {
  const partyDisplay = document.getElementById("partyDisplay");
  if (!partyDisplay) return;
  partyDisplay.innerHTML = "";

  const player = window.player;
  if (!player || !player.party.length) {
    partyDisplay.textContent = "No Pokémon in party.";
    return;
  }

  if (player.activeIndex >= player.party.length) player.activeIndex = 0;

  player.party.forEach((poke, index) => {
    if (!poke.talents) assignTalents(poke);
    applyTalentModifiers(poke);
    calculateCP(poke);
    syncCurrentHP(poke);

    const slot = document.createElement("div");
    slot.style.display = "inline-block";
    slot.style.margin = "2px";
    slot.style.textAlign = "center";
    slot.style.verticalAlign = "top";

    // Sprite → click = switch with Pokéball animation
    const pokeBtn = document.createElement("button");
    pokeBtn.style.display = "block";
    pokeBtn.style.cursor = "pointer";
    pokeBtn.style.border = (index === player.activeIndex) ? "2px solid gold" : "none";
    pokeBtn.style.background = "transparent";
    pokeBtn.style.padding = "0";
    pokeBtn.innerHTML = `<img src="${getPokemonSprite(poke.pokemon_id, poke.shiny)}" style="width:64px;height:64px;">`;

    pokeBtn.addEventListener("click", async e => {
      e.stopPropagation();
      if (isSwitching) return;
      isSwitching = true;

      const active = player.party[player.activeIndex];
      if (player.activeIndex === index && active) {
        isSwitching = false;
        return;
      }

      await throwPokeballForSwitch(index); // use animation before switching
      isSwitching = false;
    });

    // Details button → click = show tooltip above sprite
    const detailsBtn = document.createElement("button");
    detailsBtn.textContent = "Details";
    detailsBtn.style.display = "block";
    detailsBtn.style.marginTop = "4px";
    detailsBtn.style.padding = "4px 6px";
    detailsBtn.style.fontSize = "0.75em";
    detailsBtn.style.cursor = "pointer";

    detailsBtn.addEventListener("click", e => {
      e.stopPropagation();
      showTooltip(poke, pokeBtn);
    });

    slot.appendChild(pokeBtn);
    slot.appendChild(detailsBtn);
    partyDisplay.appendChild(slot);
  });
}

// Hide tooltip if click outside
document.addEventListener("click", e => {
  if (partyTooltip && tooltipVisible && !partyTooltip.contains(e.target)) hideTooltip();
});

document.addEventListener('DOMContentLoaded', () => {
  updatePartyDisplay(); // party buttons setup
  showBattleMenu();
});





async function catchPokemon(ballType = "pokeball", onComplete = null) {
  const wild = window.currentWild;
  if (!wild) {
    appendBattleLog("No wild Pokémon to catch!", "player");
    if (onComplete) onComplete();
    return;
  }

  if (isCatching) return;
  isCatching = true;

  const wildSprite = document.getElementById("wildSprite");
  const pokeball = document.getElementById("pokeballThrow");
  if (!wildSprite || !pokeball) {
    isCatching = false;
    if (onComplete) onComplete();
    return;
  }

  const originalSrc = wildSprite.src;
  const originalAlt = wildSprite.alt;

  // Display pokéball
  pokeball.src = `img/${ballType}.png`;
  pokeball.style.display = "block";
  pokeball.style.opacity = "1";
  pokeball.style.transition = "none";
  pokeball.style.transform = "translate(0,0) scale(1) rotate(0deg)";

  const sleep = ms => new Promise(res => setTimeout(res, ms));
  const ballRect = pokeball.getBoundingClientRect();
  const wildRect = wildSprite.getBoundingClientRect();
  const dx = (wildRect.left + wildRect.width / 2) - (ballRect.left + ballRect.width / 2);
  const dy = (wildRect.top + wildRect.height / 2) - (ballRect.top + ballRect.height / 2);

  // Throw animation
  await sleep(20);
  pokeball.style.transition = "transform 0.45s cubic-bezier(0.2,-0.4,0.3,1.4)";
  pokeball.style.transform = `translate(${dx}px, ${dy}px) rotate(360deg)`;

  await sleep(300);
  wildSprite.style.transition = "opacity 0.2s";
  wildSprite.style.opacity = "0";

  await sleep(200);
  const dropY = dy + 70;
  pokeball.dataset.dropY = dropY;
  pokeball.style.transition = "transform 0.38s cubic-bezier(0.3,-0.3,0.4,1.4)";
  pokeball.style.transform = `translate(${dx}px, ${dropY}px) rotate(720deg)`;

  // Shake animation
  await sleep(400);
  const shakes = [0, -7, 7, -5, 5, -3, 3, 0];
  const ballModifiers = { pokeball: 1, greatball: 1.5, ultraball: 2 };
  const catchRate = (wild.catchRate ?? 0.5) * (ballModifiers[ballType] || 1);
  const didCatch = Math.random() < catchRate;

  for (let i = 0; i < shakes.length; i++) {
    const offset = shakes[i];
    pokeball.style.transform = `translate(${dx + offset}px, ${dropY}px) rotate(720deg) scale(${1 + (i % 2 ? 0.05 : -0.03)})`;
    await sleep(105);
  }

  // Flash effect
  let lastTransform = pokeball.style.transform;
  for (let i = 0; i < 6; i++) {
    pokeball.style.opacity = pokeball.style.opacity === "0" ? "1" : "0";
    await sleep(120);
  }

  // Reset wild sprite
  wildSprite.src = originalSrc;
  wildSprite.alt = originalAlt;
  wildSprite.style.opacity = "1";

  if (didCatch) {
    if (wild.isDitto) revealDitto(wild);
    window.currentWild = null;

    const ivs = wild.ivs || generateIVs();
    const nature = determineNature(ivs);

    const caught = {
      ...wild,
      ivs,
      nature,
      maxHP: Math.floor(wild.staTotal * 2),
      currentHP: Math.floor(wild.staTotal * 2),
      currentEnergy: 0,
      max_energy: 100,
      critRate: 0.05,
      critDmg: 1.5,
      dodgeRate: 0.05,
      level: wild.level || 5
    };
    
  // scales stats
calculateCP(caught);           // uses final stats
syncCurrentHP(caught);         // update HP after final stats
assignTalents(caught);        // must come first
applyTalentModifiers(caught);

    if (!window.player.party) window.player.party = [];
    window.player.party.push(caught);

    appendBattleLog(`You caught ${wild.shiny ? "✨ " : ""}${wild.pokemon_name}!`, "player");
    clearSprite(false, "No Wild Pokémon");

    // Update active index if needed
    if (window.player.activeIndex == null || window.player.activeIndex >= window.player.party.length) {
      window.player.activeIndex = window.player.party.length - 1; // auto-select new catch
    }

    hideTooltip();  // close any old tooltip
    updatePartyDisplay();  // refresh all buttons + event listeners

    // Auto-show tooltip for newly caught Pokémon
    const partyDisplay = document.getElementById("partyDisplay");
    if (partyDisplay) {
      const lastSlot = partyDisplay.lastChild;
      if (lastSlot) {
        const newPokeBtn = lastSlot.querySelector("button"); // sprite button
        if (newPokeBtn) showTooltip(caught, newPokeBtn);
      }
    }

    updateBattleScreen(window.player.party[window.player.activeIndex], true);

  } else {
    appendBattleLog(`${wild.pokemon_name} broke free!`, "player");

    // Failed catch animations
    pokeball.style.transition = "opacity 0.6s ease-out";
    pokeball.style.opacity = "0";
    setTimeout(() => { pokeball.style.display = "none"; }, 600);

    wildSprite.style.transition = "transform 0.25s ease-out";
    wildSprite.style.transform = "translate(30px, -20px)";


    setTimeout(() => {
      resetWildSpritePosition();
    }, 250);
  }

  // Pokéball glow cleanup
  pokeball.style.setProperty('--ball-transform', lastTransform);
  pokeball.classList.add("pokeball-glow");
  await sleep(1000);
  pokeball.classList.remove("pokeball-glow");
  pokeball.style.display = "none";
  pokeball.style.transform = "translate(0,0) scale(1) rotate(0deg)";

  isCatching = false;
  if (onComplete) onComplete();
}

async function throwPokeballForSwitch(index) {
resetWildSpritePosition();
  resetPlayerSpritePosition();
  const player = window.player;
  if (!player || index >= player.party.length) return;

  const newPoke = player.party[index];
  if (!newPoke) return; // no active Pokémon, do nothing

  const playerSprite = document.getElementById("playerSprite");
  const pokeball = document.getElementById("pokeballThrow");
  if (!playerSprite || !pokeball) return;

  const sleep = ms => new Promise(res => setTimeout(res, ms));

  // Only create poof if playerSprite is visible
  if (playerSprite.style.visibility !== "hidden") {
    // ---- POOF EFFECT ----
    function createPoofEffect(target, count = 8) {
      const rect = target.getBoundingClientRect();
      for (let i = 0; i < count; i++) {
        const poof = document.createElement("div");
        poof.className = "poofParticle";
        poof.style.setProperty("--dx", `${(Math.random() - 0.5) * 60}px`);
        poof.style.setProperty("--dy", `${(Math.random() - 0.5) * 60}px`);
        poof.style.setProperty("--rot", `${Math.random() * 360}deg`);
        poof.style.position = "absolute";
        poof.style.left = `${rect.left + rect.width / 2 - 10}px`;
        poof.style.top = `${rect.top + rect.height / 2 - 10}px`;
        document.body.appendChild(poof);
        poof.addEventListener("animationend", () => poof.remove());
      }
      target.style.visibility = "hidden";
    }

    createPoofEffect(playerSprite);
    await sleep(400);
  }

  // ---- PREPARE POKÉBALL ----
  pokeball.src = "img/pokeball.png";
  pokeball.style.display = "block";
  pokeball.style.opacity = "1";
  pokeball.style.transition = "none";
  pokeball.style.transform = "translate(0,0) scale(1) rotate(0deg)";

  const parentRect = playerSprite.parentElement.getBoundingClientRect();
  const ballRect = pokeball.getBoundingClientRect();
  const spriteRect = playerSprite.getBoundingClientRect();

  const dx = (spriteRect.left - parentRect.left + spriteRect.width / 2) - (ballRect.left - parentRect.left + ballRect.width / 2);
  const dy = (spriteRect.top - parentRect.top + spriteRect.height / 2) - (ballRect.top - parentRect.top + ballRect.height / 2);

  // ---- THROW ARC ----
  const throwSteps = 30;
  for (let i = 1; i <= throwSteps; i++) {
    const progress = i / throwSteps;
    const x = dx * progress;
    const y = dy * progress - Math.sin(progress * Math.PI) * 150;
    const rotate = 360 * 5 * progress;
    pokeball.style.transition = `transform 30ms linear`;
    pokeball.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`;
    await sleep(30);
  }

  // ---- MULTIPLE BOUNCES ----
  const bounces = [
    { height: -25, rotate: 360 * 4 },
    { height: 15, rotate: 360 * 3 },
    { height: -10, rotate: 360 * 2 },
    { height: 5, rotate: 360 * 1 }
  ];
  for (let i = 0; i < bounces.length; i++) {
    const bounce = bounces[i];
    pokeball.style.transition = "transform 80ms ease-out";
    pokeball.style.transform = `translate(${dx}px, ${dy + bounce.height}px) rotate(${360 * 5 + bounce.rotate}deg)`;
    await sleep(80);
  }

  // ---- SWITCH POKÉMON ----
  player.activeIndex = index;
  updateBattleScreen(newPoke, true);
  appendBattleLog(`${newPoke.pokemon_name} I choose you!`, "player");
  updatePartyDisplay();

  // ---- RESET POKÉBALL & SHOW NEW POKÉMON ----
  playerSprite.style.visibility = "visible";
  pokeball.style.display = "none";
  pokeball.style.transform = "translate(0,0) scale(1) rotate(0deg)";
}
