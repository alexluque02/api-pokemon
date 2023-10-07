$(document).ready(function () {
    var listadoBerries;
    var campoDeBusqueda = $('#barraBuscar');
    var resultados = 20;
    var totalPokemon
    var offset;
    var urlPokemon = `https://pokeapi.co/api/v2/berry?limit=20&offset=${offset}`;
    var paginas;
    var pagActual = 0;
    $.ajax({
        type: "GET",
        url: "https://pokeapi.co/api/v2/berry?limit=64/",
        success: function (response) {
            listadoBerries = response.results;
            listadoBerries.forEach(berries => {
                var nameReplace = berries.name.replace(/-/g, "_");
                var template = `
                <div class="col-lg-3 col-md-6 col-sm-12 mb-3 cartaPokemon" id="${berries.name}">
                                <a href=""></a>
                                <div class="card">
                                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${berries.name}-berry.png" style="height:150px; width:110px; text-align:center;"
                                        class="card-img-top" alt="" />
                                    <div class="card-body">
                                        <h5 class="card-title">${berries.name}</h5>
                                        <p class="card-text">
                                            <li>#${getBerrieIdFromUrl(berries.url)}</li>
                                        </p>
                                        <button type="button" class="btn btn-primary moredetails" pokeid="${getBerrieIdFromUrl(berries.url)}">More details</button>

                                    </div>
                                </div>
                                </a>
                            </div>
                `
                $('#listadoBerries').append(template);
            });
        }
    });
    function getBerrieIdFromUrl(url) {
        // Sacar id de la url de pokemon
        return url.split('/').reverse()[1];
    }
    $(document).on('click', '.moredetails', function () {
        var berriesId = $(this).attr('pokeid');
        $.ajax({
            url: `https://pokeapi.co/api/v2/berry/${berriesId}`,
            type: 'GET',
        }).done(function (response) {
            var newSrc = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${response.name}-berry.png`
            response.flavors.forEach(sabor => {
                if (sabor.potency != 0) {
                    $('#flavourBerrie').text("Flavor:" + sabor.flavor.name);
                    $('#potencyBerrie').text("Potency:" + sabor.potency);
                }
            });
            $('#imagenBerrie').attr('src', newSrc);
            $('#nombreBerries').text("Name:" + response.name);
            $('#tipo1').text("Firmness: " + response.firmness.name);
            $('#tipo2').text("Size: " + response.size);
            $('#modalDetails').modal('show')
        });
    })
});