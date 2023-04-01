import Notiflix from 'notiflix';
import { PixabayAPI } from './pixabay-api';

import SimpleLightbox from 'simplelightbox';

import 'simplelightbox/dist/simple-lightbox.min.css';

const searchFormEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

const PixabayApi = new PixabayAPI();

searchFormEl.addEventListener('submit', handleSubmitForm);

async function handleSubmitForm(e) {
  e.preventDefault();

  const searchquery = e.currentTarget.elements.searchQuery.value.trim();
  PixabayApi.query = searchquery;
  PixabayApi.page = 1;

  if (searchquery === '') {
    return;
  }

  try {
    const { data } = await PixabayApi.getPictures();

    loadMoreBtnEl.classList.add('is-hidden');

    if (data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      galleryEl.innerHTML = '';
      return;
    }

    Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);

    galleryEl.innerHTML = createGalleryItem(data.hits);
    lightbox.refresh();

    if (data.totalHits > 40) {
      loadMoreBtnEl.classList.remove('is-hidden');
    }
  } catch (err) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

loadMoreBtnEl.addEventListener('click', handleLoadMoreBtnClick);

async function handleLoadMoreBtnClick(e) {
  PixabayApi.page += 1;

  try {
    const { data } = await PixabayApi.getPictures();

    if (PixabayApi.page > data.totalHits / 40) {
      loadMoreBtnEl.classList.add('is-hidden');
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      return;
    }
    if (data.totalHits > 40) {
      galleryEl.insertAdjacentHTML('beforeend', createGalleryItem(data.hits));
      lightbox.refresh();
    }
  } catch (err) {
    console.log(err);
  }
}

function createGalleryItem(hits) {
  const markup = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
      
      <div class="photo-card">
      <a href="${largeImageURL}">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" />
      </a>
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
      }
    )
    .join('');

  return markup;
}

const lightbox = new SimpleLightbox('.gallery a', {
 
  captionDelay: 250,
});
