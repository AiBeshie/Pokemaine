// ------------------ PLAYER INIT ------------------
if (!window.player) {
  window.player = {
    level: 50,
    coins: 50,
    stardust: 500,
    party: [],
    items: {},
    activeIndex: 0 // default active Pokémon
  };
} else if (window.player.activeIndex == null || window.player.activeIndex >= window.player.party.length) {
  window.player.activeIndex = 0;
}

// --- Initialize catching state ---
window.isCatching = false;


function getIVAppraisal(ivs) {
  const atk = ivs.attack || 0;
  const def = ivs.defense || 0;
  const hp  = ivs.stamina || 0;
  const total = atk + def + hp; // max 45

  if (atk === 15 && def === 15 && hp === 15) {
    return { stars: 4, label: "PERFECT", color: "#ff4d4d" };
  }

  if (total >= 37) return { stars: 3, label: "Excellent", color: "#FFD700" };
  if (total >= 30) return { stars: 3, label: "Great", color: "#FFD700" };
  if (total >= 23) return { stars: 2, label: "Good", color: "#1E90FF" };
  if (total >= 1)  return { stars: 1, label: "OK", color: "#aaa" };

  return { stars: 0, label: "Trash", color: "#555" };
}

function renderStars(count, color) {
  let stars = "";
  for (let i = 0; i < count; i++) {
    stars += `<span style="color:${color}; font-size:1.1em;">★</span>`;
  }
  return stars || `<span style="color:#555;">No Stars</span>`;
}



let partyTooltip = null;
let tooltipTimeout = null;

function showTooltip(poke, target) {
  clearTimeout(tooltipTimeout);

  // --- CREATE TOOLTIP IF NOT EXISTS ---
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
    });
    document.body.appendChild(partyTooltip);

    partyTooltip.addEventListener("mouseenter", () => clearTimeout(tooltipTimeout));
    partyTooltip.addEventListener("mouseleave", hideTooltip);
  }

  // --- ENSURE POKEMON DATA ---
  poke.ivs = poke.ivs || generateIVs();
  poke.nature = poke.nature || determineNature(poke.ivs);
  poke.talents = poke.talents || assignTalents(poke);
  applyTalentModifiers(poke);
  if (!poke.max_cp || poke.max_cp <= 0) calculateCP(poke);

  const shinyIcon = poke.shiny ? "✨ " : "";
  const natureColor = natureColors[poke.nature] || "white";

  // --- Base stats scaled by level ---
  const level = poke.level || 1;
  const effectiveLevel = Math.min(level, MAX_LEVEL);
  const cpmLevel = Math.min(effectiveLevel, CPM_MAX_LEVEL);
  const cpm = CPM[cpmLevel];
  const levelMultiplier = 1 + (effectiveLevel - 1) * 0.02;

  const baseAtkLevel = ((poke.base_attack || 10) + (poke.ivs.attack || 0)) * cpm * levelMultiplier;
  const baseDefLevel = ((poke.base_defense || 10) + (poke.ivs.defense || 0)) * cpm * levelMultiplier;
  const baseStaLevel = ((poke.base_stamina || 10) + (poke.ivs.stamina || 0)) * cpm * levelMultiplier;

  const bonus = {
    atk: (poke.atkTotal - baseAtkLevel).toFixed(1),
    def: (poke.defTotal - baseDefLevel).toFixed(1),
    sta: (poke.staTotal - baseStaLevel).toFixed(1),
    critRate: ((poke.critRateTotal - (poke.critRate || 0)) * 100).toFixed(1),
    critDmg: (poke.critDmgTotal - (poke.critDmg || 1.5)).toFixed(1),
    dodge: ((poke.dodgeRateTotal - (poke.dodgeRate || 0.05)) * 100).toFixed(1),
  };

  const maxHP = Math.floor(poke.staTotal * 2);
  const currentHP = poke.currentHP ?? maxHP;
  const atk = poke.atkTotal.toFixed(1);
  const def = poke.defTotal.toFixed(1);
  const cp = poke.current_cp ?? calculateCP(poke);

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

  // --- EXP BAR ---
  const expPercent = ((poke.exp || 0) / (poke.expToNext || 100)) * 100;
  const expBarHTML = `
    <div style="margin-top:4px; width:100%; background:#555; border-radius:4px; height:8px;">
      <div style="width:${expPercent}%; background:#1E90FF; height:100%; border-radius:4px;"></div>
    </div>
    <div style="font-size:0.75em; color:#aaa; text-align:right; margin-top:2px;">
      EXP: ${poke.exp ?? 0} / ${poke.expToNext ?? 100}
    </div>
  `;

