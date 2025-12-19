window.routes = [

/* ================= EARLY GAME ================= */

{
  name: "Route 1",
  region: "Kanto",
  levelRange: [1,3],
  wildPokemon: [
    { name: "Pidgey", rate: 0.18 },
    { name: "Rattata", rate: 0.18 },
    { name: "Caterpie", rate: 0.14 },
    { name: "Weedle", rate: 0.14 },
    { name: "Metapod", rate: 0.08 },
    { name: "Kakuna", rate: 0.08 },
    { name: "Nidoran♀", rate: 0.05 },
    { name: "Nidoran♂", rate: 0.05 }
  ],
  unlockCondition: () => player.level >= 1
},

{
  name: "Route 2",
  region: "Kanto",
  levelRange: [4,7],
  wildPokemon: [
    { name: "Pidgey", rate: 0.15 },
    { name: "Spearow", rate: 0.12 },
    { name: "Ekans", rate: 0.12 },
    { name: "Sandshrew", rate: 0.12 },
    { name: "Butterfree", rate: 0.08 },
    { name: "Beedrill", rate: 0.08 },
    { name: "Oddish", rate: 0.07 },
    { name: "Bellsprout", rate: 0.06 }
  ],
  unlockCondition: () => player.level >= 4
},

{
  name: "Route 3",
  region: "Kanto",
  levelRange: [7,10],
  wildPokemon: [
    { name: "Zubat", rate: 0.15 },
    { name: "Paras", rate: 0.12 },
    { name: "Venonat", rate: 0.1 },
    { name: "Meowth", rate: 0.1 },
    { name: "Psyduck", rate: 0.08 },
    { name: "Poliwag", rate: 0.08 },
    { name: "Diglett", rate: 0.05 },
    { name: "Clefairy", rate: 0.04 }
  ],
  unlockCondition: () => player.level >= 7
},

/* ================= MID GAME ================= */

{
  name: "Route 4",
  region: "Kanto",
  levelRange: [10,14],
  wildPokemon: [
    { name: "Geodude", rate: 0.15 },
    { name: "Machop", rate: 0.15 },
    { name: "Magnemite", rate: 0.12 },
    { name: "Voltorb", rate: 0.1 },
    { name: "Onix", rate: 0.06 },
    { name: "Oddish", rate: 0.08 },
    { name: "Bellsprout", rate: 0.08 }
  ],
  unlockCondition: () => player.level >= 10
},

{
  name: "Route 5",
  region: "Kanto",
  levelRange: [14,18],
  wildPokemon: [
    { name: "Mankey", rate: 0.14 },
    { name: "Machop", rate: 0.14 },
    { name: "Grimer", rate: 0.12 },
    { name: "Koffing", rate: 0.12 },
    { name: "Sandshrew", rate: 0.1 },
    { name: "Ekans", rate: 0.1 }
  ],
  unlockCondition: () => player.level >= 14
},

{
  name: "Route 6",
  region: "Kanto",
  levelRange: [18,22],
  wildPokemon: [
    { name: "Ivysaur", rate: 0.12 },
    { name: "Charmeleon", rate: 0.12 },
    { name: "Wartortle", rate: 0.12 },
    { name: "Kadabra", rate: 0.1 },
    { name: "Machoke", rate: 0.1 },
    { name: "Haunter", rate: 0.08 }
  ],
  unlockCondition: () => player.level >= 18
},

/* ================= LATE GAME ================= */

{
  name: "Victory Road",
  region: "Kanto",
  levelRange: [30,40],
  wildPokemon: [
    { name: "Rhyhorn", rate: 0.15 },
    { name: "Rhydon", rate: 0.1 },
    { name: "Machoke", rate: 0.12 },
    { name: "Graveler", rate: 0.12 },
    { name: "Onix", rate: 0.08 }
  ],
  unlockCondition: () => player.level >= 30
}
];
window.routes.push({
  name: "Safari Zone",
  region: "Kanto",
  levelRange: [25,35],
  wildPokemon: [
    { name: "Tauros", rate: 0.08 },
    { name: "Kangaskhan", rate: 0.06 },
    { name: "Chansey", rate: 0.05 },
    { name: "Scyther", rate: 0.06 },
    { name: "Pinsir", rate: 0.06 },
    { name: "Exeggcute", rate: 0.1 },
    { name: "Lickitung", rate: 0.04 }
  ],
  unlockCondition: () => player.level >= 25
});



