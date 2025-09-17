import "./index.css";
import {
  settings,
  disableButton,
  resetValidation,
  toggleButtonState,
  enableValidation,
} from "../scripts/validation.js";
import { setButtonText } from "../utils/Helper.js";
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
    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;
    profileAvatar.src = userInfo.avatar;
  })
  .catch(console.error);

function handleAddCardFormSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  const inputValues = {
    name: captionInputEl.value,
    link: linkInputEl.value,
  };

  setButtonText(submitBtn, true, "Save", "Saving...");
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
    })
    .finally(() => {
      setButtonText(submitBtn, false, "Save", "Saving...");
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
  const cardLikeButton = cardElement.querySelector(".card__like-btn");
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");
  if (data.isLiked) {
    cardLikeButton.classList.add("card__like-btn_active");
  }

  function handleLike(evt) {
    const isLiked = evt.target.classList.contains("card__like-btn_active");
    api
      .changeLikeStatus(data._id, isLiked)
      .then((updatedCard) => {
        evt.target.classList.toggle("card__like-btn_active", !isLiked);
      })
      .catch(console.error);
  }

  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewCaptionEl.textContent = data.name;
    openModal(previewModalEl);
  });

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  cardDeleteButton.addEventListener("click", (evt) =>
    handleDeleteCard(cardElement, data)
  );

  cardLikeButton.addEventListener("click", (evt) => handleLike(evt, data._id));

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
  const submitBtn = event.submitter;
  setButtonText(submitBtn, true, "Save", "Saving...");
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
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Save", "Saving...");
    });
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
  const submitBtn = event.submitter;
  setButtonText(submitBtn, true, "Save", "Saving...");
  api
    .updateAvatar({
      avatar: avatarInput.value,
    })
    .then((data) => {
      profileAvatar.src = data.avatar;
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Save", "Saving...");
    });
}

avatarForm.addEventListener("submit", handleAvatarFormSubmit);

function handleDeleteCard(cardElement, data) {
  selectedCard = cardElement;
  selectedCardId = data._id;
  openModal(deleteModal);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true, "Delete", "Deleting...");
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Delete", "Deleting...");
    });
}

deleteForm.addEventListener("submit", handleDeleteSubmit);

deleteCancelBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

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
