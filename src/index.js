import { fetchPictures } from './fetchPictures';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const key = '30714189-c7a9caa64088584cf8591e191';
let page = null;
let inputValue = '';

const gallery = document.querySelector('.gallery-wrapper');
const loadMoreBtn = document.querySelector('.load-more');
const formEl = document.querySelector('#search-form');

formEl.addEventListener('submit', onFormSubmit);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onFormSubmit(event) {
  event.preventDefault();
  gallery.innerHTML = '';
  loadMoreBtn.classList.add('is-hidden');
  page = 1;

  inputValue = event.target.elements.searchQuery.value;

  try {
    const data = await fetchPictures(inputValue, key, page);

    if (data.hits.length === 0) {
      onEmptyRequest();
      return;
    }

    if (page > data.totalHits / 40) {
      loadMoreBtn.classList.add('is-hidden');
      Notiflix.Notify.warning('Картинки на эту тему закончились');
      renderPictures(data.hits);
      return;
    }

    Notiflix.Notify.success(
      `Успех! На эту тему найдено ${data.totalHits} картинок`
    );

    renderPictures(data.hits);

    loadMoreBtn.classList.remove('is-hidden');

    page += 1;
  } catch (error) {
    console.log(error);
  }
}

function renderPictures(pictures) {
  const murkup = pictures
    .map(picture => {
      return `<div class="gallery">
      <a class="gallery__item" href="${picture.largeImageURL}">
        <img
          class="gallery-image"
          src="${picture.webformatURL}"
          alt="${picture.tags}"
        />
      </a>
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          ${picture.likes}
        </p>
        <p class="info-item">
          <b>Views</b>
          ${picture.views}
        </p>
        <p class="info-item">
          <b>Comments</b>
          ${picture.comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>
          ${picture.downloads}
        </p>
      </div>
    </div>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', murkup);
  let lightbox = new SimpleLightbox('.gallery a');
}

function onEmptyRequest() {
  gallery.innerHTML = '';
  Notiflix.Notify.failure('Нет картинок по такому запросу');
}

async function onLoadMore() {
  const data = await fetchPictures(inputValue, key, page);
  try {
    if (page > data.totalHits / 40) {
      loadMoreBtn.classList.add('is-hidden');
      Notiflix.Notify.warning('Картинки на эту тему закончились');
    }
    renderPictures(data.hits);
    page += 1;
    addAutoScroll();
  } catch (error) {
    console.log(error);
  }
}

function addAutoScroll() {
  const { height: cardHeight } =
    gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
