$(document).ready(function () {
    var listadoPokemon;
    $.ajax({
        type: "GET",
        url: "https://pokeapi.co/api/v2/pokemon?limit=151/",
    }).done(function (resp) {
        listadoPokemon = resp.results;
        var indice = 1;
        listadoPokemon.forEach(pokemon => {

            var nameReplace = pokemon.name.replace(/-/g, "_");
            var template = `
            <div class="col-lg-3 col-md-6 col-sm-12 mb-3" class="cartaPokemon" id="${pokemon.name}">
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

            var habitatLinks = habitatList.map(function (habitatName) {
                return `<button type="button" class="btn-filter-habitat" habitat="${habitatName}">${habitatName}</button>`;
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

    $(document).on('click', '.btn-filter-habitat', function () {
        var habitatClicked = $(this).attr("habitat");
        $.ajax({
            type: "GET",
            url: `https://pokeapi.co/api/v2/pokemon-habitat/${habitatClicked}`
        }).done(function (resp) {
            var listadoEspecies = resp.pokemon_species;
            var listaEspecies = [];

            listadoPokemon.forEach(pokemon => {
                if (pokemon.name.includes(habitatClicked)) {
                    $(`#${pokemon.name}`).hide();
                }
            })


        });
    });

});


