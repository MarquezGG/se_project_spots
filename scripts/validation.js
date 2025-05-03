export const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

const showInputError = (formEl, inputEl, errorMessage, settings) => {
  const errorMessegeEl = formEl.querySelector(`#${inputEl.id}-error`);
  errorMessegeEl.textContent = errorMessage;
  inputEl.classList.add(settings.inputErrorClass);
  errorMessegeEl.classList.add(settings.errorClass);
};

const hideInputError = (formEl, inputEl, settings) => {
  const errorMessegeEl = formEl.querySelector(`#${inputEl.id}-error`);
  errorMessegeEl.textContent = "";
  inputEl.classList.remove(settings.inputErrorClass);
  errorMessegeEl.classList.remove(settings.errorClass);
};

const checkInputValidity = (formEl, inputEl, settings) => {
  console.log(inputEl.validationMessage);
  if (!inputEl.validity.valid) {
    showInputError(formEl, inputEl, inputEl.validationMessage, settings);
  } else {
    hideInputError(formEl, inputEl, settings);
  }
};

const hasInvalidInput = (inputList) => {
  return inputList.some((input) => {
    return !input.validity.valid;
  });
};
const toggleButtonState = (inputList, buttonElement, settings) => {
  if (hasInvalidInput(inputList)) {
    disableButton(buttonElement, settings);
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove(settings.inactiveButtonClass);
  }
  console.log(hasInvalidInput(inputList));
};

export const disableButton = (buttonElement, settings) => {
  buttonElement.disabled = true;
  buttonElement.classList.add(settings.inactiveButtonClass);
};

const resetValiidation = (formEl, inputList, settings) => {
  inputList.forEach((input) => {
    hideInputError(formEl, input, settings);
  });
};
const setEventListeners = (formEl, config) => {
  const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
  const buttonElement = formEl.querySelector(config.submitButtonSelector);

  toggleButtonState(inputList, buttonElement, config);
  console.log(inputList);
  console.log(buttonElement);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(formEl, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
};

const enableValidation = (config) => {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  console.log(formList);
  formList.forEach((formEl) => {
    setEventListeners(formEl, config);
  });
};

enableValidation(settings);
