/*$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "https://pokeapi.co/api/v2/pokemon?limit=151/",
    }).done(function (resp) {
        var listadoPokemon = resp.results;
        var indice = 1;
        listadoPokemon.forEach(pokemon => {
            var nameReplace = pokemon.name.replace(/-/g, "_");
            var template = `
            <div class="col-lg-3 col-md-6 col-sm-12 mb-3">
                                <a href=""></a>
                                <div class="card">
                                    <img src="https://www.pkparaiso.com/imagenes/xy/sprites/animados/${nameReplace}.gif" style="height:150px; width:110px; text-align:center;"
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
    });

    $.ajax({
        type: "GET",
        url: "https://pokeapi.co/api/v2/pokemon-habitat/"
    }).done(function (resp) {
        var listHabitat = resp.results;
        var habitatList = [];

        listHabitat.forEach(habitat => {
            habitatList.push(habitat.name);
        });

        $(document).on('click', '#selectHabitats', function () {
            $('#selectHabitats').hide();

            // Creamos un array de enlaces <a> para cada palabra
            var habitatLinks = habitatList.map(function (habitatName) {
                return `<a href="#">${habitatName}</a>`;
            });

            var template = `
            <div class="habitats col-12 bg-light m-3 d-flex w-100">
                <h5>ALL</h5>
                <h5 style="text-transform: uppercase;">${habitatLinks.join("&nbsp; ")}</h5>
                <i class="bi bi-arrow-left-short"></i>
            </div>
            `;
            $('#listadoHabitats').append(template);
        })
    });
});*/

$(document).ready(function () {
    $(document).ready(function () {
        var habitatList = [];

        // Función para obtener la lista de Pokémon en un hábitat
        function getPokemonInHabitat(habitatUrl) {
            $.ajax({
                type: "GET",
                url: habitatUrl
            }).done(function (habitatResp) {
                var pokemonList = habitatResp.pokemon_species;
                var pokemonNames = pokemonList.map(pokemon => pokemon.name).join(", ");

                // Muestra los nombres de los Pokémon en la página
                $('#pokemonList').text(pokemonNames);
            });
        }

        // Función para cargar la lista de hábitats
        function loadHabitats() {
            $.ajax({
                type: "GET",
                url: "https://pokeapi.co/api/v2/pokemon-habitat/"
            }).done(function (resp) {
                var habitats = resp.results;

                // Agrega enlaces para cada hábitat
                habitats.forEach(habitat => {
                    var habitatName = habitat.name;
                    var habitatUrl = habitat.url;

                    // Crea un enlace para el hábitat
                    var habitatLink = $('<a>')
                        .text(habitatName)
                        .attr('href', '#')
                        .click(function () {
                            // Cuando se hace clic en el enlace del hábitat, obtiene los Pokémon en ese hábitat
                            getPokemonInHabitat(habitatUrl);
                        });

                    // Agrega el enlace a la lista de hábitats
                    $('#habitatsList').append(habitatLink);

                    habitatList.push(habitatName);
                });
            });
        }

        // Carga la lista de hábitats al cargar la página
        loadHabitats();

        // Muestra los nombres de hábitats seleccionados al hacer clic en el botón 'Select Habitats'
        $(document).on('click', '#selectHabitats', function () {
            $('#selectHabitats').hide();

            // Creamos un array de enlaces <a> para cada palabra
            var habitatLinks = habitatList.map(function (habitatName) {
                return `<a href="#">${habitatName}</a>`;
            });

            var template = `
            <div class="habitats col-12 bg-light m-3 d-flex w-100">
                <h5>ALL</h5>
                <h5 style="text-transform: uppercase;">${habitatLinks.join("&nbsp; ")}</h5>
                <i class="bi bi-arrow-left-short"></i>
            </div>
            `;
            $('#listadoHabitats').append(template);
        });

        $.ajax({
            type: "GET",
            url: "https://pokeapi.co/api/v2/pokemon?limit=151/",
        }).done(function (resp) {
            var listadoPokemon = resp.results;
            var indice = 1;
            listadoPokemon.forEach(pokemon => {
                var nameReplace = pokemon.name.replace(/-/g, "_");
                var template = `
                <div class="col-lg-3 col-md-6 col-sm-12 mb-3">
                    <a href=""></a>
                    <div class="card">
                        <img src="https://www.pkparaiso.com/imagenes/xy/sprites/animados/${nameReplace}.gif" style="height:150px; width:110px; text-align:center;"
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
        });

    });

});