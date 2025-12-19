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
  const isShiny = pokemon.shiny;
  imgElement.src = getPokemonSprite(pokemon.pokemon_id, isShiny);

  // Remove old wrapper if any
  if (imgElement.parentNode.classList.contains('shiny-wrapper')) {
    const wrapper = imgElement.parentNode;
    wrapper.parentNode.replaceChild(imgElement, wrapper);
  }

  if (isShiny) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('shiny-wrapper');
    wrapper.style.left = imgElement.style.left;
    wrapper.style.bottom = imgElement.style.bottom;
    wrapper.style.width = imgElement.width + "px";
    wrapper.style.height = imgElement.height + "px";

    imgElement.parentNode.insertBefore(wrapper, imgElement);
    wrapper.appendChild(imgElement);
  }
}


// Example usage after DOM ready
window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".player-sprite, .enemy-sprite").forEach(img => {
    const pokemonId = parseInt(img.dataset.pokemonId);
    const pokemon = window.pokemonDB.find(p => p.pokemon_id === pokemonId);
    if (pokemon) setPokemonSprite(pokemon, img);
  });
});
