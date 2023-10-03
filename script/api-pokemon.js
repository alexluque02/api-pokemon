$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "https://pokeapi.co/api/v2/pokemon/",
    }).done(function (resp) {
        var listadoPokemon = resp.results;
        var indice = 0;
        listadoPokemon.forEach(pokemon => {
            var template = `
            <div style="position: relative;">
                <div class="carta"></div>
                        <div class="letrero-carta">
                            <div class="idPokemon">#${pokemon.id}</div>
                            <div class="namePokemon">${pokemon.name}</div>
                            </div>
                            <img class="pokemonImg" src="https://img.pokemondb.net/sprites/sword-shield/icon/${pokemon.name}.png" />
            </div>
            `;
            $('#listadoPokemon').append(template);
            indice++;
        });
    });
});