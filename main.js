
const buttons = document.querySelector("div.main div.main-movies div.main-movies-pagination");
const buttonSeach = document.querySelector("div.main div.main-search button");
const nameInput = document.querySelector("div.main div.main-search input:nth-child(2)");
const typeInput = document.querySelector("div.main div.main-search input:nth-child(3)");
const moviesList = document.querySelector("div.main div.main-movies div.main-movies-listMovies");
const mvs = document.querySelector("div.main div.main-movies");
const info = document.querySelector("div.main div.main-info");
let slide;
let countMovie;
let activeBtn;
let lastActiveBtn;
let firstBtn = 1;
let data;
let genre;
const genres = [38];
genres.push("Action", "28", "Adventure", "12", "Animation", "16", "Comedy", "35", "Crime", "80", "Documentary", "99", "Drama", "18", "Family", "10751", "Fantasy", "14", "History", "36", "Horror", "27", "Music", "10402", "Mystery", "9648", "Romance", "10749", "Science Fiction", "878", "TV Movie", "10770", "Thriller", "53", "War", "10752", "Western", "37");

buttonSeach.onclick = () => {

    firstBtn = 1;
    activeBtn = 1;
    buttons.innerHTML = "";
    if (nameInput.value != "") {
        getMovies(nameInput.value);
    }
}
async function getMovies(name) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ZDBmZWI1OWEzZTVmZjA0YWRhZWJhMTg0OTRiOGM0MyIsInN1YiI6IjY1MDljOTYzM2NkMTJjMDE0ZWMwYzA0NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.8pTBLDjXUDM8PjKDdvuih95Rl903gpWfRxRWhYuXvwE'
        }
    };

    data = await fetch(`https://api.themoviedb.org/3/search/movie?query=${name}`, options)
    data = await data.json();

    if (info.style.display == "flex") {
        info.style.display = "none";
        mvs.style.display = "flex";
    }

    if (data.results.length > 2)
        buttons.style.display = "flex";
    else
        buttons.style.display = "none";
    if (typeInput.value != "") {
        let movies_filter = [];
        for (let i = 0; i < data.results.length; i++) {
            for (let j = 0; j < genres.length; j++) {
                if (j == 0 || j % 2 != 0) {
                    if (typeInput.value == genres[j]) {
                        for (let f = 0; f < data.results[i].genre_ids.length; f++) {
                            if (data.results[i].genre_ids[f] == genres[j + 1]) {
                                movies_filter.push(data.results[i]);
                            }
                        }
                    }

                }
            }

        }
        data.results = movies_filter;
    }
    console.log(data.results);
    Fill(data.results)
}
function Fill(collection) {
    moviesList.innerHTML = "";
    if (activeBtn == null) {
        slide = 3;
    }
    else {
        slide = activeBtn * 3;
    }


    let movies = collection;
    countMovie = Math.ceil(movies.length / 3);
    if (countMovie > 1 && activeBtn == null) activeBtn = 1;
    for (let i = slide - 3; i < movies.length; i++) {
        if (moviesList.children.length < 3) {

            if (movies[i].poster_path == null)
                moviesList.innerHTML += `<div class = "main-movies-listMovies-movie"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRb00zu4Jb2DXNS0SzlCXsPjBEKyQEm5jkcfw&usqp=CAU"><div>${movies[i].original_title}</div></div>`;
            else
                moviesList.innerHTML += `<div class = "main-movies-listMovies-movie"><img src="https://image.tmdb.org/t/p/w500/${movies[i].poster_path}"><div>${movies[i].original_title}</div></div>`;

        }

    }
    for (let i = 0; i < moviesList.children.length; i++) {
        moviesList.children[i].onclick = () => {
            info.innerHTML = "";
            info.style.display = "flex";
            mvs.style.display = "none";
            if (movies[slide - (3 - i)].poster_path == null)
                info.innerHTML += `<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRb00zu4Jb2DXNS0SzlCXsPjBEKyQEm5jkcfw&usqp=CAU">`;
            else
                info.innerHTML += `<img src="https://image.tmdb.org/t/p/w500/${movies[slide - (3 - i)].poster_path}">`;
            info.innerHTML += `<div><h2>${movies[slide - (3 - i)].original_title}</h2>
                <div class="main-info-grid">
                <div>Overwiew :</div>
                <div>${movies[slide - (3 - i)].overview}</div>
                <div>Language : </div>
                <div>${movies[slide - (3 - i)].original_language}</div>
                <div>Popularity : </div>
                <div>${movies[slide - (3 - i)].popularity}</div>
                </div>
                </div>`;
            info.innerHTML += "<button><span>B</span><span>a</span><span>c</span><span>k</span></button>";
            info.lastChild.onclick = () => {
                info.style.display = "none";
                mvs.style.display = "flex";
            }

        }
    }
    newButtons();

}
function newButtons() {

    if (countMovie > 1) {

        for (let i = 0; i < countMovie; i++) {
            if (i < 5) {
                if (i + firstBtn != activeBtn)
                    buttons.innerHTML += `<button >${i + firstBtn}</button>`;
                else
                    buttons.innerHTML += `<button id="active">${i + firstBtn}</button>`;
            }
        }
        let i = 0;
        for (const child of buttons.children) {
            makeActive(child, i)
            i++;
        };
    }

}

function makeActive(button, i) {
    button.onclick = () => {
        buttons.innerHTML = "";
        lastActiveBtn = activeBtn;
        activeBtn = +button.innerHTML;
        if (countMovie > 5) {
            if (i == 0 && firstBtn - 1 >= 1) {
                firstBtn--;
            }
            if (i == 4 && firstBtn + 5 <= countMovie) {
                firstBtn++;
            }
        }
        Fill(data.results);
    }
}



