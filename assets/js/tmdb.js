var saisie_movie = document.getElementById('search_input');
var cardgroup = document.getElementById('cardgroup');
var msg_info = document.getElementById('alert')
var xhr = new XMLHttpRequest();
const key = "8dd536bbbf7c8d2bf05ad77b56566c1d"; // *API KEY
const baseURL = "https://api.themoviedb.org/3/";
var lang = "fr-FR";

/**
 * Appel API TMDB Recherche de Films [GET Search]
 * @function getMovies
 */
function getMovies() {
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let data = JSON.parse(this.responseText);
            console.log(data);
            for (i = 0; i < data.results.length; i++) {
                cardMovies(data);
                alert_msg("Recherche du film ");
            }
        } else if (this.readyState === 4 && this.status === 404) {
            console.log("Erreur 404 :/");
        }
    };
    xhr.open("GET", baseURL + "search/movie?api_key=" + key + "&language=" + lang + "&query=" + saisie_movie.value, true);
    xhr.send();
}

/**
 * Appel API TMDB Recherche de séries (GET Search)
 */
function getTVShow() {
    fetch(baseURL + "search/tv?api_key=" + key + "&language=" + lang + "&query=" + saisie_movie.value)
        .then(response => {
            if (response.ok) {
                response.json().then(data => {
                    // console.log(data)
                    for (i = 0; i < data.results.length; i++){
                        cardMovies(data)
                    }
                })
            } else {
                console.log('Mauvaise réponse du réseau' + response.statusText)
            }
        })
        .catch((error) => {
            console.log('Il y a eu un problème avec l\'opération fetch: ' + error.message)
        });
}

/**
 *
 * @param url
 * @param isJson
 * @param data
 */
function sendToController(url, isJson, data) {
    xhr.open("POST", url, true);
    if (isJson) {
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    }
    xhr.send(JSON.stringify(data));
}

if (saisie_movie) {
    saisie_movie.addEventListener("keyup", function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            cardgroup.innerHTML = "";
            getMovies();
            alert_msg("Recherche" + saisie_movie.value + "effectuée");
            // getTVShow();
        }
    });
}

/**
 * Fonction d'affichage poster film (card)
 * @function cardMovies
 */
function cardMovies(dataSearch) {
    // * Global Element Card
    let card = document.createElement("div");
    card.className = "card";

    // * Poster movie
    let poster_path = dataSearch.results[i].poster_path;
    let poster = document.createElement("img");
    poster.className = "card-img-top";
    poster.src =
        "https://image.tmdb.org/t/p/w300" + poster_path;
    poster.style.height = "400px";

    // * Corps de la card
    let body = document.createElement("div");
    body.className = "card-body ";

    // * Title
    let title = dataSearch.results[i].title;
    let titre = document.createElement("h5");
    titre.className = "film-title";
    titre.innerText = title;

    // * Synopsis
    let synopsis = dataSearch.results[i].overview;
    let description = document.createElement("p");
    description.className = "synopsis";
    description.innerText = synopsis;

    // * Sortie
    let sortie = dataSearch.results[i].release_date;
    let small = document.createElement("small");
    small.className = "text-muted";
    small.style.fontSize = "16px";
    small.innerText = "Sortie : " + sortie;

    // let id = dataSearch.results[i].id; // * ID film
    let affiche = "https://image.tmdb.org/t/p/w300" + poster_path;
    let movie = {
        "titre": title,
        "affiche": affiche,
        "description": synopsis,
        "sortie": sortie
    }
    // * Add Button Movie
    let btnAdd = document.createElement("button");
    btnAdd.innerText = "Ajouter";
    btnAdd.className = "btn_Add";
    btnAdd.addEventListener('click', (e) => {
        e.preventDefault();
        sendToController("/movie/search/" + saisie_movie.value, true, movie);
        alert_msg("Ajoute du film ");
    })

    // * IMDB Page Movie Details Button
    let btnD = document.createElement("button");
    btnD.type = "button";
    btnD.innerText = "Details ";
    btnD.className = " row btn_D";
    let i_Detail = document.createElement("i");
    i_Detail.className = "fas fa-info";
    // btnD.addEventListener("click", function () {
    //     getDetails(id);
    // });

    // * Trailer Youtube Button
    let btnT = document.createElement("button");
    btnT.type = "button";
    btnT.innerText = "Trailer on Youtube ";
    btnT.className = "btn_T";
    let i_Ytb = document.createElement("i");
    i_Ytb.className = "fab fa-youtube i";
    // btnT.addEventListener("click", function () {
    //     getTrailer(id);
    // });

    // * Intégration des cards
    card.appendChild(poster);
    card.appendChild(body);
    body.appendChild(titre);
    body.appendChild(description);
    body.appendChild(btnAdd);
    // body.appendChild(btnD);
    // body.appendChild(btnT);
    // btnT.appendChild(i_Ytb);
    // btnD.appendChild(i_Detail);
    cardgroup.appendChild(card);
}

function alert_msg(msg) {
    msg_info.style.display = 'block';
    msg_info.innerText =  msg;
}