window.routes.push({
  name: "Fossil Lab",
  region: "Kanto",
  levelRange: [35,45],
  wildPokemon: [
    { name: "Omanyte", rate: 0.08 },
    { name: "Kabuto", rate: 0.08 },
    { name: "Aerodactyl", rate: 0.03 }
  ],
  unlockCondition: () => player.level >= 35
});



window.routes.push({
  name: "Seafoam Islands",
  region: "Kanto",
  levelRange: [45,60],
  wildPokemon: [
    { name: "Articuno", rate: 0.005 },
    { name: "Jynx", rate: 0.08 },
    { name: "Lapras", rate: 0.05 }
  ],
  unlockCondition: () => player.level >= 45
});

window.routes.push({
  name: "Power Plant",
  region: "Kanto",
  levelRange: [45,60],
  wildPokemon: [
    { name: "Zapdos", rate: 0.005 },
    { name: "Electabuzz", rate: 0.08 },
    { name: "Magneton", rate: 0.1 }
  ],
  unlockCondition: () => player.level >= 45
});

window.routes.push({
  name: "Mt. Ember",
  region: "Kanto",
  levelRange: [45,60],
  wildPokemon: [
    { name: "Moltres", rate: 0.005 },
    { name: "Magmar", rate: 0.08 },
    { name: "Rapidash", rate: 0.06 }
  ],
  unlockCondition: () => player.level >= 45
});


window.routes.push({
  name: "Cerulean Cave",
  region: "Kanto",
  levelRange: [60,75],
  wildPokemon: [
    { name: "Mewtwo", rate: 0.003 },
    { name: "Ditto", rate: 0.05 },
    { name: "Dragonite", rate: 0.04 }
  ],
  unlockCondition: () => player.level >= 60
});







