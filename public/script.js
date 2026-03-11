const searchButton = document.getElementById("searchBtn");
// extracting movie poster from tmdb api's
// making the li active
const liButton = document.querySelectorAll(".activeButtons li");
Array.from(liButton).forEach((li)=>{
    li.addEventListener("click",()=>{
        document.getElementById("searchInput").value = li.innerHTML;
    })
});    

//https://developer.themoviedb.org/reference/search-movie
async function getPosterandRating(title){
    const api_key="7bb8b77115ec6779435f9083c0894b32";
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${encodeURIComponent(title)}`);
    const data = await response.json();
    if (!data.results || data.results.length === 0) {
        return "default.png";
    }
    console.log(data.results);
    return data.results;
}
searchButton.addEventListener("click", async () => {
    const resultContainer = document.getElementById("resultsContainer");
    resultContainer.className = "loading";
    resultContainer.innerHTML = `<p class="">🔎 Searching for the perfect movie...</p>
          <!-- From Uiverse.io by mobinkakei --> 
        <div id="wifi-loader">
            <svg class="circle-outer" viewBox="0 0 86 86">
                <circle class="back" cx="43" cy="43" r="40"></circle>
                <circle class="front" cx="43" cy="43" r="40"></circle>
                <circle class="new" cx="43" cy="43" r="40"></circle>
            </svg>
            <svg class="circle-middle" viewBox="0 0 60 60">
                <circle class="back" cx="30" cy="30" r="27"></circle>
                <circle class="front" cx="30" cy="30" r="27"></circle>
            </svg>
            <svg class="circle-inner" viewBox="0 0 34 34">
                <circle class="back" cx="17" cy="17" r="14"></circle>
                <circle class="front" cx="17" cy="17" r="14"></circle>
            </svg>
            <div class="text" data-text="Searching"></div>
        </div>`;
    const query = document.getElementById("searchInput").value;
    console.log("Query to be sent:", query);
    const response = await fetch("/search",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"        
        },
        body: JSON.stringify({ query:query })
    }); 
    const data = await response.json();
    const movieData = data.movieData;
    console.log("Response from server:", data);

    // extracting json from it using regex and parsing it to get the recommended movies id and reason for recommendation
    const match = data.results.match(/\[[\s\S]*\]/);
    if(!match){
        resultContainer.innerHTML = `<h2 class="heading">${data.results} Try a different search term.</h2>
                                    <div class="content">
                                        <h3>Try prompts like:</h3>
                                        <ul class="activeButtons">
                                            <li onclick="document.getElementById('searchInput').value = this.innerHTML;">🚀 A mind-bending sci-fi movie with space travel</li>
                                            <li onclick="document.getElementById('searchInput').value = this.innerHTML;">😂 A funny movie to watch with friends</li>
                                            <li onclick="document.getElementById('searchInput').value = this.innerHTML;">❤️ A romantic movie that won't make me cry</li>
                                            <li onclick="document.getElementById('searchInput').value = this.innerHTML;">🔍 A mystery movie with unexpected twists</li>
                                            <li onclick="document.getElementById('searchInput').value = this.innerHTML;">⚡ A fast-paced action movie from the 2010s</li>
                                        </ul>
                                    </div>
                                    `;
        throw new Error("No JSON found in Gemini response");
    }
    const recommendations = JSON.parse(match[0]);
    const recommendedMovies = movieData.filter(movie => recommendations.some(rec => rec.id === movie.id));
    resultContainer.innerHTML = `<h1 class="heading">Top 3 Recommendations</h1>`;

    const cardsHTML = await Promise.all(recommendedMovies.map(async (movie, index) => {
        const posterData = await getPosterandRating(movie.title);
        const posterURL = `https://image.tmdb.org/t/p/w500${posterData[0].poster_path}`;
        return  `<div class="card" id="card">
                    <div class="poster">
                        <img src="${posterURL}" alt="img">
                        <div class="rating">${posterData[0].vote_average.toFixed(2)}</div>
                    </div>
                    <div class="details">
                        <div class="movieTitle"><span>TITLE</span> :- ${movie.title || "N/A"}</div>
                        <div class="genre"><span>GENRE</span> :- ${movie.genre || "N/A"}</div>
                        <div class="plot"><span>PLOT</span> :- ${movie.plot || "N/A"}</div>
                        <div class="reason"><span>REASON</span> :- ${recommendations[index]?.reason || "N/A"}</div>
                    </div>
                </div>`;
    }));
    resultContainer.innerHTML += `<div class="searchResults">${cardsHTML.join("")}</div>`;
});