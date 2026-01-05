const MAX_LEVEL = 50;
const CPM_MAX_LEVEL = 30;

// ------------------ STARTER ------------------
function chooseRandomStarter() {
  const starters = window.pokemonDB.filter(p =>
    ["Bulbasaur", "Charmander", "Squirtle"].includes(p.pokemon_name)
  );
  if (!starters.length) return null;

  const starter = starters[Math.floor(Math.random() * starters.length)];
  const ivs = generateIVs();
  const nature = determineNature(ivs);
  const level = 3;

  if (!window.player) window.player = { level: 1, coins: 50, party: [], activeIndex: null };

  const starterPokemon = {
    ...starter,
    level,
    ivs,
    nature,
    currentHP: null,
    currentEnergy: 0,
    max_energy: 100,
    critRate: 0.05,
    critDmg: 1.5,
    dodgeRate: 0.05,
    isPlayer: true
  };

  assignTalents(starterPokemon);

  calculateStats(starterPokemon); // <-- now calculates stats including IV growth
  syncCurrentHP(starterPokemon);

  window.player.party[0] = starterPokemon;
  window.player.activeIndex = null;

  updatePartyDisplay();
  console.log("Starter chosen (party only):", starterPokemon);
  return starterPokemon;
}

// ------------------ TYPE CHART ------------------
const typeChart = {
  Normal:   { weak: ["Fighting"], resist: [], immune: ["Ghost"] },
  Fire:     { weak: ["Water", "Rock", "Ground"], resist: ["Fire", "Grass", "Ice", "Bug", "Steel", "Fairy"], immune: [] },
  Water:    { weak: ["Electric", "Grass"], resist: ["Fire", "Water", "Ice", "Steel"], immune: [] },
  Electric: { weak: ["Ground"], resist: ["Electric", "Flying", "Steel"], immune: [] },
  Grass:    { weak: ["Fire", "Ice", "Poison", "Flying", "Bug"], resist: ["Water", "Electric", "Grass", "Ground"], immune: [] },
  Ice:      { weak: ["Fire", "Fighting", "Rock", "Steel"], resist: ["Ice"], immune: [] },
  Fighting: { weak: ["Flying", "Psychic", "Fairy"], resist: ["Bug", "Rock", "Dark"], immune: [] },
  Poison:   { weak: ["Ground", "Psychic"], resist: ["Grass", "Fighting", "Poison", "Bug", "Fairy"], immune: [] },
  Ground:   { weak: ["Water", "Grass", "Ice"], resist: ["Poison", "Rock"], immune: ["Electric"] },
  Flying:   { weak: ["Electric", "Ice", "Rock"], resist: ["Grass", "Fighting", "Bug"], immune: ["Ground"] },
  Psychic:  { weak: ["Bug", "Ghost", "Dark"], resist: ["Fighting", "Psychic"], immune: [] },
  Bug:      { weak: ["Fire", "Flying", "Rock"], resist: ["Grass", "Fighting", "Ground"], immune: [] },
  Rock:     { weak: ["Water", "Grass", "Fighting", "Ground", "Steel"], resist: ["Normal", "Fire", "Poison", "Flying"], immune: [] },
  Ghost:    { weak: ["Ghost", "Dark"], resist: ["Poison", "Bug"], immune: ["Normal", "Fighting"] },
  Dragon:   { weak: ["Ice", "Dragon", "Fairy"], resist: ["Fire", "Water", "Electric", "Grass"], immune: [] },
  Dark:     { weak: ["Fighting", "Bug", "Fairy"], resist: ["Ghost", "Dark"], immune: ["Psychic"] },
  Steel:    { weak: ["Fire", "Fighting", "Ground"], resist: ["Normal", "Grass", "Ice", "Flying", "Psychic", "Bug", "Rock", "Dragon", "Steel", "Fairy"], immune: ["Poison"] },
  Fairy:    { weak: ["Poison", "Steel"], resist: ["Fighting", "Bug", "Dark"], immune: ["Dragon"] },
};

