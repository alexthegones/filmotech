// any CSS you import will output into a single css file (app.css in this case)
import './styles/app.css';

// start the Stimulus application
import './bootstrap';
import $ from 'jquery';

require("@fortawesome/fontawesome-free/css/all.min.css");
require("@fortawesome/fontawesome-free/js/all.js");

console.log("ready!");

window.setTimeout(function () {
    $("#alert").fadeTo(500, 0).slideUp(500, function () {
        $(this).remove();
    });
}, 4000);

const xhttp = new XMLHttpRequest();
const search = document.getElementById('search');
search.addEventListener('keyup', () => {
    console.log('test')
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let cards = document.getElementById('cards')
            cards.innerHTML = this.responseText;
        } else if (this.readyState === 4 && this.status === 404) {
            console.log("Erreur 404 :/");
        }
    }
    xhttp.open('GET', '/search/' + search.value, true)
    xhttp.send();
});
// $("#search").autocomplete({
//     source: function (request, response) {
//         $.ajax({
//             url: "{{ path('movie_search_request') }}",
//             data: {
//                 query: request.term,
//             },
//             dataType: 'json',
//             method: 'post'
//         }).done(function (data) {
//             response(data);
//         });
//     },
//     minLength: 3
// })