$(document).ready(function () {
    var listadoBerries;
    var campoDeBusqueda = $('#barraBuscar');
    var resultados = 20;
    var totalBerries;
    var offset;
    var urlBerries = `https://pokeapi.co/api/v2/berry?limit=20&offset=${offset}`;
    var paginas;
    var pagActual = 0;

    function inicializarPaginacion() {
        paginas = Math.ceil(totalBerries / resultados);

        generarPaginacion(pagActual, paginas);
    }

    function generarPaginacion(pagActual, totalPaginas) {
        var pageRange = 3;
        var startPage = Math.max(0, pagActual - pageRange);
        var endPage = Math.min(totalPaginas - 1, pagActual + pageRange);

        $('.pagination').empty();

        var firstPageButton = `<li pageId="0" class="page-item first-page-button"><a class="page-link"> <span aria-hidden="true">&laquo;</span></a></li>`;
        $('.pagination').append(firstPageButton);

        for (var i = startPage; i <= endPage; i++) {
            var template = `<li pageId="${i}" class="page-item"><a class="page-link">${i + 1}</a></li>`;
            $('.pagination').append(template);
        }

        var lastPageButton = `<li pageId="${paginas - 1}" class="page-item last-page-button"><a class="page-link"> <span aria-hidden="true">&raquo;</span></a></li>`;
        $('.pagination').append(lastPageButton);
    }

    function cargarPagina(page) {
        var offset = page * resultados;
        urlBerries = `https://pokeapi.co/api/v2/berry?limit=${resultados}&offset=${offset}`;

        $.ajax({
            type: "GET",
            url: urlBerries,
        }).done(function (resp) {
            listadoBerries = resp.results;
            totalBerries = resp.count;
            inicializarPaginacion()
            $('#listadoBerries').empty();
            mostrarListado(listadoBerries);
        });
    }

    cargarPagina(pagActual);
    generarPaginacion(pagActual, 4);

    $(document).on('click', '.page-item', function () {
        var newPage = parseInt($(this).attr("pageId"));
        pagActual = newPage; // Actualiza la página actual
        cargarPagina(pagActual); // Carga la página correspondiente
        generarPaginacion(pagActual, paginas); // Actualiza la paginación

    })

    $(document).on('keyup', '#barraBuscar', function () {
        buscar();
    });

    function buscar() {
        valorBusqueda = campoDeBusqueda.val().toLowerCase();

        $('.cartaBerry').each(function () {
            var nombreBerry = $(this).find('.card-title').text().toLowerCase();
            if (nombreBerry.includes(valorBusqueda)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }

    function mostrarListado(listado) {
        listado.forEach(berries => {
            var template = `
            <div class="col-lg-3 col-md-6 col-sm-12 mb-3 cartaBerry" id="${berries.name}">
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

    function getBerrieIdFromUrl(url) {
        return url.split('/').reverse()[1];
    }

    $(document).on('click', '.moredetails', function () {
        var berriesId = $(this).attr('pokeid');
        $.ajax({
            url: `https://pokeapi.co/api/v2/berry/${berriesId}`,
            type: "GET",
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
            $('#modalDetails').modal('show');
            debugger;
        });
    })
});