// ------------------ GET TYPE MULTIPLIER ------------------
function getTypeMultiplier(moveType, defenderTypes = []) {
  if (!defenderTypes || defenderTypes.length === 0) return 1;

  let multiplier = 1;

  defenderTypes.forEach(defType => {
    const typeData = typeChart[defType];
    if (!typeData) return;

    if (typeData.immune.includes(moveType)) multiplier *= 0;
    else if (typeData.weak.includes(moveType)) multiplier *= 2;
    else if (typeData.resist.includes(moveType)) multiplier *= 0.5;
  });

  return multiplier;
}




// ------------------ IV GENERATION ------------------
function generateIVs() {
  return {
    attack: Math.floor(Math.random() * 16),
    defense: Math.floor(Math.random() * 16),
    stamina: Math.floor(Math.random() * 16)
  };
}

// ------------------ CALCULATE STATS WITH IV ------------------
function calculateStats(pokemon) {
  const level = Math.min(pokemon.level || 1, MAX_LEVEL);
  const cpm = CPM[Math.min(level, CPM_MAX_LEVEL)];
  const levelMultiplier = 1 + (level - 1) * 0.02;

  // Base scaled stats
  const baseAtk = (pokemon.base_attack || 10) * cpm * levelMultiplier;
  const baseDef = (pokemon.base_defense || 10) * cpm * levelMultiplier;
  const baseSta = (pokemon.base_stamina || 10) * cpm * levelMultiplier;

  // --- IV scaling factor (makes IVs matter more) ---
  const ivAtkFactor = 0.7 + (pokemon.ivs?.attack || 0) / 15 * 0.3;
  const ivDefFactor = 0.7 + (pokemon.ivs?.defense || 0) / 15 * 0.3;
  const ivStaFactor = 0.7 + (pokemon.ivs?.stamina || 0) / 15 * 0.3;

  let atk = Math.max(5, baseAtk * ivAtkFactor);
  let def = Math.max(5, baseDef * ivDefFactor);
  let sta = Math.max(10, baseSta * ivStaFactor);

  // Apply talents
  if (pokemon.talents?.length) {
    const talentScale = level / MAX_LEVEL;
    let atkBonus = 0, defBonus = 0, staBonus = 0;
    let critRateBonus = 0, critDmgBonus = 0, dodgeBonus = 0;

    pokemon.talents.forEach(t => {
      atkBonus += (t.atk || 0) * talentScale;
      defBonus += (t.def || 0) * talentScale;
      staBonus += (t.sta || 0) * talentScale;
      critRateBonus += (t.critRate || 0) * talentScale;
      critDmgBonus += (t.critDmg || 0) * talentScale;
      dodgeBonus += (t.dodgeRate || 0) * talentScale;
    });

    atk += atkBonus;
    def += defBonus;
    sta += staBonus;

    pokemon.critRateTotal = (pokemon.critRate || 0.05) + critRateBonus;
    pokemon.critDmgTotal = (pokemon.critDmg || 1.5) + critDmgBonus;
    pokemon.dodgeRateTotal = (pokemon.dodgeRate || 0.05) + dodgeBonus;

    pokemon.bonusApplied = {
      atk: atkBonus.toFixed(1),
      def: defBonus.toFixed(1),
      sta: staBonus.toFixed(1),
      critRate: critRateBonus.toFixed(2),
      critDmg: critDmgBonus.toFixed(2),
      dodge: dodgeBonus.toFixed(2)
    };
  } else {
    pokemon.critRateTotal = pokemon.critRate || 0.05;
    pokemon.critDmgTotal = pokemon.critDmg || 1.5;
    pokemon.dodgeRateTotal = pokemon.dodgeRate || 0.05;
  }

  pokemon.atkTotal = atk;
  pokemon.defTotal = def;
  pokemon.staTotal = sta;

  calculateCP(pokemon); // recalc CP after stats
}

