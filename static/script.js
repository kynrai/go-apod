
/* API endpoint paths, using either current server or public instance */
const makeEndpointUrls = () => {
  const hostname = window.location.origin || 'go-apod.herokuapp.com';
  return {
    home: hostname,
    apod: `${hostname}/apod`,
    image: `${hostname}/image`,
  };
};


/* Fetch data from APOD API */
const makeRequest = () => {
  const apiUrl = makeEndpointUrls().apod;
  fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    hideLoader();
    updateDom(data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

const hideLoader = () => {
  document.getElementById('loader').style.display = 'none';
  document.getElementsByClassName('apod-info')[0].style.display = 'block';
};

const formatDate = (date) => {
  if (!date) return '';
  return new Date().toLocaleDateString(
    "en-US",
    { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
  );
};

/* Using the response from APOD API, update the DOM to render results */
const updateDom = (apod) => {
  const titleElem = document.getElementById('apod-title');
  const descriptionElem = document.getElementById('apod-explanation');
  const copyrightElem = document.getElementById('apod-copyright');
  const dateElem = document.getElementById('apod-date');
  const linkElem = document.getElementById('apod-hd-link');
  const iframeElem = document.getElementById('apod-dynamic-content');
  const imageElem = document.getElementById('apod-picture');

  titleElem.innerText = apod.title;
  descriptionElem.innerText = apod.explanation;
  copyrightElem.innerText = apod.copyright || '';
  dateElem.innerText = formatDate(apod.date);
  linkElem.innerText = 'View HD Image';
  linkElem.setAttribute('href', apod.hdurl || apod.url);

  if (apod.media_type !== 'image') {
    iframeElem.setAttribute('src', apod.url);
    iframeElem.style.display = 'block';
    imageElem.style.display = 'none';
    linkElem.innerText = 'View Dynamic Content';
  }
}

/* Updates API docs with endpoint based on hostname */
const setApiEndPoints = () => {
  const { apod, image } = makeEndpointUrls();
  document.getElementById('get-apod').innerText = apod;
  document.getElementById('get-img').innerText = image;
}

/* When page has loaded, make request then update the DOM  */
document.addEventListener('DOMContentLoaded', (e) => {
  makeRequest();
  setApiEndPoints();
});
