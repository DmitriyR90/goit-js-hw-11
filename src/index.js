import './css/styles.css';
import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

axios.defaults.baseURL =
  'https://pixabay.com/api?key=29525143-9c76bb8aba39698f94cc40e50&image_type=photo&orientation=horizontal&safesearch=true&SameSite=None';

const findedImages = document.querySelector('.gallery');
const searchField = document.querySelector('.search-form');
const loadMoreBtn = document.querySelector('.load-more');

let searchData = '';
let currentPage = 1;

searchField.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMoreImages);

// let items = [];

function onSearch(e) {
  e.preventDefault();

  searchData = e.target.elements.searchQuery.value;

  fetchData(searchData);

  loadMoreBtn.classList.add('show');
}

function onLoadMoreImages() {
  currentPage += 1;

  fetchData();
}

function fetchData() {
  axios
    .get(`&q=${searchData}&page=${currentPage}`)
    // .get(`&q=cats`)
    .then(({ data }) => {
      if (data.totalHits === 0) {
        Notify.failure(
          `We're sorry, but you've reached the end of search results.`
        );
        findedImages.innerHTML = '';
        return;
      }
      Notify.success(`Hooray! We found ${data.totalHits} images.`);
      renderList(data.hits);
      console.log(data.hits);
    })
    .catch(error => {
      console.log(error);
    });
}

function renderList(items) {
  const list = items
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div class="photo-card">
      <img src="${webformatURL} " alt="${tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes</b></br>${likes}
        </p>
        <p class="info-item">
          <b>Views</b></br>${views}
        </p>
        <p class="info-item">
          <b>Comments</b></br>${comments}
        </p>
        <p class="info-item">
          <b>Downloads</b></br>${downloads}
        </p>
      </div>
    </div>`
    )
    .join('');

  findedImages.insertAdjacentHTML('beforeend', list);
  console.log(items.length);
}

// async function getUser() {
//     try {
//       const response = await axios.get('/user?ID=12345');
//       console.log(response);
//     } catch (error) {
//       console.error(error);
//     }
//   }
