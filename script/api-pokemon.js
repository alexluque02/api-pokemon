$(document).ready(function () {
    var listadoPokemon;
    var elementosPokemonOcultos = [];
    var campoDeBusqueda = $('.barraBuscar');
    var botonBusqueda = $('.btn-search');

    $.ajax({
        type: "GET",
        url: "https://pokeapi.co/api/v2/pokemon?limit=1200/",
    }).done(function (resp) {
        listadoPokemon = resp.results;
        var indice = 1;
        listadoPokemon.forEach(pokemon => {

            var nameReplace = pokemon.name.replace(/-/g, "_");
            var template = `
            <div class="col-lg-3 col-md-6 col-sm-12 mb-3 cartaPokemon" id="${pokemon.name}">
                <a href=""></a>
                <div class="card">
                    <img src="https://img.pokemondb.net/sprites/home/normal/${pokemon.name}.png" style="height:150px; width:110px; text-align:center;"
                        class="card-img-top" alt="" />
                    <div class="card-body">
                        <h5 class="card-title">${pokemon.name}</h5>
                        <p class="card-text">
                            <li>#${indice}</li>
                        </p>
                        <button type="button" class="btn btn-primary" data-bs-toggle="modal"
                            data-bs-target="#modalDetails">More details</button>
                    </div>
                </div>
                </a>
            </div>
            `;
            $('#listadoPokemon').append(template);
            indice++;

        });
        $(document).on('click', botonBusqueda, buscar);
        $(document).on('keyup', '.barraBuscar', buscar);
        function buscar() {
            // Obtner el valor del campo de búsqueda
            valorBusqueda = campoDeBusqueda.val().toLowerCase();

            // Realiza la búsqueda en los elementos que deseas filtrar (por ejemplo, en los nombres de los Pokémon)
            $('.cartaPokemon').each(function () {
                var nombrePokemon = $(this).find('.card-title').text().toLowerCase();

                // Comprueba si el nombre del Pokémon contiene el texto de búsqueda
                if (nombrePokemon.includes(valorBusqueda)) {
                    // Muestra el elemento si coincide con la búsqueda
                    if ($(this).is(':visible')) {
                        $(this).show();
                    }
                } else {
                    // Oculta el elemento si no coincide con la búsqueda
                    $(this).hide();
                }
            });
        }
    });

    $.ajax({
        type: "GET",
        url: "https://pokeapi.co/api/v2/pokemon-habitat/"
    }).done(function (resp) {
        valorBusqueda = "";
        var listHabitat = resp.results;
        var habitatList = [];

        listHabitat.forEach(habitat => {
            habitatList.push(habitat.name);
        });

        var habitatLinks = habitatList.map(function (habitatName) {
            return `<button type="button" class="btn btn-filter-habitat" habitat="${habitatName}">${habitatName}</button>`;
        });

        var template = `
        <div class="habitats col-12 bg-light m-3 d-flex w-100">
            <button type="button" id="allHabitats" class="btn"><h5>ALL</h5></button>
            <h5 style="text-transform: uppercase;">${habitatLinks.join("&nbsp; ")}</h5>
            <button type="button" id="back-btn" class="btn"><i class="bi bi-arrow-left-short"></i></button>
        </div>
        `;


        $('#listadoHabitats').hide();
        $('#listadoHabitats').append(template);

        $(document).on('click', '#selectHabitats', function () {
            $('#selectHabitats').hide();
            $('#listadoHabitats').show();

            $(document).on('click', '#allHabitats', function () {
                $('.barraBuscar').val("");
                elementosPokemonOcultos.forEach(function (elemento) {
                    elemento.show();
                });
            })

        })

        $(document).on('click', '#back-btn', function () {
            $('#listadoHabitats').hide();
            $('#selectHabitats').show();
        })
    });

    $(document).on('click', '.btn-filter-habitat', function () {
        $('.barraBuscar').val("");
        var habitatClicked = $(this).attr("habitat");

        // Mostrar todos los elementos ocultos cuando se filtra un hábitat
        elementosPokemonOcultos.forEach(function (elemento) {
            elemento.show();
        });

        $.ajax({
            type: "GET",
            url: `https://pokeapi.co/api/v2/pokemon-habitat/${habitatClicked}`
        }).done(function (resp) {
            var pokemonListInHabitat = resp.pokemon_species.map(pokemon => pokemon.name);

            // Ocultar Pokémon que no pertenecen al hábitat
            listadoPokemon.forEach(pokemon => {
                if (!pokemonListInHabitat.includes(pokemon.name)) {
                    var elementoPokemon = $(`#${pokemon.name}`);
                    elementoPokemon.hide();
                    elementosPokemonOcultos.push(elementoPokemon);
                }
            });
        });
    });
});


