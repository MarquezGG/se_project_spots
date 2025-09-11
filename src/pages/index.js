import "./index.css";
import {
  settings,
  disableButton,
  resetValidation,
  toggleButtonState,
  enableValidation,
} from "../scripts/validation.js";
// const initialCards = [
//   {
//     name: "Golden Gate Bridge",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
//   },
//   {
//     name: "Val Thorens",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
//   {
//     name: "Restaurant terrace",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
//   },
//   {
//     name: "An outdoor cafe",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
//   },
//   {
//     name: "A very long bridge, over the forest and through the trees",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
//   },
//   {
//     name: "Tunnel with morning light",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
//   },
//   {
//     name: "Mountain house",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
// ];
import Api from "../utils/Api.js";

const profileEditButton = document.querySelector(".profile__edit-btn");
const profileName = document.querySelector(".profile__name");
const avatarModal = document.querySelector("#avatar-modal");
const editProfileModal = document.querySelector("#edit-profile-modal");
const closeModalButton = document.querySelector(".modal__close-btn");
const editModalNameInput = document.querySelector("#profile-name-input");
const editModalDescriptionInput = document.querySelector(
  "#profile-description-input"
);
const profileDescription = document.querySelector(".profile__description");
const editFormElement = document.forms["edit-profile"];
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");
const addCardButton = document.querySelector(".profile__add-btn");
const addCardModal = document.querySelector("#add-card-modal");
const addCardFormElement = document.forms["add-card-form"];
const linkInputEl = addCardFormElement.querySelector("#card-image-input");
const captionInputEl = addCardFormElement.querySelector("#caption-input");
const previewModalEl = document.querySelector("#preview-modal");
const previewModalCloseButton = document.querySelector(".modal__close-preview");
const previewImageEl = document.querySelector(".modal__image");
const previewCaptionEl = document.querySelector(".modal__caption");
const closeButtons = document.querySelectorAll(".modal__close-btn");
const cardSubmitButton = document.querySelector(".modal__submit-btn");

const avatarForm = avatarModal.querySelector("#edit-avatar-form");
const avatarSubmitBtn = avatarForm.querySelector(".modal__submit-btn");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");
const avatarButton = document.querySelector(".profile__avatar-btn");
const profileAvatar = document.querySelector(".profile__avatar");

const deleteModal = document.querySelector("#delete-modal");
const deleteForm = document.querySelector("#delete-form");
const deleteConfirmBtn = deleteForm.querySelector('button[type="submit"]');
const deleteCancelBtn = deleteForm.querySelector('button[type="button"]');

// Variable to store the card being deleted
let selectedCard;
let selectedCardId;

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "1d8f73e1-2939-4a01-8227-9e193c82b38f",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    console.log(cards, userInfo);
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });
  })
  .catch(console.error);

function handleAddCardFormSubmit(evt) {
  evt.preventDefault();
  const inputValues = {
    name: captionInputEl.value,
    link: linkInputEl.value,
  };

  api
    .addCard(inputValues)
    .then((data) => {
      const cardElement = getCardElement(data);
      cardsList.prepend(cardElement);
      evt.target.reset();
      disableButton(cardSubmitButton, settings);
      closeModal(addCardModal);
    })
    .catch((error) => {
      console.error("Error adding card:", error);
    });
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
  cardDeleteButton.addEventListener("click", (evt) =>
    handleDeleteCard(cardElement, data)
  );
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
  const form = modal.querySelector(settings.formSelector);
  if (form) {
    const inputs = Array.from(form.querySelectorAll(settings.inputSelector));
    resetValidation(form, inputs, settings);
    const submitButton = form.querySelector(settings.submitButtonSelector);
    disableButton(submitButton, settings);
  }
}
function handleEditFormSubmit(event) {
  event.preventDefault();
  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(console.error);
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

function handleAvatarFormSubmit(event) {
  event.preventDefault();
  api
    .updateAvatar({
      avatar: avatarInput.value,
    })
    .then((data) => {
      profileAvatar.src = data.avatar;
      closeModal(avatarModal);
    })
    .catch(console.error);
}

avatarForm.addEventListener("submit", handleAvatarFormSubmit);

// Handle delete card - store selected card and open modal
function handleDeleteCard(cardElement, data) {
  selectedCard = cardElement; // Assign the card element to selectedCard
  selectedCardId = data._id; // Assign the card's ID to selectedCardId
  openModal(deleteModal); // open the delete confirmation modal
}
// The submission handler makes use of the selectedCard and selectedCardId
// variables to target the correct card.
function handleDeleteSubmit(evt) {
  evt.preventDefault();
  api
    .deleteCard(selectedCardId) // pass the ID to the api function
    .then(() => {
      selectedCard.remove(); // remove the card from the DOM
      closeModal(deleteModal); // close the modal
    })
    .catch(console.error);
}

deleteForm.addEventListener("submit", handleDeleteSubmit);

// Add input validation for avatar form
avatarInput.addEventListener("input", () => {
  toggleButtonState([avatarInput], avatarSubmitBtn, settings);
});

avatarButton.addEventListener("click", () => {
  resetValidation(avatarForm, [avatarInput], settings);
  toggleButtonState([avatarInput], avatarSubmitBtn, settings);
  openModal(avatarModal);
});

addCardButton.addEventListener("click", () => {
  openModal(addCardModal);
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

enableValidation(settings);
