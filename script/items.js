$(document).ready(function () {
    var listadoItems;
    $.ajax({
        type: "GET",
        url: "https://pokeapi.co/api/v2/item?limit=950",
        success: function (response) {
            listadoItems = response.results;
            listadoItems.forEach(item => {
                var nameReplace = item.name.replace(/_/g, "-");
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
                                        <button type="button" class="btn btn-primary moredetails" pokeid="${getItemIdFromUrl(item.url)}">More details</button>

                                    </div>
                                </div>
                                </a>
                            </div>
                `
                $('#listadoItems').append(template)
            });
        }
    });
    $(document).on('click', '.moredetails', function () {
        var itemId = $(this).attr('pokeid');
        $.ajax({
            type: "GET",
            url: `https://pokeapi.co/api/v2/item/${itemId}`,
            success: function (response) {
                //var nameReplace = item.name.replace(/_/g, "-");
                effecto = response.effect_entries[0].short_effect
                var newSrc = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${response.name}.png`
                $('#imagenItem').attr('src', newSrc);
                $('#nombreItem').text("Name:" + response.name);
                $('#categoriaItem').text("Category: " + response.category.name);
                $('#efectoEntrada').text("Effect:" + effecto);
                $('#coste').text("Cost: " + response.cost)
                $('#modalDetails').modal('show')
                for (var i = 0; i < response.attributes.length; i++) {
                    var tipoItem = document.createElement('div');
                    tipoItem.className = 'frame' + (i + 1);
                    tipoItem.id = 'tipoItem' + (i + 1);

                    var textWrapper = document.createElement('div');
                    textWrapper.className = 'text-wrapper' + (i + 1);
                    textWrapper.id = 'tipo' + (i + 1);

                    tipoItem.appendChild(textWrapper);
                    document.body.appendChild(tipoItem);
                    $(`#tipo${i + 1}`).text(response.attributes[i + 1].name);
                }
            }
        });
    });
    function getItemIdFromUrl(url) {
        // Sacar id de la url de pokemon
        return url.split('/').reverse()[1];
    }
});