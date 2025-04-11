const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

const profileEditButton = document.querySelector(".profile__edit-btn");
const profileName = document.querySelector(".profile__name");
const editProfileModal = document.querySelector("#edit-profile-modal");
const closeModalButton = document.querySelector(".modal__close-btn");
const editModalNameInput = document.querySelector("#profile-name-input");
const editModalDescriptionInput = document.querySelector(
  "#profile-description-input"
);
const profileDescription = document.querySelector(".profile__description");
const editFormElement = document.querySelector(".modal__form");
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");
const addCardButton = document.querySelector(".profile__add-btn");
const addCardModal = document.querySelector("#add-card-modal");
const addCardModalCloseButton = document.querySelector(
  "#add-card-modal .modal__close-btn"
);
const addCardFormElement = document.querySelector("[name='add-card-form']");
const cardImageInput = document.querySelector("#card-image-input");
const cardUrlInput = document.querySelector("#caption-input");

function handleAddCardFormSubmit(evt) {
  evt.preventDefault();
  const cardData = {
    name: cardUrlInput.value, // Caption input goes to name
    link: cardImageInput.value, // Image URL input goes to link
  };
  const cardElement = getCardElement(cardData); // Create the card element
  cardsList.prepend(cardElement); // Add it to the page
  closeModal(addCardModal);
  evt.target.reset();
}

addCardFormElement.addEventListener("submit", handleAddCardFormSubmit);

function getCardElement(data) {
  console.log(data);
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  return cardElement;
}

function openModal(modal) {
  modal.classList.add("modal_opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
}

function handleEditFormSubmit(event) {
  event.preventDefault();
  profileName.textContent = editModalNameInput.value;
  profileDescription.textContent = editModalDescriptionInput.value;
  closeModal(editProfileModal);
}
profileEditButton.addEventListener("click", () => openModal(editProfileModal));
closeModalButton.addEventListener("click", () => closeModal(editProfileModal));
editFormElement.addEventListener("submit", handleEditFormSubmit);
addCardButton.addEventListener("click", () => openModal(addCardModal));
addCardModalCloseButton.addEventListener("click", () =>
  closeModal(addCardModal)
);

initialCards.forEach((cardData) => {
  const cardElement = getCardElement(cardData);
  cardsList.append(cardElement);
});
