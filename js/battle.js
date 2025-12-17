// ------------------ PLAYER INIT ------------------
if (!window.player) {
  window.player = {
    level: 1,
    exp: 0,
    coins: 50,
    stardust: 500,
    party: [],
    items: {},
    activeIndex: 0
  };
} else if (window.player.activeIndex == null || window.player.activeIndex >= window.player.party.length) {
  window.player.activeIndex = 0;
}

// Initialize Pokémon EXP for party
if (window.player.party) {
  window.player.party.forEach(poke => {
    poke.exp = poke.exp || 0;
    poke.expToNext = getPokemonExpToNext(poke.level || 1);
  });
}

// ------------------ EXP FUNCTIONS ------------------
function expToLevel(level) {
  return 20 + level * level * 5; // quadratic growth
}

function getPokemonExpToNext(level) {
  return expToLevel(level);
}

// ------------------ HELPER: CLEAR SPRITE ------------------
function clearSprite(isPlayer, name = "") {
  const spriteImg = isPlayer ? document.getElementById("playerSprite") : document.getElementById("wildSprite");
  if (!spriteImg) return;

  spriteImg.src = "";
  spriteImg.alt = name;
  spriteImg.className = "";

  const nameEl = isPlayer ? document.getElementById("activeName") : document.getElementById("wildName");
  const levelEl = isPlayer ? document.getElementById("activeLevel") : document.getElementById("wildLevel");
  const hpEl = isPlayer ? document.getElementById("playerHP") : document.getElementById("enemyHP");
  const hpMaxEl = isPlayer ? document.getElementById("playerHPMax") : document.getElementById("enemyHPMax");
  const cpEl = isPlayer ? document.getElementById("playerCP") : document.getElementById("wildCP");
  const hpBarInner = isPlayer ? document.getElementById("playerHPBar") : document.getElementById("enemyHPBar");
  const energyBar = isPlayer ? document.getElementById("playerEnergyBar") : document.getElementById("enemyEnergyBar");
  const energyText = isPlayer ? document.getElementById("playerEnergy") : document.getElementById("enemyEnergy");
  const maxEnergyText = isPlayer ? document.getElementById("playerMaxEnergy") : document.getElementById("enemyMaxEnergy");

  if (nameEl) nameEl.textContent = name;
  if (levelEl) levelEl.textContent = "";
  if (hpEl) hpEl.textContent = "";
  if (hpMaxEl) hpMaxEl.textContent = "";
  if (cpEl) cpEl.textContent = "";
  if (hpBarInner) {
    hpBarInner.style.width = "0%";
    hpBarInner.className = "hp-bar-inner hp-red";
  }
  if (energyBar) energyBar.style.width = "0%";
  if (energyText) energyText.textContent = "";
  if (maxEnergyText) maxEnergyText.textContent = "";
}

