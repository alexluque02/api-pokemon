$(document).ready(function () {
    var listadoPokemon;
    var elementosPokemonOcultos = [];
    var campoDeBusqueda = $('#barraBuscar');
    //var botonBusqueda = $('#btn-search');
    var showAll = false;

    $.ajax({
        type: "GET",
        url: "https://pokeapi.co/api/v2/pokemon?limit=1200/",
    }).done(function (resp) {
        listadoPokemon = resp.results;
        listadoPokemon.forEach(pokemon => {
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

        $(document).on('keyup', '#barraBuscar', function () {
            buscar();
        });

        function buscar() {
            // Obtner el valor del campo de búsqueda
            valorBusqueda = campoDeBusqueda.val().toLowerCase();

            // Realiza la búsqueda en los elementos que deseas filtrar (por ejemplo, en los nombres de los Pokémon)
            $('.cartaPokemon').each(function () {
                var nombrePokemon = $(this).find('.card-title').text().toLowerCase();

                // Comprueba si el nombre del Pokémon contiene el texto de búsqueda
                if (nombrePokemon.includes(valorBusqueda)) {
                    // Muestra el elemento si coincide con la búsqueda
                    $(this).show();
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
                showAll = true;
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
    $(document).on('click', '.moredetails', function () {
        var pokemonId = $(this).attr('pokeid');
        $.ajax({
            url: `https://pokeapi.co/api/v2/pokemon/${pokemonId}`,
            type: 'GET',
        }).done(function (response) {
            ability = response.abilities[0].ability.name;
            //Recorrer array

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
