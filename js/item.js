// ------------------ PLAYER ITEMS INIT ------------------
if (!window.player.items) window.player.items = {};

const defaultItems = {
  berries:  { razz:5, nanab:3, pinap:2, silver:1, golden:0 },
  balls:    { pokeball:10, greatball:5, ultraball:2, masterball:0 },
  stones:   { fire:1, water:0, leaf:1, thunder:0, moon:0, sun:0 },
  evolveItems: {
    rareCandy:513,
    kingsRock:1,
    metalCoat:0,
    dragonScale:0,
    upgrade:0,
    sinnohStone:0,
    unovaStone:0
  }
};
const itemColors = {
  berries: '#FF6384',     // pinkish
  balls: '#36A2EB',       // blue
  stones: '#FFCE56',      // yellow
  evolveItems: '#9CCC65'  // green
};

// Merge defaults with existing items
for (let group in defaultItems) {
  if (!window.player.items[group]) window.player.items[group] = {};
  Object.keys(defaultItems[group]).forEach(item => {
    if (window.player.items[group][item] === undefined) {
      window.player.items[group][item] = defaultItems[group][item];
    }
  });
}

// ------------------ PLAYER UI UPDATE ------------------
function safeUpdatePlayerDisplay() {
  if (typeof updatePlayerDisplay === "function") return updatePlayerDisplay();

  const pd = document.getElementById("playerDisplay");
  if (pd) {
    pd.textContent = `Lv: ${window.player.level} | Coins: ${window.player.coins} | Stardust: ${window.player.stardust}`;
  }
}

let activeBagCategory = null; // currently selected category

function renderBagItems() {
  const bagArea = document.getElementById('itemsDisplay');
  if (!bagArea) return;

  const categoryContainer = document.getElementById('itemCategories');
  if (!categoryContainer) return;

  categoryContainer.innerHTML = "";

  Object.keys(window.player.items).forEach(type => {
    const btn = document.createElement('button');
    btn.className = 'itemCategoryBtn';
    btn.textContent = type.replace(/([A-Z])/g, " $1").toUpperCase();

    if (activeBagCategory === type) {
      btn.style.background = '#ffae00';
      btn.style.color = '#000';
    } else {
      btn.style.background = itemColors[type] || '#2196F3';
      btn.style.color = '#fff';
    }

    btn.onclick = () => {
      activeBagCategory = type;
      renderBagCategoryItems(type);
      renderBagItems(); // update highlight
    };

    categoryContainer.appendChild(btn);
  });

  if (!activeBagCategory) {
    bagArea.style.display = 'none'; // hide items until category clicked
  }
}
function updateItemsDisplay() {
  if (!activeBagCategory) return;
  renderBagCategoryItems(activeBagCategory);
}

function renderBagCategoryItems(type) {
  const area = document.getElementById('itemsDisplay');
  if (!area) return;

  const items = window.player.items[type];
  if (!items) return;

  area.innerHTML = "";
  area.style.display = 'flex';
  area.style.flexWrap = 'wrap';   // para mag-wrap kapag di kasya sa row
  area.style.gap = '4px';
  area.style.padding = '4px 0';

  let hasItems = false;

  Object.keys(items).forEach(item => {
    const qty = items[item];
    if (qty <= 0) return; // auto-hide kung 0
    hasItems = true;

    const btn = document.createElement('button');
    btn.className = 'itemButton';
    btn.textContent = `${item} x${qty}`;
    btn.style.background = itemColors[type] || '#ccc';
    btn.style.color = '#000';
    btn.style.border = '2px solid #333';
    btn.style.borderRadius = '4px';
    btn.style.cursor = 'pointer';
    btn.style.minWidth = '100px';
    btn.style.flex = '0 0 auto';
    btn.onclick = () => useItem(type, item);

    area.appendChild(btn);
  });

  if (!hasItems) {
    area.textContent = "No items";
    area.style.display = 'block';
  }
}


