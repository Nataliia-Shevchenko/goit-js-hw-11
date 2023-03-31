import axios from 'axios';

export class PixabayAPI {
  #BASE_URL = `https://pixabay.com/api/`;
  #KEY = '34807686-506fe36a9d31ea04123a9732d';

  query = null;
  page = 1;

  getPictures() {
    return axios.get(`${this.#BASE_URL}`, {
      params: {
        key: this.#KEY,
        q: this.query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: this.page,
        per_page: 40,
      },
    });
  }
}
