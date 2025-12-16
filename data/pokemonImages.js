// ------------------ POKEMON IMAGES ------------------
window.pokemonImages = [];
for (let i = 1; i <= 1025; i++) {
  window.pokemonImages.push({
    normal: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i}.png`,
    shiny:  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${i}.png`
  });
}

// ------------------ CONNECT IMAGES TO POKEMON DB ------------------
window.pokemonDB.forEach(p => {
  const id = p.pokemon_id;
  p.sprites = {
    normal: window.pokemonImages[id - 1].normal,
    shiny:  window.pokemonImages[id - 1].shiny
  };
});

// ------------------ HELPER FUNCTION ------------------
function getPokemonSprite(pokemon_id, shiny = false) {
  const pokemon = window.pokemonDB.find(p => p.pokemon_id === pokemon_id);
  if (!pokemon) return "";
  return shiny ? pokemon.sprites.shiny : pokemon.sprites.normal;
}

function setPokemonSprite(pokemon, imgElement) {
  const isShiny = pokemon.shiny; // Pokémon object must have .shiny = true/false

  // Set sprite image
  imgElement.src = getPokemonSprite(pokemon.pokemon_id, isShiny);

  // Remove previous shiny effect classes
  imgElement.classList.remove("shiny", "glow", "starburst");

  // Add shiny classes ONLY if Pokémon is shiny
  if (isShiny) {
    imgElement.classList.add("shiny", "glow", "starburst");
  }
}



// Example for player switch/update
function updatePlayerSprite() {
  updateBattleSprites();
}

// Optional: initial update after DOM is loaded
window.addEventListener("DOMContentLoaded", () => {
  updateBattleSprites();
});
