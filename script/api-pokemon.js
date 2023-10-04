$(document).ready(function () {
    var url = "https://pokeapi.co/api/v2/pokemon"
    $.ajax({
        type: "GET",
        url: "https://pokeapi.co/api/v2/pokemon?limit=1200/",
    }).done(function (resp) {
        var listadoPokemon = resp.results;
        listadoPokemon.forEach(pokemon => {
            var template = `
            <div class="col-lg-3 col-md-6 col-sm-12 mb-3">
                                <a href=""></a>
                                <div class="card">
                                    <img src="https://www.pkparaiso.com/imagenes/xy/sprites/animados/${pokemon.name}.gif" style="height:150px; width:110px; text-align:center;"
                                        class="card-img-top" alt="" />
                                    <div class="card-body">
                                        <h5 class="card-title">${pokemon.name}</h5>
                                        <p class="card-text">
                                            <li>#${getPokemonIdFromUrl(pokemon.url)}</li>
                                        </p>
                                        <button type="button" class="btn btn-primary moredetails" pokeid="${getPokemonIdFromUrl(pokemon.url)}">More details</button>

                                    </div>
                                </div>
                                </a>
                            </div>
            `;
            $('#listadoPokemon').append(template);
        });
    });

});
$(document).on('click', '.moredetails', function (poke) {
    var pokemonId = $(this).attr('pokeid');
    $.ajax({
        url: `https://pokeapi.co/api/v2/pokemon/${pokemonId}`,
        type: 'GET',
    }).done(function (response) {
        ability = response.abilities[0].ability.name;
        //Recorrer array

        var newSrc = `https://www.pkparaiso.com/imagenes/xy/sprites/animados/${response.name}.gif`
        $('#imagenPokemon').attr('src', newSrc);
        
        if (response.types[0]) {
            type1 = response.types[0].type.name;
            $("#tipo1").text(type1);
          }
          if (response.types[1]?.type) {
            type2 = response.types[1].type.name;
            $("#tipo2").text(type2);
          }
        $('#nombrePokemon').text("Name:" + response.name);
        $('#habilidadPokemon').text("Habilidad:" + ability);
        $('#alturaPokemon').text("Height:" + response.height + "fts");
        $('#pesoPokemon').text("Weight:" + response.weight + "lbs");
        $('#modalDetails').modal('show')
    });
})
function getPokemonIdFromUrl(url) {
    // Sacar id de la url de pokemon
    return url.split('/').reverse()[1];
}