// ------------------ NATURE DETERMINATION ------------------
function determineNature(ivs) {
  const { attack: atk = 0, defense: def = 0, stamina: sta = 0 } = ivs;
  const total = atk + def + sta;

  if (total === 45) return "Mythical";
  if (total >= 42) return "Legendary";

  const stats = [
    { name: "atk", value: atk },
    { name: "def", value: def },
    { name: "sta", value: sta }
  ];

  const top = stats.filter(s => s.value >= 10).map(s => s.name).sort();
  if (top.length === 2) {
    if (top.join() === "atk,def") return "Mighty";
    if (top.join() === "atk,sta") return "Fierce";
    if (top.join() === "def,sta") return "Sturdy";
  } else if (top.length === 1) {
    return { atk: "Brave", def: "Timid", sta: "Bold" }[top[0]];
  }

  if (atk === def && def === sta) {
    if (atk <= 3) return "Humble";
    if (atk <= 6) return "Steady";
    if (atk <= 9) return "Solid";
    return "Prime";
  }

  const maxIV = Math.max(atk, def, sta);
  if (maxIV <= 3) return "Mild";
  if (maxIV <= 6) return "Plain";
  if (maxIV <= 9) return "Rookie";

  return "Neutral";
}



// ---------- NATURE COLOR MAP ----------
const natureColors = {
  Mythical: "red",
  Legendary: "yellow",
  Prime: "purple",   // Prime moved to Epic group
  Mighty: "purple",
  Fierce: "purple",
  Sturdy: "purple",
  Bold: "blue",
  Steady: "blue",
  Solid: "blue",
  Brave: "blue",
  Timid: "green",
  Mild: "green",
  Plain: "green",
  Humble: "white",
  Rookie: "white",
  Neutral: "white"
};






// Map each talent pool name to an icon
const talentNameToIcon = {
  "Energetic": "Sword",
  "Clumsy": "Fire",
  "Tough": "Shield",
  "Agile": "Tornado",
  "Resistant": "Target",
  "Sharp": "Zap",
  "Focused": "Wind",
  "Resilient": "Diamond",
  "Swift": "Triangle",
  "Balanced": "Balance",
  "Nimble": "Trinity",
  "Keen": "Zap",
  "Savage": "Sword",
  "Fortified": "Shield",
  "Precision": "Target",
  "Vigilant": "Wind",
  "Feral": "Fire",
  "Sharpshooter": "Diamond",
  "Berserker": "Sword",
  "Guardian": "Shield",
  "Deadeye": "Target",
  "Stormbringer": "Tornado",
  "Ironwall": "Diamond",
  "Dodgemaster": "Wind",
  "Titan": "Sword",
  "Phantom": "Zap",
  "Invoker": "Fire",
  "Warbringer": "Tornado",
  "Shieldbearer": "Shield",
  "Trickster": "Wind",
  "Godspeed": "Sword",
  "Eclipse": "Fire",
  "Solarflare": "Zap",
  "Aegis": "Shield",
  "Shadowstep": "Tornado",
  "Overlord": "Diamond"
};
const talentIcons = {
  "Sword":       "-10px  -17px",
  "Fire":        "-193px -17px",
  "Zap":         "-228px -17px",
  "Shield":      "-262px -17px",
  "Tornado":     "-10px -209px",
  "Target":      "-193px -209px",
  "Wind":        "-228px -209px",
  "Spark":       "-263px -209px",
  "Balance":     "-10px -253px",
  "Trinity":     "-193px -253px",
  "Diamond":     "-228px -253px",
  "Triangle":    "-263px -253px",
};



