const searchBtn = document.getElementById("search-btn");
const animeList = document.querySelector(".anime-card");
const detailsContainer = document.getElementById("anime-details-container");

searchBtn.addEventListener("click", getAnimeList);

function getAnimeList() {
  let searchInputTxt = document.getElementById("search-input").value.trim();
  fetch(`https://api.jikan.moe/v4/anime?q=${searchInputTxt}&limit=15`)
    .then((response) => response.json())
    .then((data) => {
      let html = "";
      if (data.data.length) {
        data.data.forEach((anime) => {
          html += `
                                <div class="col-md-4">
                                    <div class="card mb-4 shadow-sm" data-id="${anime.mal_id}">
                                        <img src="${anime.images.jpg.image_url}" class="card-img-top" alt="anime image">
                                        <div class="card-body">
                                            <h5 class="card-title">${anime.title}</h5>
                                            <button class="btn details-btn">Get Details</button>
                                        </div>
                                    </div>
                                </div>`;
        });
        animeList.innerHTML = html;
        addDetailsEventListeners();
      } else {
        animeList.innerHTML =
          "<p class='text-center'>Sorry, we didn't find any anime!</p>";
      }
    })
    .catch((error) => console.error("Error fetching anime:", error));
}

function addDetailsEventListeners() {
  const detailsButtons = document.querySelectorAll(".details-btn");
  detailsButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const animeId = e.target.closest(".card").dataset.id;
      showAnimeDetails(animeId);
    });
  });
}

function showAnimeDetails(animeId) {
  fetch(`https://api.jikan.moe/v4/anime/${animeId}`)
    .then((response) => response.json())
    .then((data) => {
      const anime = data.data;
      const modalContent = `
                        <div class="details-content">
                            <img src="${anime.images.jpg.image_url}" alt="anime image">
                            <div class="details-info">
                                <h1>${anime.title}</h1>
                                <p>${anime.synopsis}</p>
                                <ul>
                                    <li><strong>Type:</strong> ${anime.type}</li>
                                    <li><strong>Episodes:</strong> ${anime.episodes}</li>
                                    <li><strong>Score:</strong> ${anime.score}</li>
                                    <li><strong>Rated:</strong> ${anime.rating}</li>
                                    <li><strong>Duration:</strong> ${anime.duration}</li>
                                </ul>
                            </div>
                        </div>
                        <div class="details-btn-container">
                            <button id="close-details-btn">Close</button>
                        </div>
                    `;
      detailsContainer.innerHTML = modalContent;
      detailsContainer.style.display = "block";
      document
        .getElementById("close-details-btn")
        .addEventListener("click", () => {
          detailsContainer.style.display = "none";
        });
    })
    .catch((error) => console.error("Error fetching anime details:", error));
}
