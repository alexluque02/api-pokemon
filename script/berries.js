$(document).ready(function () {
    var listadoBerries;
    $.ajax({
        type: "GET",
        url: "https://pokeapi.co/api/v2/berry/",
        success: function (response) {
            listadoBerries = response.results;
            listadoBerries.forEach(berries => {
                var nameReplace = berries.name.replace(/-/g, "_");
                var template = `
                
                `
                $('#listadoBerries').append(template);
            });
        }
    });
    function getPokemonIdFromUrl(url) {
        // Sacar id de la url de pokemon
        return url.split('/').reverse()[1];
    }
});