function renderTalentWithIcon(talent) {
  const iconName = talentNameToIcon[talent.name] || "Sword"; // default
  const bgPos = talentIcons[iconName] || "0 0";

  const color = talent.color || "white"; // assigned in assignTalents

  return `
    <span style="display:flex; align-items:center; gap:6px; color:${color};">
      <span style="
        width:31px; height:34px; /* slightly bigger for the outer hex layer */
        display:inline-flex;
        align-items:center;
        justify-content:center;
        background: rgba(255,255,255,0.1); /* outer layer color */
        clip-path: polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%);
      ">
        <span style="
          width:25px; height:28px; 
          display:inline-block;
          background-image:url('img/icon.png');
          background-size: 150px 149px;
          background-position: ${bgPos};
          clip-path: polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%);
        "></span>
      </span>
      ${talent.name}
    </span>
  `;
}






const talentPools = {
  Common: [
    { name: "Energetic", atk: +5, def: 0, sta: 0 },
    { name: "Clumsy", atk: -5, def: 0, sta: +5 },
    { name: "Tough", def: +5, sta: +5, atk: 0 },
    { name: "Agile", dodgeRate: +0.02 },
    { name: "Resistant", def: +3, sta: +3 },
    { name: "Sharp", atk: +3 }
  ],
  Uncommon: [
    { name: "Focused", atk: +7, critRate: +0.05 },
    { name: "Resilient", def: +7, sta: +3 },
    { name: "Swift", fastAtkBoost: +5, dodgeRate: +0.03 },
    { name: "Balanced", atk: +3, def: +3, sta: +3 },
    { name: "Nimble", dodgeRate: +0.05 },
    { name: "Keen", critRate: +0.04, atk: +4 }
  ],
  Rare: [
    { name: "Savage", atk: +10, def: -5 },
    { name: "Fortified", def: +10, sta: +5 },
    { name: "Precision", critRate: +0.07, critDmg: +0.07 },
    { name: "Vigilant", def: +5, dodgeRate: +0.05 },
    { name: "Feral", atk: +8, sta: +4 },
    { name: "Sharpshooter", critRate: +0.08, critDmg: +0.05 }
  ],
  Epic: [
    { name: "Berserker", atk: +15, def: -10, critRate: +0.05 },
    { name: "Guardian", def: +15, sta: +10, atk: -5 },
    { name: "Deadeye", critRate: +0.10, critDmg: +0.15, dodgeRate: -0.05 },
    { name: "Stormbringer", atk: +12, critRate: +0.08 },
    { name: "Ironwall", def: +12, sta: +8 },
    { name: "Dodgemaster", dodgeRate: +0.08, atk: +4 }
  ],
  Legendary: [
    { name: "Titan", atk: +20, def: +10, sta: +15 },
    { name: "Phantom", critRate: +0.15, critDmg: +0.20, dodgeRate: +0.10, def: -5 },
    { name: "Invoker", atk: +15, critDmg: +0.15, sta: -5 },
    { name: "Warbringer", atk: +18, sta: +10 },
    { name: "Shieldbearer", def: +18, sta: +12, atk: -5 },
    { name: "Trickster", critRate: +0.12, dodgeRate: +0.12, def: -5 }
  ],
  Mythical: [
    { name: "Godspeed", atk: +25, def: +25, sta: +25, critRate: +0.15, critDmg: +0.15 },
    { name: "Eclipse", atk: +30, critRate: +0.20, dodgeRate: +0.15, def: -10 },
    { name: "Solarflare", atk: +28, critDmg: +0.20, sta: +15 },
    { name: "Aegis", def: +30, sta: +20, atk: -5 },
    { name: "Shadowstep", dodgeRate: +0.20, critRate: +0.15, atk: +10 },
    { name: "Overlord", atk: +35, def: +10, sta: +10, critDmg: +0.15 }
  ]
};
// ------------------ TALENTS ------------------
function assignTalents(pokemon) {
  const assignedTalents = [];
  const talentCount = Math.random() < 0.5 ? 1 : 2;

  const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

  for (let i = 0; i < talentCount; i++) {
    let pool, rarity;
    const roll = Math.random();
    if (roll < 0.01) { pool = [...talentPools.Mythical]; rarity = "Mythical"; }
    else if (roll < 0.05) { pool = [...talentPools.Legendary]; rarity = "Legendary"; }
    else if (roll < 0.15) { pool = [...talentPools.Epic]; rarity = "Epic"; }
    else if (roll < 0.35) { pool = [...talentPools.Rare]; rarity = "Rare"; }
    else if (roll < 0.65) { pool = [...talentPools.Uncommon]; rarity = "Uncommon"; }
    else { pool = [...talentPools.Common]; rarity = "Common"; }

    const availablePool = pool.filter(t => !assignedTalents.some(at => at.name === t.name));
    if (availablePool.length === 0) continue;

    const talent = shuffleArray(availablePool)[0];
    const colorMap = { Mythical: "red", Legendary: "yellow", Epic: "purple", Rare: "orange", Uncommon: "green", Common: "white" };
    assignedTalents.push({ ...talent, rarity, color: colorMap[rarity] });
  }

  pokemon.talents = assignedTalents;
  calculateStats(pokemon); // <-- apply talents immediately
  return assignedTalents;
}