const renderBaseIV = (label, value, color) => `
  <div style="display:flex; justify-content:space-between;">
    <span>${label}</span>
    <span style="color:${color}; font-weight:bold;">${value} / 15</span>
  </div>
`;

  // --- TOOLTIP HTML ---
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
        <button id="transferButton" style="background:#ff4444;color:#fff;border:none;padding:5px 10px;border-radius:4px;cursor:pointer;font-weight:bold;">Transfer</button>
      </div>
    </div>


  <div style="display:flex; flex-direction:column; font-size:0.9em; margin-bottom:8px;">
  <strong style="color:#7CFC00;">Base IV Stats (0–15):</strong>

  <div>
    Atk: ${poke.ivs.attack ?? 0} / 15
    ${renderIVBar(poke.ivs.attack ?? 0, "lime")}
  </div>

  <div>
    Def: ${poke.ivs.defense ?? 0} / 15
    ${renderIVBar(poke.ivs.defense ?? 0, "cyan")}
  </div>

  <div>
    HP: ${poke.ivs.stamina ?? 0} / 15
    ${renderIVBar(poke.ivs.stamina ?? 0, "orange")}
  </div>
</div>


<div style="
  margin-bottom:8px;
  padding:6px;
  border:1px solid #444;
  border-radius:6px;
  text-align:center;
  background:#111;
">
  <div style="font-size:1.2em;">
    ${renderStars(appraisal.stars, appraisal.color)}
  </div>
  <div style="font-size:0.85em; color:${appraisal.color}; font-weight:bold;">
    ${appraisal.label} IV (${poke.ivs.attack + poke.ivs.defense + poke.ivs.stamina}/45)
  </div>
</div>


<div style="display:flex; gap:12px; font-size:0.9em; margin-bottom:6px;">

  <!-- LEFT COLUMN : MAIN STATS -->
  <div style="flex:1;">
    <strong style="color:#FFD700;">Main Stats:</strong>
    <div>Atk: ${atk}${formatBonus(bonus.atk)}</div>
    <div>Def: ${def}${formatBonus(bonus.def)}</div>
    <div>HP: ${currentHP} / ${maxHP}${formatBonus(bonus.sta)}</div>
  </div>

  <!-- RIGHT COLUMN : COMBAT STATS -->
  <div style="flex:1;">
    <strong style="color:#FF4500;">Combat Stats:</strong>
    <div>Crit: ${(poke.critRateTotal * 100).toFixed(1)}%${formatBonus(bonus.critRate, "%")}</div>
    <div>Crit Dmg: ${poke.critDmgTotal.toFixed(1)}${formatBonus(bonus.critDmg)}</div>
    <div>Dodge: ${(poke.dodgeRateTotal * 100).toFixed(1)}%${formatBonus(bonus.dodge, "%")}</div>
  </div>

