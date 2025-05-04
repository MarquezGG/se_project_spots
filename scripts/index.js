import {
  settings,
  disableButton,
  resetValidation,
  toggleButtonState,
} from "./validation.js";
const initialCards = [
  {
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
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
const editFormElement = editProfileModal.querySelector(".modal__form");
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");
const addCardButton = document.querySelector(".profile__add-btn");
const addCardModal = document.querySelector("#add-card-modal");
const addCardModalCloseButton = addCardModal.querySelector(".modal__close-btn");
const addCardFormElement = document.querySelector("[name='add-card-form']");
const linkInputEl = document.querySelector("#card-image-input");
const captionInputEl = addCardModal.querySelector("#caption-input");
const previewModalEl = document.querySelector("#preview-modal");
const previewModalCloseButton = document.querySelector(".modal__close-preview");
const previewImageEl = document.querySelector(".modal__image");
const previewCaptionEl = document.querySelector(".modal__caption");
const closeButtons = document.querySelectorAll(".modal__close-btn");
const cardSubmitButton = document.querySelector(".modal__submit-btn");

function handleAddCardFormSubmit(evt) {
  evt.preventDefault();
  const inputValues = {
    name: captionInputEl.value,
    link: linkInputEl.value,
  };

  const cardElement = getCardElement(inputValues);
  cardsList.prepend(cardElement);

  evt.target.reset();
  disableButton(cardSubmitButton, settings);
  closeModal(addCardModal);
}

addCardFormElement.addEventListener("submit", handleAddCardFormSubmit);
previewModalCloseButton.addEventListener("click", () => {
  closeModal(previewModalEl);
});
function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewCaptionEl.textContent = data.name;
    openModal(previewModalEl);
  });

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");
  cardDeleteButton.addEventListener("click", () => {
    cardDeleteButton.closest(".card").remove();
  });
  const cardLikeButton = cardElement.querySelector(".card__like-btn");
  cardLikeButton.addEventListener("click", () => {
    cardLikeButton.classList.toggle("card__like-btn_active");
  });

  return cardElement;
}

closeButtons.forEach((button) => {
  const popup = button.closest(".modal");
  button.addEventListener("click", () => closeModal(popup));
});
function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscapeKey);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscapeKey);
}

function handleEditFormSubmit(event) {
  event.preventDefault();
  profileName.textContent = editModalNameInput.value;
  profileDescription.textContent = editModalDescriptionInput.value;
  closeModal(editProfileModal);
}
profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescriptionInput],
    settings
  );
  const submitButton = editFormElement.querySelector(
    settings.submitButtonSelector
  );
  toggleButtonState(
    [editModalNameInput, editModalDescriptionInput],
    submitButton,
    settings
  );
  openModal(editProfileModal);
});

editFormElement.addEventListener("submit", handleEditFormSubmit);

addCardModalCloseButton.addEventListener("click", () =>
  closeModal(addCardModal)
);
addCardButton.addEventListener("click", () => {
  addCardFormElement.reset();
  resetValidation(addCardFormElement, [linkInputEl, captionInputEl], settings);
  const addCardSubmitButton = addCardFormElement.querySelector(
    settings.submitButtonSelector
  );
  toggleButtonState(
    [linkInputEl, captionInputEl],
    addCardSubmitButton,
    settings
  );
  openModal(addCardModal);
});

initialCards.forEach((item) => {
  const cardElement = getCardElement(item);
  cardsList.append(cardElement);
});

function handleEscapeKey(event) {
  if (event.key === "Escape") {
    const openModal = document.querySelector(".modal_opened");
    if (openModal) {
      closeModal(openModal);
    }
  }
}

document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("mousedown", (event) => {
    if (event.target === modal) {
      closeModal(modal);
    }
  });
});