function applyTalentModifiers(pokemon) {
  const level = pokemon.level || 1;
  const effectiveLevel = Math.min(level, MAX_LEVEL);

  // --- CPM stops at 30
  const cpmLevel = Math.min(effectiveLevel, CPM_MAX_LEVEL);
  const cpm = CPM[cpmLevel];

  // --- True level scaling (locks at 50)
  const levelMultiplier = 1 + (effectiveLevel - 1) * 0.02;

  const scaledBaseAtk = (pokemon.base_attack || 10) * cpm * levelMultiplier;
  const scaledBaseDef = (pokemon.base_defense || 10) * cpm * levelMultiplier;
  const scaledBaseSta = (pokemon.base_stamina || 10) * cpm * levelMultiplier;

  // --- Talent scaling locked to 50
  const talentScale = effectiveLevel / MAX_LEVEL;

  let atkBonus = 0, defBonus = 0, staBonus = 0;
  let critRateBonus = 0, critDmgBonus = 0, dodgeBonus = 0;

  pokemon.talents?.forEach(t => {
    atkBonus += (t.atk || 0) * talentScale;
    defBonus += (t.def || 0) * talentScale;
    staBonus += (t.sta || 0) * talentScale;
    critRateBonus += (t.critRate || 0) * talentScale;
    critDmgBonus += (t.critDmg || 0) * talentScale;
    dodgeBonus += (t.dodgeRate || 0) * talentScale;
  });

  pokemon.atkTotal = Math.max(5, scaledBaseAtk + (pokemon.ivs?.attack || 0) + atkBonus);
  pokemon.defTotal = Math.max(5, scaledBaseDef + (pokemon.ivs?.defense || 0) + defBonus);
  pokemon.staTotal = Math.max(10, scaledBaseSta + (pokemon.ivs?.stamina || 0) + staBonus);

  pokemon.critRateTotal = (pokemon.critRate || 0.05) + critRateBonus;
  pokemon.critDmgTotal = (pokemon.critDmg || 1.5) + critDmgBonus;
  pokemon.dodgeRateTotal = (pokemon.dodgeRate || 0.05) + dodgeBonus;

  pokemon.bonusApplied = {
    atk: atkBonus.toFixed(1),
    def: defBonus.toFixed(1),
    sta: staBonus.toFixed(1),
    critRate: critRateBonus.toFixed(2),
    critDmg: critDmgBonus.toFixed(2),
    dodge: dodgeBonus.toFixed(2)
  };
}