window.routes.push (

  {
    name: "New Bark Town Route",
    region: "Johto",
    levelRange: [1,3],
    wildPokemon: [
      { name: "Sentret", rate: 0.20 },
      { name: "Hoothoot", rate: 0.20 },
      { name: "Rattata", rate: 0.15 },
      { name: "Pidgey", rate: 0.10 },
      { name: "Chikorita", rate: 0.05 },
      { name: "Cyndaquil", rate: 0.05 },
      { name: "Totodile", rate: 0.05 }
    ],
    unlockCondition: () => player.level >= 1
  },
  {
    name: "Route 29",
    region: "Johto",
    levelRange: [3,5],
    wildPokemon: [
      { name: "Sentret", rate: 0.18 },
      { name: "Hoothoot", rate: 0.18 },
      { name: "Rattata", rate: 0.12 },
      { name: "Pidgey", rate: 0.12 },
      { name: "Mareep", rate: 0.10 },
      { name: "Hoppip", rate: 0.10 },
      { name: "Wooper", rate: 0.05 },
      { name: "Spinarak", rate: 0.05 }
    ],
    unlockCondition: () => player.level >= 3
  },
  {
    name: "Route 30",
    region: "Johto",
    levelRange: [5,10],
    wildPokemon: [
      { name: "Mareep", rate: 0.20 },
      { name: "Hoppip", rate: 0.15 },
      { name: "Wooper", rate: 0.15 },
      { name: "Sentret", rate: 0.10 },
      { name: "Hoothoot", rate: 0.10 },
      { name: "Spinarak", rate: 0.10 },
      { name: "Pidgey", rate: 0.05 },
      { name: "Rattata", rate: 0.05 }
    ],
    unlockCondition: () => player.level >= 5
  },

  {
    name: "Route 31",
    region: "Johto",
    levelRange: [10,15],
    wildPokemon: [
      { name: "Wooper", rate: 0.18 },
      { name: "Mareep", rate: 0.15 },
      { name: "Hoppip", rate: 0.15 },
      { name: "Pidgeotto", rate: 0.10 },
      { name: "Sentret", rate: 0.10 },
      { name: "Hoothoot", rate: 0.08 },
      { name: "Spinarak", rate: 0.08 },
      { name: "Ledyba", rate: 0.06 }
    ],
    unlockCondition: () => player.level >= 10
  },
  {
    name: "Route 32",
    region: "Johto",
    levelRange: [15,18],
    wildPokemon: [
      { name: "Furret", rate: 0.15 },
      { name: "Aipom", rate: 0.12 },
      { name: "Mareep", rate: 0.12 },
      { name: "Wooper", rate: 0.10 },
      { name: "Hoppip", rate: 0.10 },
      { name: "Ledyba", rate: 0.08 },
      { name: "Spinarak", rate: 0.08 },
      { name: "Pidgeotto", rate: 0.05 }
    ],
    unlockCondition: () => player.level >= 15
  },
  {
    name: "Route 33",
    region: "Johto",
    levelRange: [18,23],
    wildPokemon: [
      { name: "Furret", rate: 0.15 },
      { name: "Girafarig", rate: 0.10 },
      { name: "Aipom", rate: 0.12 },
      { name: "Mareep", rate: 0.10 },
      { name: "Wooper", rate: 0.10 },
      { name: "Ledyba", rate: 0.08 },
      { name: "Spinarak", rate: 0.05 },
      { name: "Pidgeotto", rate: 0.05 }
    ],
    unlockCondition: () => player.level >= 18
  },

  // ------------------ LATE ROUTES ------------------
  {
    name: "Route 34",
    region: "Johto",
    levelRange: [23,27],
    wildPokemon: [
      { name: "Heracross", rate: 0.10 },
      { name: "Girafarig", rate: 0.10 },
      { name: "Aipom", rate: 0.12 },
      { name: "Furret", rate: 0.12 },
      { name: "Mareep", rate: 0.08 },
      { name: "Wooper", rate: 0.08 },
      { name: "Ledian", rate: 0.05 },
      { name: "Pidgeot", rate: 0.05 }
    ],
    unlockCondition: () => player.level >= 23
  },
  {
    name: "Route 35 (Cave)",
    region: "Johto",
    levelRange: [27,34],
    wildPokemon: [
      { name: "Zubat", rate: 0.20 },
      { name: "Geodude", rate: 0.15 },
      { name: "Onix", rate: 0.10 },
      { name: "Golbat", rate: 0.10 },
      { name: "Steelix", rate: 0.05 },
      { name: "Machop", rate: 0.05 },
      { name: "Graveler", rate: 0.05 },
      { name: "Magneton", rate: 0.05 }
    ],
    unlockCondition: () => player.level >= 27
  },

  // ------------------ SPECIAL ROUTES ------------------
  {
    name: "Ilex Forest",
    region: "Johto",
    levelRange: [10,18],
    wildPokemon: [
      { name: "Aipom", rate: 0.12 },
      { name: "Spinarak", rate: 0.12 },
      { name: "Ledyba", rate: 0.10 },
      { name: "Hoothoot", rate: 0.10 },
      { name: "Chikorita", rate: 0.05 },
      { name: "Cyndaquil", rate: 0.05 },
      { name: "Totodile", rate: 0.05 }
    ],
    unlockCondition: () => player.level >= 10
  },
  {
    name: "Lake of Rage",
    region: "Johto",
    levelRange: [30,40],
    wildPokemon: [
      { name: "Gyarados", rate: 0.05 },
      { name: "Magikarp", rate: 0.25 },
      { name: "Poliwhirl", rate: 0.10 },
      { name: "Slowpoke", rate: 0.05 },
      { name: "Wooper", rate: 0.05 },
      { name: "Quagsire", rate: 0.05 },
      { name: "Lapras", rate: 0.02 }
    ],
    unlockCondition: () => player.level >= 30
  },

  // ------------------ LEGENDARY ROUTES ------------------
  {
    name: "Ho-Oh Peak",
    region: "Johto",
    levelRange: [50,70],
    wildPokemon: [
      { name: "Ho-Oh", rate: 0.01 },
      { name: "Raikou", rate: 0.01 },
      { name: "Entei", rate: 0.01 },
      { name: "Suicune", rate: 0.01 },
      { name: "Dragonite", rate: 0.03 }
    ],
    unlockCondition: () => player.level >= 50
  },
  {
    name: "Lugia Cave",
    region: "Johto",
    levelRange: [50,70],
    wildPokemon: [
      { name: "Lugia", rate: 0.01 },
      { name: "Articuno", rate: 0.01 },
      { name: "Zapdos", rate: 0.01 },
      { name: "Moltres", rate: 0.01 },
      { name: "Gyarados", rate: 0.03 }
    ],
    unlockCondition: () => player.level >= 50
  }
);

