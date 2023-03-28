export class PixabayApi {
    #BASE_URL = `https://pixabay.com/api/`;
    #KEY = '34807686-506fe36a9d31ea04123a9732d';
  
    q = null;
    page = 1;
    per_page = 40;
  
    fetchPictures() {
      const searchParams = new URLSearchParams({
        key: this.#KEY,
        q: this.q,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: this.page,
        per_page: this.per_page,
      });
  
      return fetch(`${this.#BASE_URL}?${searchParams}`).then(
        responce => {
          if (!responce.ok) {
            throw new Error(responce.status);
          }
          return responce.json();
        }
      );
    }
  }
  