// ------------------ CP CALCULATION ------------------
// Existing CPM table up to level 30
const CPM = {
  1: 0.094, 1.5:0.135, 2:0.1664, 2.5:0.192, 3:0.2157, 3.5:0.236, 4:0.2557,
  5:0.273, 5.5:0.291, 6:0.3, 6.5:0.315, 7:0.33, 7.5:0.345, 8:0.36, 8.5:0.375,
  9:0.39, 9.5:0.405, 10:0.42, 10.5:0.435, 11:0.45, 11.5:0.465, 12:0.48,
  12.5:0.495, 13:0.51, 13.5:0.525, 14:0.54, 14.5:0.555, 15:0.57, 15.5:0.585,
  16:0.6, 16.5:0.615, 17:0.63, 17.5:0.645, 18:0.66, 18.5:0.675, 19:0.69,
  19.5:0.705, 20:0.72, 20.5:0.735, 21:0.75, 21.5:0.765, 22:0.78, 22.5:0.795,
  23:0.81, 23.5:0.825, 24:0.84, 24.5:0.855, 25:0.87, 25.5:0.885, 26:0.9,
  26.5:0.915, 27:0.93, 27.5:0.945, 28:0.96, 28.5:0.975, 29:0.99, 29.5:1.0,
  30:1.0
};

// Extend CPM linearly from 30 → 50
for (let i = 31; i <= 50; i++) {
  CPM[i] = CPM[i - 1] + 0.01; // example small increment per level
}


// ------------------ CP CALCULATION ------------------
function calculateCP(pokemon) {
  const level = pokemon.level || 1;
  const effectiveLevel = Math.min(level, MAX_LEVEL);
  const cpm = CPM[Math.min(effectiveLevel, CPM_MAX_LEVEL)];

  const atk = pokemon.atkTotal;
  const def = pokemon.defTotal;
  const sta = pokemon.staTotal;

  let cp = Math.floor((atk * Math.sqrt(def) * Math.sqrt(sta) * cpm * cpm) / 10);

  // Early-game caps
  if (effectiveLevel <= 3) cp = Math.min(cp, 55);
  else if (effectiveLevel <= 5) cp = Math.min(cp, 90);
  else if (effectiveLevel <= 10) cp = Math.min(cp, 180);

  cp = Math.max(10, cp);

  // Apply talent-based max CP bonus
  const bonus = calculateBonusMaxCP(pokemon);
  const baseMaxCP = pokemon.max_cp || 100;
  pokemon.current_cp = Math.min(cp, baseMaxCP + bonus);
  pokemon.finalMaxCP = baseMaxCP + bonus;

  return pokemon.current_cp;
}

function calculateBonusMaxCP(pokemon) {
  const effectiveLevel = Math.min(pokemon.level || 1, MAX_LEVEL);
  const talentScale = effectiveLevel / MAX_LEVEL;

  let bonusPercent = 0;
  pokemon.talents?.forEach(t => {
    if (t.atk > 0) bonusPercent += t.atk * 0.002;
    if (t.def > 0) bonusPercent += t.def * 0.0015;
    if (t.sta > 0) bonusPercent += t.sta * 0.0025;
  });

  bonusPercent *= talentScale;
  const baseMax = pokemon.max_cp || 100;
  return Math.min(Math.floor(baseMax * bonusPercent), baseMax * 0.25);
}


