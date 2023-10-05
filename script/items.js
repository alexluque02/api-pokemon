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
    $(document).on('click', '.moreDetails', function () {
        var itemId = $(this).attr('pokeid');
        $.ajax({
            type: "GET",
            url: `https://pokeapi.co/api/v2/item/${itemId}`,
            success: function (response) {
                var nameReplace = item.name.replace(/_/g, "-");
                var newSrc = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${nameReplace}.png`
                $('#imagenItem').attr('src', newSrc);
                $('#modalDetails').modal('show')
            }
        });
    });
    function getItemIdFromUrl(url) {
        // Sacar id de la url de pokemon
        return url.split('/').reverse()[1];
    }
});