// ------------------ ADDITIONAL ROUTES FOR MISSING JOHTO POKEMON ------------------
window.routes.push(
  {
    name: "Sprout Tower Area",
    region: "Johto",
    levelRange: [5,12],
    wildPokemon: [
      { name: "Bellsprout", rate: 0.15 },
      { name: "Oddish", rate: 0.15 },
      { name: "Hoothoot", rate: 0.10 },
      { name: "Pidgey", rate: 0.10 },
      { name: "Gastly", rate: 0.08 },
      { name: "Haunter", rate: 0.05 },
      { name: "Bellsprout", rate: 0.07 }
    ],
    unlockCondition: () => player.level >= 5
  },
  {
    name: "Azalea Forest",
    region: "Johto",
    levelRange: [8,15],
    wildPokemon: [
      { name: "Togepi", rate: 0.05 },
      { name: "Sentret", rate: 0.12 },
      { name: "Hoothoot", rate: 0.10 },
      { name: "Spinarak", rate: 0.10 },
      { name: "Chikorita", rate: 0.05 },
      { name: "Cyndaquil", rate: 0.05 },
      { name: "Totodile", rate: 0.05 },
      { name: "Pidgeotto", rate: 0.08 }
    ],
    unlockCondition: () => player.level >= 8
  },
  {
    name: "Union Cave (Johto Entrance)",
    region: "Johto",
    levelRange: [10,20],
    wildPokemon: [
      { name: "Geodude", rate: 0.15 },
      { name: "Zubat", rate: 0.20 },
      { name: "Onix", rate: 0.10 },
      { name: "Steelix", rate: 0.05 },
      { name: "Larvitar", rate: 0.02 },
      { name: "Pupitar", rate: 0.01 }
    ],
    unlockCondition: () => player.level >= 10
  },
  {
    name: "Bell Tower",
    region: "Johto",
    levelRange: [12,20],
    wildPokemon: [
      { name: "Hoothoot", rate: 0.15 },
      { name: "Noctowl", rate: 0.08 },
      { name: "Gastly", rate: 0.12 },
      { name: "Haunter", rate: 0.08 },
      { name: "Hitmonlee", rate: 0.03 },
      { name: "Hitmonchan", rate: 0.03 },
      { name: "Hitmontop", rate: 0.02 }
    ],
    unlockCondition: () => player.level >= 12
  },
  {
    name: "Ilex Forest (Extended)",
    region: "Johto",
    levelRange: [10,18],
    wildPokemon: [
      { name: "Cleffa", rate: 0.03 },
      { name: "Togepi", rate: 0.05 },
      { name: "Hoothoot", rate: 0.12 },
      { name: "Spinarak", rate: 0.12 },
      { name: "Chikorita", rate: 0.05 },
      { name: "Cyndaquil", rate: 0.05 },
      { name: "Totodile", rate: 0.05 },
      { name: "Ledyba", rate: 0.08 }
    ],
    unlockCondition: () => player.level >= 10
  },
  {
    name: "National Park",
    region: "Johto",
    levelRange: [15,25],
    wildPokemon: [
      { name: "Pineco", rate: 0.12 },
      { name: "Heracross", rate: 0.05 },
      { name: "Scyther", rate: 0.03 },
      { name: "Chikorita", rate: 0.05 },
      { name: "Cyndaquil", rate: 0.05 },
      { name: "Totodile", rate: 0.05 },
      { name: "Hoppip", rate: 0.08 },
      { name: "Skiploom", rate: 0.04 }
    ],
    unlockCondition: () => player.level >= 15
  },
  {
    name: "Ruins of Alph",
    region: "Johto",
    levelRange: [20,30],
    wildPokemon: [
      { name: "Unown", rate: 0.10 },
      { name: "Smoochum", rate: 0.05 },
      { name: "Elekid", rate: 0.05 },
      { name: "Magby", rate: 0.05 },
      { name: "Sudowoodo", rate: 0.08 },
      { name: "Geodude", rate: 0.08 },
      { name: "Onix", rate: 0.05 }
    ],
    unlockCondition: () => player.level >= 20
  },
  {
    name: "Johto Safari Zone",
    region: "Johto",
    levelRange: [25,35],
    wildPokemon: [
      { name: "Heracross", rate: 0.08 },
      { name: "Scyther", rate: 0.05 },
      { name: "Togetic", rate: 0.02 },
      { name: "Pineco", rate: 0.10 },
      { name: "Flaaffy", rate: 0.08 },
      { name: "Ampharos", rate: 0.03 },
      { name: "Larvitar", rate: 0.02 },
      { name: "Togepi", rate: 0.05 }
    ],
    unlockCondition: () => player.level >= 25
  },
  {
    name: "Mt. Silver",
    region: "Johto",
    levelRange: [40,50],
    wildPokemon: [
      { name: "Larvitar", rate: 0.05 },
      { name: "Pupitar", rate: 0.03 },
      { name: "Tyranitar", rate: 0.02 },
      { name: "Steelix", rate: 0.05 },
      { name: "Snorlax", rate: 0.03 },
      { name: "Dragonite", rate: 0.03 },
      { name: "Suicune", rate: 0.01 },
      { name: "Raikou", rate: 0.01 },
      { name: "Entei", rate: 0.01 }
    ],
    unlockCondition: () => player.level >= 40
  }
);



