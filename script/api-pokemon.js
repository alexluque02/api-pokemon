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

    $.ajax({
        type: "GET",
        url: urlPokemon,
    }).done(function (resp) {
        listadoPokemon = resp.results;

        $(document).on('click', '#allHabitats', function () {
            $('.btn-filter-habitat').removeClass('active');
            $(this).addClass('active');
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
            return `<button type="button" class="btn btn-filter-habitat" habitatId="${getPokemonIdFromUrl(habitat.url)}"><h5>${habitat.name.toUpperCase()}</h5></button>`;
        });



        var template = `
        <div class="col-12">
            <div class="habitats bg-light m-3 d-flex flex-wrap">
                <button type="button" id="allHabitats" class="btn active"><h5>ALL HABITATS</h5></button>
                ${habitatLinks.join("&nbsp; ")}
            </div>
        </div>
        `;

        $('#listadoHabitats').append(template);
    });

    $(document).on('click', '.btn-filter-habitat', function () {
        $('#allHabitats').removeClass('active');
        $('.btn-filter-habitat').removeClass('active');
        $(this).addClass('active');
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
            $('.pagination').hide();
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
            <div class="col-lg-3 col-md-6 col-sm-12 mb-3 mt-4 cartaPokemon" id="${pokemon.name}">
            <a href=""></a>
            <div class="card border-0">
                <div class="position-relative">
                    <div class="card-img-overlay d-flex align-items-center justify-content-center" style="background-color: rgba(255, 255, 255, 0.5); border-radius: 30px;">
                        <img src="https://img.pokemondb.net/sprites/home/normal/${pokemon.name}.png" style="height: 150px; width: 110px; text-align: center;" class="card-img-top" alt="" />
                    </div>
                    <div class="card-img-overlay" style="border-radius: 30px;"></div>
                </div>
                <div class="card-body">
                    <h5 class="card-title text-white text-center">${pokemon.name}</h5>
                    <p class="card-text text-white text-center">#${getPokemonIdFromUrl(pokemon.url)}</p>
                    <div class="text-center">
                        <button type="button" style="text-transform: uppercase; background-color: #FFC107; color: #3B5BA7;" class="btn moredetails mt-2" pokeid="${getPokemonIdFromUrl(pokemon.url)}">
                        <strong>${pokemon.name}</strong> <i class="bi bi-info-circle" style="font-size: 0.8em;"></i></button>
                    </div>
                </div>
            </div>
        </div>
            `;
            $('#listadoPokemon').append(template);
        });
    }

    $(document).on('click', '.moredetails', async function () {
        var pokemonId = $(this).attr('pokeid');
        $.ajax({
            url: `https://pokeapi.co/api/v2/pokemon/${pokemonId}`,
            type: 'GET',
        }).done(async function (response) {
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
            var habitat = await saberHabitat(response.name);
            $('#habitatPokemon').text("Habitat: " + habitat);
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

    async function saberHabitat(pokemonName) {
        var habitatResponse = await $.ajax({
            type: "GET",
            url: "https://pokeapi.co/api/v2/pokemon-habitat/"
        });

        totalHabitats = habitatResponse.count;
        for (var i = 0; i < totalHabitats; i++) {
            var habitat = await $.ajax({
                type: "GET",
                url: `https://pokeapi.co/api/v2/pokemon-habitat/${i + 1}`
            });

            if (habitat.pokemon_species.some(species => species.name === pokemonName)) {
                return habitat.name;
            }
        }
        return "Hábitat no encontrado";
    }

});