</div>


    <div style="margin-top:8px; display:flex; flex-wrap:wrap; align-items:center; gap:4px;">
      <strong style="color:#1E90FF;">Talent:</strong>
      ${poke.talents?.length
        ? poke.talents.map(t => `<span style="display:inline-block;">${renderTalentWithIcon(t)}</span>`).join("")
        : "<em>No talents</em>"
      }
    </div>
  `;

  // --- BUTTON HANDLERS ---
  document.getElementById("evolveButton")?.addEventListener("click", async () => {
    const oldHPPercent = poke.currentHP / (poke.staTotal * 2);
    await evolvePokemon(poke);
    calculateCP(poke);
    poke.currentHP = Math.max(1, Math.round((poke.staTotal * 2) * oldHPPercent));
    poke.currentEnergy = poke.currentEnergy || 0;
    hideTooltip();
    updatePartyDisplay();
    if (window.player.activeIndex != null) {
      updateBattleScreen(window.player.party[window.player.activeIndex], true);
    }
  });

  document.getElementById("transferButton")?.addEventListener("click", () => {
    if (typeof transferPokemon === "function") transferPokemon(poke);
    hideTooltip();
  });

  // --- POSITION ---
  const rect = target.getBoundingClientRect();
  let top = rect.bottom + window.scrollY + 6;
  let left = rect.left + window.scrollX;
  if (left + partyTooltip.offsetWidth > window.innerWidth - 10) {
    left = window.innerWidth - partyTooltip.offsetWidth - 10;
  }
  partyTooltip.style.top = `${top}px`;
  partyTooltip.style.left = `${left}px`;
  partyTooltip.style.opacity = 1;
  partyTooltip.style.display = "block";
}

function hideTooltip() {
  tooltipTimeout = setTimeout(() => {
    if (partyTooltip) {
      partyTooltip.style.opacity = 0;
      setTimeout(() => { partyTooltip.style.display = "none"; }, 150);
    }
  }, 150);
}

function attachTooltip(iconElement, poke) {
  iconElement.addEventListener("mouseenter", () => showTooltip(poke, iconElement));
  iconElement.addEventListener("mouseleave", hideTooltip);
}





// ------------------ PLAYER PARTY DISPLAY ------------------
function updatePartyDisplay() {
  const partyDisplay = document.getElementById("partyDisplay");
  if (!partyDisplay) return;
  partyDisplay.innerHTML = "";

  if (!window.player || !window.player.party.length) {
    partyDisplay.textContent = "No Pokémon in party.";
    return;
  }

  if (window.player.activeIndex >= window.player.party.length) window.player.activeIndex = 0;

  window.player.party.forEach((poke, index) => {
    // Ensure stats, talents, CP, and HP are applied once
    if (!poke.talents) assignTalents(poke);
    applyTalentModifiers(poke);
    calculateCP(poke);
    syncCurrentHP(poke);

    const pokeBtn = document.createElement("button");
    pokeBtn.style.display = "inline-block";
    pokeBtn.style.margin = "2px";
    pokeBtn.style.cursor = "pointer";
    pokeBtn.style.border = "none";
    pokeBtn.style.background = "transparent";
    pokeBtn.style.padding = "0";
    pokeBtn.style.verticalAlign = "middle";
    pokeBtn.innerHTML = `<img src="${getPokemonSprite(poke.pokemon_id, poke.shiny)}" style="width:32px;height:32px;">`;

    // Attach tooltip events
    pokeBtn.addEventListener("mouseenter", (e) => showTooltip(poke, e.target));
    pokeBtn.addEventListener("mouseleave", hideTooltip);

    // Set active Pokémon on click
    pokeBtn.addEventListener("click", () => {
      if (window.player.activeIndex === index) return;
      window.player.activeIndex = index;
      const active = window.player.party[window.player.activeIndex];
      updateBattleScreen(active, true);
      updatePartyDisplay();
      appendBattleLog(`${poke.pokemon_name} is now your active Pokémon!`, "player");
    });

    partyDisplay.appendChild(pokeBtn);
  });
}


async function catchPokemon(ballType = "pokeball", onComplete = null) {
  const wild = window.currentWild;
  if (!wild) {
    appendBattleLog("No wild Pokémon to catch!", "player");
    if (onComplete) onComplete();
    return;
  }

  if (isCatching) return; // prevent double throws
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

  // Set ball image
  pokeball.src = `img/${ballType}.png`;
  pokeball.style.display = "block";
  pokeball.style.opacity = "1";
  pokeball.style.transition = "none";
  pokeball.style.transform = "translate(0,0) scale(1)";

  const ballRect = pokeball.getBoundingClientRect();
  const wildRect = wildSprite.getBoundingClientRect();
  const dx = (wildRect.left + wildRect.width / 2) - (ballRect.left + ballRect.width / 2);
  const dy = (wildRect.top + wildRect.height / 2) - (ballRect.top + ballRect.height / 2);

  const sleep = (ms) => new Promise(res => setTimeout(res, ms));

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
  const catchRate = wild.catchRate ?? 0.5;
  const didCatch = Math.random() < catchRate;

  for (let i = 0; i < shakes.length; i++) {
    const offset = shakes[i];
    pokeball.style.transform = `translate(${dx + offset}px, ${dropY}px) rotate(720deg) scale(${1 + (i % 2 ? 0.05 : -0.03)})`;
    await sleep(105);
  }

  let lastTransform = pokeball.style.transform;
  for (let i = 0; i < 6; i++) {
    pokeball.style.opacity = pokeball.style.opacity === "0" ? "1" : "0";
    await sleep(120);
  }

  wildSprite.src = originalSrc;
  wildSprite.alt = originalAlt;
  wildSprite.style.opacity = "1";

  if (didCatch) {
    window.currentWild = null;

    // --- Prepare caught Pokémon ---
    const ivs = wild.ivs || generateIVs();
    const nature = determineNature(ivs);

    const caught = {
      ...wild,
      ivs,
      nature,
      currentHP: wild.base_stamina + ivs.stamina,
      currentEnergy: 0,
      max_energy: 100,
      critRate: 0.05,
      critDmg: 1.5,
      dodgeRate: 0.05,
      level: wild.level || 5,
      max_cp: wild.max_cp || 100
    };

    // --- Assign talents and calculate stats ---
    assignTalents(caught);
    applyTalentModifiers(caught);
    calculateCP(caught);

    if (!window.player.party) window.player.party = [];
    window.player.party.push(caught);

    appendBattleLog(`You caught ${wild.shiny ? "✨ " : ""}${wild.pokemon_name}!`, "player");
    clearSprite(false, "No Wild Pokémon");

    if (window.player.activeIndex == null || window.player.activeIndex >= window.player.party.length) {
      window.player.activeIndex = 0;
    }

    updateBattleScreen(window.player.party[window.player.activeIndex], true);
    updatePartyDisplay();

  } else {
    appendBattleLog(`${wild.pokemon_name} broke free!`, "player");

    // Fade ball
    pokeball.style.transition = "opacity 0.6s ease-out";
    pokeball.style.opacity = "0";
    setTimeout(() => { pokeball.style.display = "none"; }, 600);

    // Wild Pokémon shake
    wildSprite.style.transition = "transform 0.15s ease-out";
    wildSprite.style.transform = "translateY(-15px)";
    setTimeout(() => {
      wildSprite.style.transition = "transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)";
      wildSprite.style.transform = "translateY(0)";
      setTimeout(() => {
        wildSprite.style.transition = "";
        wildSprite.style.transform = "";
      }, 300);
    }, 150);
  }

  pokeball.style.setProperty('--ball-transform', lastTransform);
  pokeball.classList.add("pokeball-glow");
  await sleep(1000);
  pokeball.classList.remove("pokeball-glow");
  pokeball.style.display = "none";

  isCatching = false;
  if (onComplete) onComplete();
}





