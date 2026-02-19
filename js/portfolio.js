const galleryType = document.body.dataset.gallery;

fetch(`/locales/galleryData/${galleryType}.json`)
  .then(r => r.json())
  .then(renderGallery);



function renderGallery(data) {
  document.querySelector("h1").textContent = data.title;

  const container = document.querySelector(".gallery");

  data.photos.forEach(photo => {
    const item = document.createElement("div");
    item.className = "photo";

    item.innerHTML = `
      ${photo.link ? `<a href="${photo.link}" target="_blank">` : ""}
        <img src="${photo.src}" alt="">
      ${photo.link ? `</a>` : ""}
      <p>${photo.caption}</p>
    `;

    container.appendChild(item);
  });
}