$(document).ready(function () {
    var listadoItems;
    var campoDeBusqueda = $('#barraBuscar');
    var resultados = 20;
    var totalItems;
    var offset;
    var urlItems = `https://pokeapi.co/api/v2/item?limit=20&offset=${offset}`;
    var paginas;
    var pagActual = 0;
    $.ajax({
        type: "GET",
        url: urlItems,
        success: function (response) {
            listadoItems = response.results;
            mostrarListado(listadoItems);
        }
    });

    $(document).on('click', '.moredetails', function () {
        var itemId = $(this).attr('pokeid');
        $.ajax({
            type: "GET",
            url: `https://pokeapi.co/api/v2/item/${itemId}`,
            success: function (response) {
                effecto = response.effect_entries[0].short_effect
                var newSrc = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${response.name}.png`
                $('#imagenItem').attr('src', newSrc);
                $('#nombreItem').text("Name:" + response.name);
                $('#categoriaItem').text("Category: " + response.category.name);
                $('#efectoEntrada').text("Effect:" + effecto);
                $('#tipo1').text(response.attributes[0].name);
                $('#tipo2').text(response.attributes[1].name);
                $('#coste').text("Cost: " + response.cost)
                $('#modalDetails').modal('show')
            }
        });
    });

    $(document).on('keyup', '#barraBuscar', function () {
        buscar();
    });

    function buscar() {
        valorBusqueda = campoDeBusqueda.val().toLowerCase();

        $('.cartaItem').each(function () {
            var nombreItem = $(this).find('.card-title').text().toLowerCase();
            if (nombreItem.includes(valorBusqueda)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }

    function mostrarListado(listado) {
        listado.forEach(item => {
            var template = `
            <div class="col-lg-3 col-md-6 col-sm-12 mb-3 cartaItem" id="${item.name}">
                            <a href=""></a>
                            <div class="card">
                                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${item.name}.png" style="height:150px; width:110px; text-align:center;"
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
    function getItemIdFromUrl(url) {
        // Sacar id de la url de pokemon
        return url.split('/').reverse()[1];
    }
});