// ------------------ UPDATE BATTLE SCREEN ------------------
function updateBattleScreen(pokemon, isPlayer = true) {
  if (!pokemon) {
    clearSprite(isPlayer, isPlayer ? "No Pokémon" : "No Wild Pokémon");
    return;
  }

  const spriteImg = isPlayer ? document.getElementById("playerSprite") : document.getElementById("wildSprite");
  const nameEl = isPlayer ? document.getElementById("activeName") : document.getElementById("wildName");
  const levelEl = isPlayer ? document.getElementById("activeLevel") : document.getElementById("wildLevel");
  const hpEl = isPlayer ? document.getElementById("playerHP") : document.getElementById("enemyHP");
  const hpMaxEl = isPlayer ? document.getElementById("playerHPMax") : document.getElementById("enemyHPMax");
  const cpEl = isPlayer ? document.getElementById("playerCP") : document.getElementById("wildCP");
  const hpBarInner = isPlayer ? document.getElementById("playerHPBar") : document.getElementById("enemyHPBar");
  const energyBar = isPlayer ? document.getElementById("playerEnergyBar") : document.getElementById("enemyEnergyBar");
  const energyText = isPlayer ? document.getElementById("playerEnergy") : document.getElementById("enemyEnergy");
  const maxEnergyText = isPlayer ? document.getElementById("playerMaxEnergy") : document.getElementById("enemyMaxEnergy");

  if (!pokemon.max_cp || pokemon.max_cp <= 0) calculateCP(pokemon);

  const maxHP = pokemon.maxHP || Math.max(1, pokemon.staTotal || 10);
  const currentHP = Math.max(0, pokemon.currentHP ?? maxHP);

  // HP bar
  if (hpBarInner) {
    const pct = (currentHP / maxHP) * 100;
    hpBarInner.style.width = pct + "%";
    hpBarInner.className = "hp-bar-inner " + (pct > 50 ? "hp-green" : pct > 20 ? "hp-yellow" : "hp-red");
  }
  if (hpEl) hpEl.textContent = currentHP;
  if (hpMaxEl) hpMaxEl.textContent = maxHP;

  // Energy bar
  if (energyBar && energyText && maxEnergyText) {
    const pctEnergy = ((pokemon.currentEnergy || 0) / (pokemon.max_energy || 100)) * 100;
    energyBar.style.width = pctEnergy + "%";
    energyText.textContent = pokemon.currentEnergy || 0;
    maxEnergyText.textContent = pokemon.max_energy || 100;
  }

  // Sprite
  if (spriteImg) {
    spriteImg.src = getPokemonSprite(pokemon.pokemon_id, pokemon.shiny);
    spriteImg.alt = pokemon.pokemon_name;
    spriteImg.classList.remove("shiny", "glow", "starburst", "fainted", "fainted-animate");
    if (pokemon.shiny && currentHP > 0) spriteImg.classList.add("shiny", "glow", "starburst");
    if (currentHP <= 0) spriteImg.classList.add("fainted", "fainted-animate");
  }

  if (nameEl) nameEl.textContent = pokemon.shiny ? `✨ ${pokemon.pokemon_name}` : pokemon.pokemon_name;
  if (levelEl) levelEl.textContent = `Lv ${pokemon.level || 1}`;
  if (cpEl) cpEl.textContent = `CP ${pokemon.current_cp || 0}`;

  // Player moves
  if (isPlayer) {
    const allMoves = [...(pokemon.fast_moves || []), ...(pokemon.charged_moves || [])];
    for (let i = 0; i < 4; i++) {
      const btn = document.getElementById(`move${i}`);
      if (!btn) continue;

      if (!allMoves[i]) {
        btn.textContent = "—";
        btn.disabled = true;
        continue;
      }

      const moveData = window.movesDB.find(m => m.name === allMoves[i]);
      if (moveData) {
        btn.textContent = moveData.category === "Fast"
          ? `${moveData.name} (+${moveData.energyGain})`
          : `${moveData.name} (-${moveData.energy})`;
        btn.disabled = (moveData.category === "Charge" && (pokemon.currentEnergy || 0) < moveData.energy) || currentHP <= 0;
      } else {
        btn.textContent = allMoves[i];
        btn.disabled = currentHP <= 0;
      }
    }
  }
}