async function useItem(itemType, itemName, targetPokemon = null) {
  const inv = window.player?.items?.[itemType];
  if (!inv || inv[itemName] === undefined || inv[itemName] <= 0) {
    alert("You don't have this item!");
    return;
  }

  // -------------------- DEFAULT TARGET --------------------
  if (!targetPokemon) {
    targetPokemon =
      window.activePokemon ||
      window.player?.party?.[window.player.activeIndex];
  }

  const needsTarget = ["berries", "stones", "evolveItems"];
  if (needsTarget.includes(itemType) && !targetPokemon) {
    appendBattleLog(`No Pokémon to use ${itemName} on.`, "system");
    return;
  }

  let consumeItem = true;

  // -------------------- HELPER: REFRESH UI --------------------
  const refreshPokemonUI = (poke) => {
    updatePartyDisplay?.();
    const activeIndex = window.player?.activeIndex ?? 0;
    if (window.player?.party[activeIndex] === poke) {
      updateBattleScreen?.(poke, true);
    }

    if (isTooltipVisible && partyTooltip) {
      const partyDisplay = document.getElementById("partyDisplay");
      const slot = partyDisplay?.children?.[window.player.party.indexOf(poke)];
      const pokeBtn = slot?.querySelector("button");
      if (pokeBtn) showTooltip(poke, pokeBtn);
    }
  };

  // -------------------- APPLY ITEM EFFECT --------------------
  switch (itemType) {
    // ---------- BERRIES ----------
    case "berries":
      handleBerry(itemName, targetPokemon);
      refreshPokemonUI(targetPokemon);
      break;

    // ---------- BALLS ----------
    case "balls": {
      const wild = window.currentWild;
      if (!window.isCatching && wild && typeof window.catchPokemon === "function") {
        const caught = window.catchPokemon(itemName);
        if (!caught) {
          appendBattleLog(`${wild.pokemon_name} escaped the Poké Ball!`, "wild");
          createPoofAtSprite("wildSprite");
          setTimeout(() => {
            clearSprite(false, "No Wild Pokémon");
            window.currentWild = null;
          }, 300);
        }
      } else {
        appendBattleLog(`No wild Pokémon to throw ${itemName} at.`, "system");
        consumeItem = false;
      }
      break;
    }

    // ---------- STONES / EVOLVE ITEMS ----------
case "stones":
case "evolveItems": {
  // ------------- RARE CANDY -------------
  if (itemName === "rareCandy") {
    const currentLevel = targetPokemon.level || 1;
    if (currentLevel >= MAX_LEVEL) {
      appendBattleLog(`${targetPokemon.pokemon_name} is already at max level.`, "system");
      consumeItem = false;
      break;
    }

    targetPokemon.level = Math.min(currentLevel + 0.5, MAX_LEVEL);

    // ---------- RECALC STATS ----------
    if (typeof recalcPokemonStats === "function") recalcPokemonStats(targetPokemon);
    applyTalentModifiers(targetPokemon);
    calculateCP(targetPokemon);

    // ---------- SAFE HP SYNC ----------
    // Always recalc maxHP from staTotal
    const oldHPPercent = targetPokemon.currentHP && targetPokemon.maxHP
      ? targetPokemon.currentHP / targetPokemon.maxHP
      : 1;
    targetPokemon.maxHP = Math.floor(targetPokemon.staTotal * 2);
    targetPokemon.currentHP = Math.max(1, Math.round(targetPokemon.maxHP * oldHPPercent));

    // ---------- REFRESH UI ----------
    refreshPokemonUI(targetPokemon);

    appendBattleLog(`${targetPokemon.pokemon_name} powered up! (Lv ${targetPokemon.level})`, "player");
  } 
  // ------------- EVOLVE ITEMS -------------
  else {
    if (typeof evolvePokemonWithItem === "function") {
      const oldHPPercent = targetPokemon.currentHP && targetPokemon.maxHP
        ? targetPokemon.currentHP / targetPokemon.maxHP
        : 1;

      await evolvePokemonWithItem(itemName, targetPokemon);

      // ---------- RECALC STATS ----------
      applyTalentModifiers(targetPokemon);
      calculateCP(targetPokemon);

      // ---------- SAFE HP SYNC ----------
      targetPokemon.maxHP = Math.floor(targetPokemon.staTotal * 2);
      targetPokemon.currentHP = Math.max(1, Math.round(targetPokemon.maxHP * oldHPPercent));
      targetPokemon.currentEnergy = targetPokemon.currentEnergy || 0;

      // ---------- REFRESH UI ----------
      refreshPokemonUI(targetPokemon);

      appendBattleLog(`${targetPokemon.pokemon_name} evolved!`, "player");
    } else {
      appendBattleLog(`Tried to use ${itemName}, but evolve function not found.`, "system");
      consumeItem = false;
    }
  }
  break;
}


    // ---------- SPECIAL ITEMS ----------
    case "special":
      if (itemName === "stardust") {
        appendBattleLog("Stardust used!", "system");
      }
      break;
  }

  // -------------------- CONSUME ITEM --------------------
  if (consumeItem) {
    inv[itemName] = Math.max(0, inv[itemName] - 1);
  }

  // -------------------- UPDATE UI --------------------
  updateItemsDisplay?.();
  safeUpdatePlayerDisplay?.();
}



// ------------------ BERRY EFFECTS ------------------
function handleBerry(berry, pokemon) {
  if (!pokemon) return appendBattleLog("No Pokémon to use berry on.");

  const maxHP = (pokemon.base_stamina || 0) + (pokemon.ivs?.stamina || 0);

  switch (berry) {
    case "razz":
      pokemon.currentHP = Math.min((pokemon.currentHP || 0) + 20, maxHP);
      appendBattleLog(`${pokemon.pokemon_name} healed 20 HP!`);
      break;

    case "nanab":
      appendBattleLog("Wild Pokémon slowed down!");
      break;

    case "pinap":
      appendBattleLog("Candy reward will double!");
      break;

    case "silver":
      pokemon.currentHP = Math.min((pokemon.currentHP || 0) + 50, maxHP);
      appendBattleLog(`${pokemon.pokemon_name} healed 50 HP!`);
      break;

    case "golden":
      pokemon.currentHP = maxHP;
      appendBattleLog(`${pokemon.pokemon_name} fully healed!`);
      break;
  }

  if (typeof updateBattleScreen === "function") updateBattleScreen(pokemon, true);
}

