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
        var pageRange = 2;
        var startPage = Math.max(0, pagActual - pageRange);
        var endPage = Math.min(totalPaginas - 1, pagActual + pageRange);

        $('.pagination').empty();

        var firstPageButton = `<li pageId="0" class="page-item first-page-button"><a class="page-link"> <span aria-hidden="true">&laquo;</span></a></li>`;
        $('.pagination').append(firstPageButton);

        if (pagActual > 0) {
            var previousPageButton = `<li pageId="${pagActual - 1}" class="page-item"><a class="page-link"> <span aria-hidden="true">Previous</span></a></li>`;
            $('.pagination').append(previousPageButton);
        }

        $('.page-item').removeClass('active');
        for (var i = startPage; i <= endPage; i++) {
            var template = `<li pageId="${i}" class="page-item"><a class="page-link">${i + 1}</a></li>`;
            if (pagActual == i) {
                $(template).addClass('active').appendTo('.pagination');
            } else {
                $('.pagination').append(template);
            }
        }

        var nextPageButton = `<li pageId="${pagActual + 1}" class="page-item"><a class="page-link"> <span aria-hidden="true">Next</span></a></li>`;
        if (pagActual < paginas - 1) {
            $('.pagination').append(nextPageButton);
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
        listado.forEach(berry => {
            var template = `
            <div class="col-lg-3 col-md-6 col-sm-12 mb-3 mt-4 cartaBerry" id="${berry.name}">
            <a href=""></a>
            <div class="card border-0">
                <div class="position-relative">
                    <div class="card-img-overlay d-flex align-items-center justify-content-center" style="background-color: rgba(255, 255, 255, 0.5); border-radius: 30px;">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${berry.name}-berry.png" style="height: 150px; width: 110px; text-align: center;" class="card-img-top" alt="" />
                    </div>
                    <div class="card-img-overlay" style="border-radius: 30px;"></div>
                </div>
                <div class="card-body">
                    <h5 class="card-title text-white text-center">${berry.name}</h5>
                    <p class="card-text text-white text-center">#${getBerryIdFromUrl(berry.url)}</p>
                    <div class="text-center">
                        <button type="button" style="text-transform: uppercase; background-color: #FFC107; color: #3B5BA7;" class="btn moredetails mt-2" pokeid="${getBerryIdFromUrl(berry.url)}">
                        <strong>${berry.name}</strong> <i class="bi bi-info-circle" style="font-size: 0.8em;"></i></button>
                    </div>
                </div>
            </div>
        </div>
            `;
            $('#listadoBerries').append(template);
        });
    }

    function getBerryIdFromUrl(url) {
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