window.routes.push(
  // ---------- Early Routes ----------
  {
    name: "Littleroot Forest",
    region: "Hoenn",
    levelRange: [3,6],
    wildPokemon: [
      { name: "Poochyena", rate: 0.2 },
      { name: "Zigzagoon", rate: 0.2 },
      { name: "Wurmple", rate: 0.2 },
      { name: "Seedot", rate: 0.15 },
      { name: "Shroomish", rate: 0.1 },
      { name: "Lotad", rate: 0.1 },
      { name: "Ralts", rate: 0.05 }
    ],
    unlockCondition: () => player.level >= 1
  },
  {
    name: "Petalburg Woods",
    region: "Hoenn",
    levelRange: [5,9],
    wildPokemon: [
      { name: "Poochyena", rate: 0.15 },
      { name: "Zigzagoon", rate: 0.15 },
      { name: "Shroomish", rate: 0.2 },
      { name: "Slakoth", rate: 0.15 },
      { name: "Lotad", rate: 0.1 },
      { name: "Seedot", rate: 0.1 },
      { name: "Nincada", rate: 0.05 },
      { name: "Ralts", rate: 0.1 }
    ],
    unlockCondition: () => player.level >= 5
  },
  {
    name: "Rusturf Tunnel",
    region: "Hoenn",
    levelRange: [7,12],
    wildPokemon: [
      { name: "Machop", rate: 0.2 },
      { name: "Geodude", rate: 0.2 },
      { name: "Numel", rate: 0.15 },
      { name: "Zigzagoon", rate: 0.1 },
      { name: "Shroomish", rate: 0.1 },
      { name: "Nincada", rate: 0.1 },
      { name: "Slakoth", rate: 0.1 }
    ],
    unlockCondition: () => player.level >= 8
  },

  // ---------- Mid Routes ----------
  {
    name: "Dewford Cave",
    region: "Hoenn",
    levelRange: [10,16],
    wildPokemon: [
      { name: "Meditite", rate: 0.15 },
      { name: "Makuhita", rate: 0.15 },
      { name: "Zubat", rate: 0.2 },
      { name: "Geodude", rate: 0.15 },
      { name: "Numel", rate: 0.1 },
      { name: "Carvanha", rate: 0.1 },
      { name: "Wailmer", rate: 0.05 },
      { name: "Tentacool", rate: 0.1 }
    ],
    unlockCondition: () => player.level >= 10
  },
  {
    name: "Fallarbor Hill",
    region: "Hoenn",
    levelRange: [12,18],
    wildPokemon: [
      { name: "Shroomish", rate: 0.15 },
      { name: "Slakoth", rate: 0.15 },
      { name: "Nincada", rate: 0.1 },
      { name: "Meditite", rate: 0.1 },
      { name: "Makuhita", rate: 0.1 },
      { name: "Geodude", rate: 0.1 },
      { name: "Numel", rate: 0.1 },
      { name: "Zubat", rate: 0.1 },
      { name: "Carvanha", rate: 0.1 }
    ],
    unlockCondition: () => player.level >= 12
  },
  {
    name: "Mossdeep Surf",
    region: "Hoenn",
    levelRange: [15,22],
    wildPokemon: [
      { name: "Tentacool", rate: 0.2 },
      { name: "Tentacruel", rate: 0.1 },
      { name: "Magikarp", rate: 0.25 },
      { name: "Carvanha", rate: 0.15 },
      { name: "Wailmer", rate: 0.1 },
      { name: "Feebas", rate: 0.05 },
      { name: "Wingull", rate: 0.15 }
    ],
    unlockCondition: () => player.level >= 15
  },

  // ---------- Higher Mid Routes ----------
  {
    name: "Fiery Volcano",
    region: "Hoenn",
    levelRange: [18,25],
    wildPokemon: [
      { name: "Slugma", rate: 0.25 },
      { name: "Numel", rate: 0.25 },
      { name: "Magcargo", rate: 0.1 },
      { name: "Koffing", rate: 0.1 },
      { name: "Torkoal", rate: 0.05 },
      { name: "Growlithe", rate: 0.1 },
      { name: "Vulpix", rate: 0.1 },
      { name: "Magmar", rate: 0.05 }
    ],
    unlockCondition: () => player.level >= 18
  },
  {
    name: "Sky Pillar Peak",
    region: "Hoenn",
    levelRange: [25,35],
    wildPokemon: [
      { name: "Swablu", rate: 0.2 },
      { name: "Altaria", rate: 0.1 },
      { name: "Tropius", rate: 0.1 },
      { name: "Rayquaza", rate: 0.01 },
      { name: "Dratini", rate: 0.2 },
      { name: "Dragonair", rate: 0.15 },
      { name: "Dragonite", rate: 0.05 },
      { name: "Salamence", rate: 0.05 },
      { name: "Bagon", rate: 0.1 },
      { name: "Shelgon", rate: 0.04 }
    ],
    unlockCondition: () => player.level >= 25
  },

  // ---------- Late Routes / High Level ----------
  {
    name: "Seafloor Cavern",
    region: "Hoenn",
    levelRange: [30,45],
    wildPokemon: [
      { name: "Relicanth", rate: 0.15 },
      { name: "Wailord", rate: 0.1 },
      { name: "Whiscash", rate: 0.1 },
      { name: "Clamperl", rate: 0.1 },
      { name: "Huntail", rate: 0.05 },
      { name: "Gorebyss", rate: 0.05 },
      { name: "Kyogre", rate: 0.01 },
      { name: "Tentacruel", rate: 0.1 },
      { name: "Luvdisc", rate: 0.05 },
      { name: "Horsea", rate: 0.1 },
      { name: "Seadra", rate: 0.1 }
    ],
    unlockCondition: () => player.level >= 30
  },
  {
    name: "Sky Peak Legendary",
    region: "Hoenn",
    levelRange: [50,70],
    wildPokemon: [
      { name: "Rayquaza", rate: 0.02 },
      { name: "Regirock", rate: 0.03 },
      { name: "Regice", rate: 0.03 },
      { name: "Registeel", rate: 0.03 },
      { name: "Latias", rate: 0.02 },
      { name: "Latios", rate: 0.02 },
      { name: "Groudon", rate: 0.01 },
      { name: "Kyogre", rate: 0.01 },
      { name: "Salamence", rate: 0.05 },
      { name: "Metagross", rate: 0.05 }
    ],
    unlockCondition: () => player.level >= 50
  }
);