function calculateDamage(attacker, defender, moveName) {
  const move = window.movesDB.find(m => m.name === moveName);
  if (!move) return { damage: 1, log: "Move not found" };

  // --- Step 1: Get attacker & defender total stats (IVs + talents)
  const atk = attacker.atkTotal ?? (attacker.base_attack + (attacker.ivs?.attack || 0));
  const def = defender.defTotal ?? (defender.base_defense + (defender.ivs?.defense || 0));

  // --- Step 2: Base damage formula
  const movePower = move.power || 10;
  const levelMultiplier = 0.5 + (attacker.level || 5) / 20;
  let baseDamage = movePower * (atk / def) * levelMultiplier;

  // --- Step 3: STAB (Same Type Attack Bonus)
  const stab = attacker.type?.includes(move.type) ? 1.2 : 1.0;

  // --- Step 4: Type effectiveness
  const typeMultiplier = getTypeMultiplier(move.type, defender.type || []);

  // --- Step 5: Random variance (0.85 ~ 1.0)
  const rand = 0.85 + Math.random() * 0.15;

  // --- Step 6: Pre-crit damage
  let damage = Math.floor(baseDamage * stab * typeMultiplier * rand);
  if (damage < 1) damage = 1;

  // --- Step 7: Critical hit & dodge
  const critHit = Math.random() < (attacker.critRateTotal ?? 0.05);
  const dodge = !critHit && Math.random() < (defender.dodgeRateTotal ?? 0.05);

  let finalDamage;
  if (critHit) finalDamage = Math.floor(damage * (attacker.critDmgTotal ?? 1.5));
  else if (dodge) finalDamage = 0;
  else finalDamage = damage;

  // --- Step 8: Build detailed battle log
  const logParts = [];
  if (critHit) logParts.push("💥 Critical Hit!");
  if (!critHit && dodge) logParts.push("🛡️ Attack Dodged!");
  if (finalDamage > 0) logParts.push(`⚔️ ${finalDamage} damage`);

  if (typeMultiplier === 0) logParts.push("❌ No Effect!");
  else if (typeMultiplier > 1) logParts.push("🔥 Super Effective!");
  else if (typeMultiplier < 1) logParts.push("💧 Not Very Effective...");

  // Optional: Add STAB info to log
  if (stab > 1) logParts.push("⚡ STAB applied!");

  return { damage: finalDamage, log: logParts.join(" ") };
}

// ------------------ SYNC HP ------------------
function syncCurrentHP(pokemon) {
  if (!pokemon.staTotal) return;

  const oldMax = pokemon.maxHP || Math.floor(pokemon.staTotal * 2);
  const newMax = Math.floor(pokemon.staTotal * 2);
  const ratio = pokemon.currentHP != null && oldMax > 0 ? pokemon.currentHP / oldMax : 1;

  pokemon.maxHP = newMax;
  pokemon.currentHP = Math.floor(newMax * ratio);
  pokemon.currentHP = Math.max(0, Math.min(pokemon.currentHP, pokemon.maxHP));
}

function getRandomTalents(pokemon, maxTalents = 2) {
  if (!pokemon) return [];

  const assigned = [];
  const talentCount = Math.min(maxTalents, 1 + Math.floor(Math.random() * 2)); // 1 or 2 talents

  const rarityRoll = () => {
    const r = Math.random();
    if (r < 0.01) return "Mythical";
    if (r < 0.05) return "Legendary";
    if (r < 0.15) return "Epic";
    if (r < 0.35) return "Rare";
    if (r < 0.65) return "Uncommon";
    return "Common";
  };

  for (let i = 0; i < talentCount; i++) {
    const rarity = rarityRoll();
    const pool = [...talentPools[rarity]];

    // Remove already assigned talents
    const available = pool.filter(t => !assigned.some(a => a.name === t.name));
    if (available.length === 0) continue;

    const talent = available[Math.floor(Math.random() * available.length)];

    const colorMap = {
      Mythical: "red",
      Legendary: "yellow",
      Epic: "purple",
      Rare: "orange",
      Uncommon: "green",
      Common: "white"
    };

    assigned.push({ ...talent, rarity, color: colorMap[rarity] });
  }

  // Apply bonuses to Pokémon
  applyTalentModifiers({ ...pokemon, talents: assigned });

  return assigned;
}


// ------------------ ENERGY HANDLING ------------------
function applyMoveEnergy(pokemon, move) {
  if (!move) return;
  if (move.category === "Fast") {
    pokemon.currentEnergy += move.energyGain || 0;
    if (pokemon.currentEnergy > pokemon.max_energy) pokemon.currentEnergy = pokemon.max_energy;
  } else if (move.category === "Charge") {
    pokemon.currentEnergy -= move.energy || 0;
    if (pokemon.currentEnergy < 0) pokemon.currentEnergy = 0;
  }
}

// ------------------ INIT ------------------
window.addEventListener("DOMContentLoaded", () => {
  if (!window.player?.party?.length) chooseRandomStarter();
});




