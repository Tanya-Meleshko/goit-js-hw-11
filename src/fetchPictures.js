export async function fetchPictures(name, key, page) {
  const response = await fetch(
    `https://pixabay.com/api/?key=${key}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
  );
  const pictures = await response.json();
  return pictures;
}