// ------------------ SHOP ITEMS ------------------
const shopItems = [
  // Berries
  { type:"berries", name:"razz", cost:50 },
  { type:"berries", name:"nanab", cost:70 },
  { type:"berries", name:"pinap", cost:100 },
  { type:"berries", name:"silver", cost:150 },
  { type:"berries", name:"golden", cost:500 },

  // Balls
  { type:"balls", name:"pokeball", cost:100 },
  { type:"balls", name:"greatball", cost:300 },
  { type:"balls", name:"ultraball", cost:500 },
  { type:"balls", name:"masterball", cost:10000 },

  // Stones
  { type:"stones", name:"fire", cost:300 },
  { type:"stones", name:"water", cost:300 },
  { type:"stones", name:"leaf", cost:300 },
  { type:"stones", name:"thunder", cost:300 },
  { type:"stones", name:"moon", cost:300 },
  { type:"stones", name:"sun", cost:300 },

  // Evolve items
  { type:"evolveItems", name:"rareCandy", cost:1000 },
  { type:"evolveItems", name:"kingsRock", cost:500 },
  { type:"evolveItems", name:"metalCoat", cost:500 },
  { type:"evolveItems", name:"dragonScale", cost:500 },
  { type:"evolveItems", name:"upgrade", cost:500 },
  { type:"evolveItems", name:"sinnohStone", cost:800 },
  { type:"evolveItems", name:"unovaStone", cost:800 }
];

let activeShopCategory = null; // currently selected shop category


function updateShopDisplay() {
  const shop = document.getElementById("shopItems");
  const catContainer = document.getElementById("shopCategoryButtons");
  if (!shop || !catContainer) return;

  shop.innerHTML = "";
  catContainer.innerHTML = "";

  // Categories
  const categories = [...new Set(shopItems.map(i => i.type))];

  categories.forEach(type => {
    const btn = document.createElement("button");
    btn.className = "itemCategoryBtn";
    btn.textContent = type.charAt(0).toUpperCase() + type.slice(1);

    if (activeShopCategory === type) {
      btn.style.background = "#ffae00";
      btn.style.color = "#000";
    } else {
      btn.style.background = itemColors[type] || "#2196F3";
      btn.style.color = "#fff";
    }

    btn.onclick = () => {
      activeShopCategory = type;
      updateShopDisplay();
    };

    catContainer.appendChild(btn);
  });

  if (!activeShopCategory) return; // nothing selected

  const itemsGrid = document.createElement("div");
  itemsGrid.className = "item-buttons-grid";
  itemsGrid.style.display = "grid";
  itemsGrid.style.gridTemplateColumns = "repeat(auto-fill, minmax(120px, 1fr))";
  itemsGrid.style.gap = "4px";

  shopItems
    .filter(item => item.type === activeShopCategory)
    .forEach(item => {
      const btn = document.createElement("button");
      btn.className = "shopButton";
      btn.textContent = `${item.name} - ${item.cost} coins`;
      btn.style.background = itemColors[item.type] || "#ccc";
      btn.style.color = "#000";
      btn.style.border = "2px solid #333";
      btn.style.borderRadius = "4px";
      btn.style.cursor = "pointer";

      btn.onclick = () => buyItem(item.type, item.name, item.cost);
      itemsGrid.appendChild(btn);
    });

  shop.appendChild(itemsGrid);
}



// ------------------ BUY ITEM ------------------
function buyItem(type, name, cost) {
  if (window.player.coins < cost) return alert("Not enough coins!");

  window.player.coins -= cost;
  window.player.items[type] = window.player.items[type] || {};
  window.player.items[type][name] = (window.player.items[type][name] || 0) + 1;

  updateItemsDisplay();
  updateShopDisplay();
  safeUpdatePlayerDisplay();
}

// ------------------ HEAL ALL POKEMON ------------------
function healAllPokemon() {
  if (!window.player?.party?.length) return;

  window.player.party.forEach(poke => {
    poke.currentHP = Math.floor((poke.staTotal || 10) * 2);
    poke.currentEnergy = poke.max_energy || 100;
    if ('isFainted' in poke) poke.isFainted = false;
    if ('status' in poke) poke.status = null;
    if (typeof updateBattleScreen === "function") updateBattleScreen(poke, true);
  });

  updatePartyDisplay();
  appendBattleLog("All Pokémon have been fully healed and revived!", "player");
}

// ------------------ FALLBACK BATTLE LOG ------------------
if (typeof appendBattleLog !== "function") {
  window.appendBattleLog = function(text) {
    const msg = document.getElementById("battleMessage");
    if (!msg) return;
    msg.textContent += (msg.textContent ? "\n" : "") + text;
    msg.scrollTop = msg.scrollHeight;
  };
}

// ------------------ INIT ------------------
function initItemsModule() {
  updateItemsDisplay();
  updateShopDisplay();
  safeUpdatePlayerDisplay();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initItemsModule);
} else {
  initItemsModule();
}
document.addEventListener('DOMContentLoaded', () => {
  updateShopDisplay();
});

