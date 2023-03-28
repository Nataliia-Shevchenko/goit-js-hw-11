import Notiflix from 'notiflix';
import { PixabayApi } from './pixabayApi';


const searchFormEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');

const PixabayAPI = new PixabayApi();

searchFormEl.addEventListener('submit', handleSubmitForm);

function handleSubmitForm(e) {
  e.preventDefault();
  
  const query = e.currentTarget.elements.searchQuery.value;
  PixabayAPI.q = query;
//   PixabayAPI.page += 1;


  PixabayAPI.fetchPictures()
    .then(results => {
        createGalleryItem(results);
    })
    .catch(error => {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    });
}

// /largeImageURL

function createGalleryItem(results) {
    const markup = results
    .map(({ webformatURL, tags, likes, views, comments, downloads }) => {
      return `
      <div class="photo-card">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes ${likes}</b>
        </p>
        <p class="info-item">
          <b>Views ${views}</b>
        </p>
        <p class="info-item">
          <b>Comments ${comments}</b>
        </p>
        <p class="info-item">
          <b>Downloads ${downloads}</b>
        </p>
      </div>
    </div>
      `;
    })
    .join('');

  galleryEl.innerHTML = markup;
}

