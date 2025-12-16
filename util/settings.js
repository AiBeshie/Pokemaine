// ================================
// SAVE GAME (with prompt)
// ================================
function saveGame() {
  if (!confirm("Save your game?")) return;

  const data = { player: window.player };
  localStorage.setItem("pokeSave", JSON.stringify(data));

  appendBattleLog("Game saved!", "system");
}


// ================================
// LOAD GAME (with prompt)
// ================================
function loadGame() {
  if (!confirm("Load saved game? Your current progress will be replaced.")) return;

  const raw = localStorage.getItem("pokeSave");
  if (!raw) {
    appendBattleLog("No save file found.", "system");
    return;
  }

  const data = JSON.parse(raw);
  window.player = data.player || window.player;

  if (window.player.activeIndex == null) window.player.activeIndex = 0;
  if (!window.player.items) window.player.items = {};
  if (!window.player.party) window.player.party = [];

  updatePartyDisplay();

  if (window.player.party.length > 0) {
    updateBattleScreen(window.player.party[window.player.activeIndex], true);
  }

  appendBattleLog("Game loaded!", "system");
}


// ================================
// CLEAR SAVE (with prompt)
// ================================
function clearSave() {
  if (!confirm("Delete your save permanently? This cannot be undone.")) return;

  localStorage.removeItem("pokeSave");
  appendBattleLog("Save cleared!", "system");
}
