// any CSS you import will output into a single css file (app.css in this case)
import './styles/app.css';

// start the Stimulus application
import './bootstrap';

require("@fortawesome/fontawesome-free/css/all.min.css");
require("@fortawesome/fontawesome-free/js/all.js");
import $ from 'jquery';

console.log("ready!");

window.setTimeout(function () {
    $("#alert").fadeTo(500, 0).slideUp(500, function () {
        $(this).remove();
    });
}, 4000);

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