window.routes.push(
  {
    name: "Hoenn Rare Waters",
    region: "Hoenn",
    levelRange: [15,25],
    wildPokemon: [
      { name: "Feebas", rate: 0.05 },
      { name: "Tentacool", rate: 0.1 },
      { name: "Magikarp", rate: 0.2 },
      { name: "Goldeen", rate: 0.1 },
      { name: "Seaking", rate: 0.05 },
      { name: "Lotad", rate: 0.1 },
      { name: "Lombre", rate: 0.05 },
      { name: "Wingull", rate: 0.15 },
      { name: "Pelipper", rate: 0.05 },
      { name: "Barboach", rate: 0.1 }
    ],
    unlockCondition: () => player.level >= 15
  },
  {
    name: "Hoenn Rare Hills",
    region: "Hoenn",
    levelRange: [20,30],
    wildPokemon: [
      { name: "Beldum", rate: 0.01 },
      { name: "Metang", rate: 0.02 },
      { name: "Nosepass", rate: 0.08 },
      { name: "Geodude", rate: 0.15 },
      { name: "Graveler", rate: 0.12 },
      { name: "Machop", rate: 0.1 },
      { name: "Machoke", rate: 0.05 }
    ],
    unlockCondition: () => player.level >= 20
  },
  {
    name: "Hoenn Sky Peaks",
    region: "Hoenn",
    levelRange: [35,50],
    wildPokemon: [
      { name: "Rayquaza", rate: 0.01 },
      { name: "Altaria", rate: 0.08 },
      { name: "Swablu", rate: 0.15 },
      { name: "Salamence", rate: 0.02 },
      { name: "Bagon", rate: 0.05 },
      { name: "Shelgon", rate: 0.03 }
    ],
    unlockCondition: () => player.level >= 35
  },
  {
    name: "Hoenn Caves & Mines",
    region: "Hoenn",
    levelRange: [10,40],
    wildPokemon: [
      { name: "Sableye", rate: 0.05 },
      { name: "Mawile", rate: 0.05 },
      { name: "Meditite", rate: 0.08 },
      { name: "Meditite", rate: 0.08 },
      { name: "Numel", rate: 0.1 },
      { name: "Camerupt", rate: 0.02 },
      { name: "Zubat", rate: 0.2 },
      { name: "Golbat", rate: 0.15 },
      { name: "Geodude", rate: 0.1 },
      { name: "Graveler", rate: 0.05 }
    ],
    unlockCondition: () => player.level >= 10
  }
);



