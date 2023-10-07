$(document).ready(function () {
    var listadoPokemon;
    var campoDeBusqueda = $('#barraBuscar');
    var resultados = 20;
    var totalPokemon
    var offset;
    var urlPokemon = `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`;
    var paginas;
    var pagActual = 0;

    function inicializarPaginacion() {
        paginas = Math.ceil(totalPokemon / resultados);

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
        urlPokemon = `https://pokeapi.co/api/v2/pokemon?limit=${resultados}&offset=${offset}`;

        $.ajax({
            type: "GET",
            url: urlPokemon,
        }).done(function (resp) {
            listadoPokemon = resp.results;
            totalPokemon = resp.count;
            inicializarPaginacion()
            $('#listadoPokemon').empty();
            mostrarListado(listadoPokemon);
        });
    }

    cargarPagina(pagActual);
    generarPaginacion(pagActual, 6);

    $.ajax({
        type: "GET",
        url: urlPokemon,
    }).done(function (resp) {
        listadoPokemon = resp.results;

        $(document).on('click', '#allHabitats', function () {
            $('.pagination').show();
            $('#barraBuscar').val("");
            $('#listadoPokemon').empty();
            cargarPagina(0);
            mostrarListado(listadoPokemon);
        })
    });

    $(document).on('click', '.page-item', function () {
        var newPage = parseInt($(this).attr("pageId"));
        pagActual = newPage; // Actualiza la página actual
        debugger;
        cargarPagina(pagActual); // Carga la página correspondiente
        generarPaginacion(pagActual, paginas); // Actualiza la paginación

    })

    $(document).on('keyup', '#barraBuscar', function () {
        buscar();
    });

    function buscar() {
        valorBusqueda = campoDeBusqueda.val().toLowerCase();

        $('.cartaPokemon').each(function () {
            var nombrePokemon = $(this).find('.card-title').text().toLowerCase();
            if (nombrePokemon.includes(valorBusqueda)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }

    $.ajax({
        type: "GET",
        url: "https://pokeapi.co/api/v2/pokemon-habitat/"
    }).done(function (resp) {
        valorBusqueda = "";
        var habitatList = resp.results;

        var habitatLinks = habitatList.map(habitat => {
            return `<button type="button" class="btn btn-filter-habitat" habitatId="${getPokemonIdFromUrl(habitat.url)}">${habitat.name.toUpperCase()}</button>`;
        });



        var template = `
        <div class="habitats col-12 bg-light m-3 d-flex w-100">
            <button type="button" id="allHabitats" class="btn"><h5>ALL</h5></button>
            <h5>${habitatLinks.join("&nbsp; ")}</h5>
            <button type="button" id="back-btn" class="btn"><i class="bi bi-arrow-left-short"></i></button>
        </div>
        `;


        $('#listadoHabitats').hide();
        $('#listadoHabitats').append(template);
    });

    $(document).on('click', '#selectHabitats', function () {
        $('#selectHabitats').hide();
        $('#listadoHabitats').show();

    })

    $(document).on('click', '#back-btn', function () {
        $('#listadoHabitats').hide();
        $('#selectHabitats').show();
    })

    //Cuando pulso sobre un boton de un habitat
    $(document).on('click', '.btn-filter-habitat', function () {
        $('#barraBuscar').val("");
        var habitatClicked = $(this).attr("habitatId");
        mostrarPokemonPorHabitat(habitatClicked);
    });

    function mostrarPokemonPorHabitat(habitat) {
        $.ajax({
            type: "GET",
            url: `https://pokeapi.co/api/v2/pokemon-habitat/${habitat}`
        }).done(function (resp) {
            var pokemonNameListInHabitat = resp.pokemon_species.map(pokemon => pokemon.name);

            // Oculta la paginación antes de hacer la segunda solicitud AJAX
            $('.pagination').hide();

            // Hacer la segunda solicitud AJAX para obtener la lista completa de Pokémon
            $.ajax({
                type: "GET",
                url: `https://pokeapi.co/api/v2/pokemon?limit=${totalPokemon}`
            }).done(function (pok) {
                var listadoPokemon2 = [];

                pok.results.forEach(pokemon => {
                    if (pokemonNameListInHabitat.includes(pokemon.name)) {
                        listadoPokemon2.push(pokemon);
                    }
                });

                $('#listadoPokemon').empty();
                mostrarListado(listadoPokemon2);
            });
        });
    }

    function mostrarListado(listado) {
        listado.forEach(pokemon => {
            var template = `
            <div class="col-lg-3 col-md-6 col-sm-12 mb-3 cartaPokemon" id="${pokemon.name}">
                <a href=""></a>
                <div class="card">
                    <img src="https://img.pokemondb.net/sprites/home/normal/${pokemon.name}.png" style="height:150px; width:110px; text-align:center;"
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
    }


    $(document).on('click', '.moredetails', function () {
        var pokemonId = $(this).attr('pokeid');
        $.ajax({
            url: `https://pokeapi.co/api/v2/pokemon/${pokemonId}`,
            type: 'GET',
        }).done(function (response) {
            ability = response.abilities[0].ability.name;

            var newSrc = `https://www.pkparaiso.com/imagenes/xy/sprites/animados/${response.name}.gif`
            $('#imagenPokemon').attr('src', newSrc);

            let type1 = '';
            let type2 = '';

            $('#tipoPokemon, .frame2').hide();

            if (response.types[0]?.type) {
                type1 = response.types[0].type.name;
                $('#tipoPokemon').show();

                $('#tipo1').text(type1);

            }

            if (response.types.length > 1 && response.types[1]?.type) {
                type2 = response.types[1].type.name;
                $('.frame2').show();

                $('#tipo2').text(type2);
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

});
