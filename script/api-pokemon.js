$(document).ready(function () {
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