// ------------------ PLAYER & WILD TURN ------------------
// Wild encounter
function encounterWild() {
  resetWildSpritePosition(); 
  const player = window.player.party[window.player.activeIndex];
  if (!player) return;
  const route = window.currentRoute;
  if (!route || !route.wildPokemon?.length) return;

  let rand = Math.random();
  let chosen = route.wildPokemon[0];
  for (let i = 0; i < route.wildPokemon.length; i++) {
    if (rand < route.wildPokemon[i].rate) {
      chosen = route.wildPokemon[i];
      break;
    }
    rand -= route.wildPokemon[i].rate;
  }

  const base = window.pokemonDB.find(p => p.pokemon_name === chosen.name);
  if (!base) return;

  const [lvlMin, lvlMax] = route.levelRange || [1, 1];
  const level = Math.floor(Math.random() * (lvlMax - lvlMin + 1)) + lvlMin;
  const ivs = generateIVs();
  const isShiny = Math.random() < 0.05;

  const wild = {
    ...base,
    level,
    ivs,
    currentEnergy: 0,
    max_energy: 100,
    fast_moves: base.fast_moves || [],
    charged_moves: base.charged_moves || [],
    shiny: isShiny,
    talents: [],
  };

  assignTalents(wild);
  applyTalentModifiers(wild);

  wild.maxHP = Math.floor(wild.staTotal * 2);
  wild.currentHP = wild.maxHP;

  calculateCP(wild);
  wild.exp = wild.exp || 0;
  wild.expToNext = getPokemonExpToNext(wild.level);

  window.currentWild = wild;

  updateBattleScreen(player, true);
  updateBattleScreen(wild, false);
  renderParty();
  appendBattleLog(`A wild ${isShiny ? "✨ " : ""}${wild.pokemon_name} appeared!`);
}
// Player action
function playerTurn(action, options = {}) {
  const active = window.player.party[window.player.activeIndex];
  const wild = window.currentWild;
  if (!active) return;

  if (action === "attack" && wild) {
    const allMoves = [...(active.fast_moves || []), ...(active.charged_moves || [])];
    const moveName = allMoves[options.moveIndex];
    if (!moveName) return;

    const move = window.movesDB.find(m => m.name === moveName);
    if (!move) return;
    if (move.category === "Charge" && (active.currentEnergy || 0) < move.energy) return;

    const result = calculateDamage(active, wild, moveName);
    wild.currentHP = Math.max(0, wild.currentHP - result.damage);
    applyMoveEnergy(active, move);

    updateBattleScreen(active, true);
    updateBattleScreen(wild, false);
    appendBattleLog(`${active.pokemon_name} used ${moveName}! ${result.log}`, "player");

    if (wild.currentHP <= 0) {
      appendBattleLog(`${wild.pokemon_name} fainted!`, "player");
      wild.currentEnergy = 0;

      // --- LOOT & EXP ---
      const baseExp = 10 + wild.level * 2;
      const playerExp = Math.floor(baseExp * 0.5);
      const pokemonExp = baseExp;

      // Player EXP
      window.player.exp = (window.player.exp || 0) + playerExp;
      appendBattleLog(`You gained ${playerExp} EXP!`, "player");
      checkPlayerLevelUp();

      // Pokémon EXP
      levelUpPokemon(active, pokemonExp);

      // Coins loot
      const coins = Math.floor(Math.random() * 10 + 5);
      window.player.coins += coins;
      appendBattleLog(`You got ${coins} coins!`, "player");

      setTimeout(() => clearSprite(false, "No Wild Pokémon"), 900);
      window.currentWild = null;
      return;
    }

    setTimeout(wildTurn, 500);
  }

  if (action === "flee" && wild) {
    appendBattleLog(`You fled from the wild ${wild.pokemon_name}!`, "player");
    setTimeout(() => clearSprite(false, "No Wild Pokémon"), 300);
    window.currentWild = null;
  }
}

