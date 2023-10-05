$(document).ready(function () {
    var listadoItems;
    $.ajax({
        type: "GET",
        url: "https://pokeapi.co/api/v2/item?limit=2110",
        success: function (response) {
            listadoItems = response.results;
            listadoItems.forEach(item => {
                var template = `
                <div class="col-lg-3 col-md-6 col-sm-12 mb-3 cartaPokemon" id="${item.name}">
                                <a href=""></a>
                                <div class="card">
                                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${nameReplace}.png" style="height:150px; width:110px; text-align:center;"
                                        class="card-img-top" alt="" />
                                    <div class="card-body">
                                        <h5 class="card-title">${item.name}</h5>
                                        <p class="card-text">
                                            <li>#${getItemIdFromUrl(item.url)}</li>
                                        </p>
                                        <button type="button" class="btn btn-primary moredetails" pokeid="${getPokemonIdFromUrl(pokemon.url)}">More details</button>

                                    </div>
                                </div>
                                </a>
                            </div>
                `
                $('#listadoItems').append(template)
            });
        }
    });
    function getItemIdFromUrl(url) {
        // Sacar id de la url de pokemon
        return url.split('/').reverse()[1];
    }
});