// ------------------ RENDER REGIONS ------------------
function renderRegionButtons() {
  const regionButtonsDiv = document.getElementById("regionButtons");
  if (!regionButtonsDiv) return;

  // Get unique regions
  const regions = [...new Set(window.routes.map(r => r.region))];

  regions.forEach(region => {
    let btn = Array.from(regionButtonsDiv.children).find(b => b.textContent === region);
    if (!btn) {
      btn = document.createElement("button");
      btn.classList.add("region-btn");
      regionButtonsDiv.appendChild(btn);
    }

    btn.textContent = region;

    // Click to render routes and highlight selected region
    btn.onclick = () => {
      renderRouteButtons(region);

      // Highlight selected region
      regionButtonsDiv.querySelectorAll(".region-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");

      // Scroll map buttons to top (optional for mobile)
      const mapButtonsDiv = document.getElementById("mapButtons");
      if (mapButtonsDiv) mapButtonsDiv.scrollTop = 0;
    };
  });
}

// ------------------ RENDER ROUTES ------------------
function renderRouteButtons(region) {
  const mapButtonsDiv = document.getElementById("mapButtons");
  if (!mapButtonsDiv || !window.routes) return;

  const filteredRoutes = window.routes.filter(r => r.region === region);

  filteredRoutes.forEach((route, index) => {
    let btn = mapButtonsDiv.children[index];
    if (!btn) {
      btn = document.createElement("button");
      btn.classList.add("route-btn");
      mapButtonsDiv.appendChild(btn);
    }

    btn.textContent = route.name;

    // Check unlock condition
    let unlocked = false;
    try {
      unlocked = route.unlockCondition ? route.unlockCondition() : true;
    } catch (err) {
      console.warn(`Error checking unlockCondition for ${route.name}:`, err);
      unlocked = false;
    }

    btn.disabled = !unlocked;
    btn.title = unlocked ? "" : `Reach level ${route.levelRange ? route.levelRange[0] : "?"} to unlock`;

    if (unlocked) {
      btn.onclick = () => {
        selectRoute(route.name);

        // Highlight selected route
        mapButtonsDiv.querySelectorAll(".route-btn").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");

        // Close menu overlay
        const menuOverlay = document.getElementById("menuOverlay");
        if (menuOverlay) menuOverlay.style.display = "none";
      };
    } else {
      btn.onclick = null;
      btn.classList.remove("selected");
    }
  });

  // Remove extra buttons if fewer routes than before
  while (mapButtonsDiv.children.length > filteredRoutes.length) {
    mapButtonsDiv.removeChild(mapButtonsDiv.lastChild);
  }
}

// ------------------ SELECT ROUTE ------------------
function selectRoute(routeName) {
  const route = window.routes.find(r => r.name === routeName);
  if (!route) return;

  window.currentRoute = route;

  const currentRouteEl = document.getElementById("currentRoute");
  const battleMessageEl = document.getElementById("battleMessage");
  if (currentRouteEl) currentRouteEl.textContent = route.name;
  if (battleMessageEl) battleMessageEl.textContent = `You are now on ${route.name}! Wild Pokémon may appear.`;

  setupWildEncounters(route);
}

function setupWildEncounters(route) {
  if (!route || !route.wildPokemon) return;
  window.wildPokemonPool = route.wildPokemon;
}

// ------------------ INITIALIZE ------------------
document.addEventListener('DOMContentLoaded', () => {
  renderRegionButtons();
});