// Wild action
function wildTurn() {
  const active = window.player.party[window.player.activeIndex];
  const wild = window.currentWild;
  if (!active || !wild) return;

  const allMoves = [...(wild.fast_moves || []), ...(wild.charged_moves || [])];
  if (!allMoves.length) return;

  let moveName = allMoves[Math.floor(Math.random() * allMoves.length)];
  let move = window.movesDB.find(m => m.name === moveName);

  if (move?.category === "Charge" && (wild.currentEnergy || 0) < move.energy) {
    moveName = wild.fast_moves[Math.floor(Math.random() * wild.fast_moves.length)] || moveName;
    move = window.movesDB.find(m => m.name === moveName);
  }
  if (!move) return;

  const result = calculateDamage(wild, active, moveName);
  active.currentHP = Math.max(0, active.currentHP - result.damage);
  applyMoveEnergy(wild, move);

  updateBattleScreen(active, true);
  updateBattleScreen(wild, false);
  appendBattleLog(`${wild.pokemon_name} used ${moveName}! ${result.log}`, "wild");

  if (active.currentHP <= 0) {
    appendBattleLog(`${active.pokemon_name} fainted!`, "wild");
    active.currentEnergy = 0;
    setTimeout(() => clearSprite(true, "No Pokémon"), 900);

    const nextIndex = window.player.party.findIndex(p => p.currentHP > 0);
    if (nextIndex >= 0) {
      window.player.activeIndex = nextIndex;
      updateBattleScreen(window.player.party[nextIndex], true);
      appendBattleLog(`${window.player.party[nextIndex].pokemon_name} is now your active Pokémon!`, "player");
    }
  }
}

function resetWildSpritePosition(mode = "auto") {
  const wildSprite = document.getElementById("wildSprite");
  if (!wildSprite) return;

  // Reset classes & styles
  wildSprite.className = "";
  wildSprite.style.transition = "none";
  wildSprite.style.position = "absolute";
  wildSprite.style.opacity = "1";
  wildSprite.style.zIndex = "9999";

  // Detect file if auto
  if (mode === "auto") {
    const path = window.location.pathname;
    mode = path.includes("index-m") ? "mobile" : "pc";
  }

  // Set position & scale based on mode
  let top, left, scale;
  if (mode === "mobile") {
    top = "10%";
    left = "82%";
    scale = 1.8;
  } else {
    top = "10px";
    left = "165%";
    scale = 1;
  }

  wildSprite.style.top = top;
  wildSprite.style.left = left;
  wildSprite.style.transform = `translate(-50%, 0) scale(${scale}) rotate(0deg)`;

  // Apply smooth transition
  requestAnimationFrame(() => {
    wildSprite.style.transition = "transform 0.5s ease, opacity 0.5s ease";
  });
}


// ------------------ APPEND LOG ------------------
function appendBattleLog(message, source = "player") {
  const logBox = document.getElementById("battleMessage");
  if (!logBox) return;

  const entry = document.createElement("div");
  const color = source === "player" ? "green" : source === "wild" ? "red" : "white";
  entry.innerHTML = `<span style="color:${color}">${message}</span>`;
  logBox.appendChild(entry);
  logBox.scrollTop = logBox.scrollHeight;
}

// ------------------ LEVEL UP HELPERS ------------------
function checkPlayerLevelUp() {
  while (window.player.exp >= expToLevel(window.player.level)) {
    window.player.exp -= expToLevel(window.player.level);
    window.player.level++;
    appendBattleLog(`Player leveled up! Now Lv ${window.player.level}`, "player");
    document.getElementById("playerDisplay").textContent =
      `Lv: ${window.player.level} | EXP: ${window.player.exp} | Coins: ${window.player.coins}`;
  }
}

function levelUpPokemon(pokemon, expGain) {
  pokemon.exp = (pokemon.exp || 0) + expGain;
  if (!pokemon.expToNext) pokemon.expToNext = getPokemonExpToNext(pokemon.level);

  while (pokemon.exp >= pokemon.expToNext) {
    pokemon.exp -= pokemon.expToNext;
    pokemon.level++;
    pokemon.expToNext = getPokemonExpToNext(pokemon.level);
    appendBattleLog(`${pokemon.pokemon_name} leveled up! Now Lv ${pokemon.level}`, "player");

    applyTalentModifiers(pokemon);
    calculateCP(pokemon);
    syncCurrentHP(pokemon);
    updateBattleScreen(pokemon, true);
  }
}
