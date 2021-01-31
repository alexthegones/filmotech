const xhttp = new XMLHttpRequest();
const search = document.getElementById('search');
search.addEventListener('keyup', () => {
    if (search.value.length >= 3 && search.value !== "") {
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let cards = document.querySelector('.cards')
                let data = JSON.parse(this.response);
                cards.innerHTML = data.content;
            } else if (this.readyState === 4 && this.status === 404) {
                console.log("Erreur 404 :/");
            }
        }
        xhttp.open('GET', '/search/' + search.value, true)
        xhttp.send();
    }
});
