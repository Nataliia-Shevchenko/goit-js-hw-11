import Notiflix from 'notiflix';
import { PixabayAPI } from './pixabay-api';
import axios from 'axios';

const searchFormEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

const PixabayApi = new PixabayAPI();

searchFormEl.addEventListener('submit', handleSubmitForm);

function handleSubmitForm(e) {
  e.preventDefault();

  const searchquery = e.currentTarget.elements.searchQuery.value;
  PixabayApi.query = searchquery;
  PixabayApi.page = 1;

  console.log(searchquery);

  PixabayApi.getPictures()
    .then(({ data }) => {
      if (data.hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      console.dir(data.hits);
      const totalPics = data.totalHits;

      Notiflix.Notify.info('Hooray! We found `${totalPics}` images.');
      
      galleryEl.innerHTML = createGalleryItem(data.hits);
      if (data.totalHits > 40) {
        loadMoreBtnEl.classList.remove('is-hidden');
      }
    })
    .catch(error => {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    });
}

loadMoreBtnEl.addEventListener('click', handleLoadMoreBtnClick);

function handleLoadMoreBtnClick(e) {
  PixabayApi.page += 1;

  PixabayApi.getPictures()
    .then(({ data }) => {
      if (PixabayApi.page === data.totalHits / 40) {
        loadMoreBtnEl.classList.add('is-hidden');
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        return;
      }
      if (data.totalHits > 40) {
        galleryEl.insertAdjacentHTML('beforeend', createGalleryItem(data.hits));
      }
    })
    .catch(error => {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    });
}

// /largeImageURL

function createGalleryItem(hits) {
  const markup = hits
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

  return markup;
}
