let formSignUp = document.querySelector(".sign-up"),
  emailFieldSignUp = formSignUp.querySelector(".email-field"),
  emailInputSignUp = emailFieldSignUp.querySelector(".email"),
  passFieldSignUp = formSignUp.querySelector(".create-password"),
  passInputSignUp = passFieldSignUp.querySelector(".password"),
  cPassField = formSignUp.querySelector(".confirm-password"),
  cPassInput = cPassField.querySelector(".cPassword");
let formLogIn = document.querySelector(".log-in"),
  emailFieldLogIn = formLogIn.querySelector(".email-field"),
  emailInputLogIn = emailFieldLogIn.querySelector(".email"),
  passFieldLogIn = formLogIn.querySelector(".create-password"),
  passInputLogIn = passFieldLogIn.querySelector(".insert-password"),
  SignInField = formLogIn.querySelector(".field");
const loginUrl = "http://localhost:8080/api/books";
const signUpUrl = "http://localhost:8081/api/books";
const taskMenuUrl = "http://127.0.0.1:5500/menu-task-list.html";


document.querySelector(".login-container").classList.add("active");

// Email Validtion
function checkEmail(fieldElement, element) {
  const emaiPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  if (!element.value.match(emaiPattern)) {
    return fieldElement.classList.add("invalid"); //adding invalid class if email value do not mathced with email pattern
  }
  fieldElement.classList.remove("invalid"); //removing invalid class if email value matched with emaiPattern
}

// Hide and show password
const eyeIcons = document.querySelectorAll(".show-hide");

eyeIcons.forEach((eyeIcon) => {
  eyeIcon.addEventListener("click", () => {
    const pInput = eyeIcon.parentElement.querySelector("input"); //getting parent element of eye icon and selecting the password input
    if (pInput.type === "password") {
      eyeIcon.classList.replace("bx-hide", "bx-show");
      return (pInput.type = "text");
    }
    eyeIcon.classList.replace("bx-show", "bx-hide");
    pInput.type = "password";
  });
});

// Password Validation
function validatePass(fieldElement, element) {
  const passPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!element.value.match(passPattern)) {
    return fieldElement.classList.add("invalid"); //adding invalid class if password input value do not match with passPattern
  }
  fieldElement.classList.remove("invalid"); //removing invalid class if password input value matched with passPattern
}

// Confirm Password Validtion
function confirmPass(fieldElement, element) {
  if (element.value !== element.value || cPassInput.value === "") {
    return fieldElement.classList.add("invalid");
  }
  cPassField.classList.remove("invalid");
}

// Calling Funtion on Form Sumbit
formSignUp.addEventListener("submit", (e) => {
  e.preventDefault(); //preventing form submitting
  checkEmail(emailFieldSignUp, emailInputSignUp);
  validatePass(passFieldSignUp, passInputSignUp);
  confirmPass(cPassField, cPassInput);

  //calling function on key up
  emailInputSignUp.addEventListener("keyup", checkEmail);
  passInputSignUp.addEventListener("keyup", validatePass);
  cPassInput.addEventListener("keyup", confirmPass);

  if (
    !emailFieldSignUp.classList.contains("invalid") &&
    !passFieldSignUp.classList.contains("invalid") &&
    !cPassField.classList.contains("invalid")
  ) {
    inputToJsonConverter(formSignUp)
    postRequest(inputToJsonConverter(formSignUp), signUpUrl);
  }
});

formLogIn.addEventListener("submit", (e) => {
  e.preventDefault(); //preventing form submitting
  checkEmail(emailFieldLogIn, emailInputLogIn);
  validatePass(passFieldLogIn, passInputLogIn);

  //calling function on key up
  emailInputLogIn.addEventListener("keyup", checkEmail);
  passInputLogIn.addEventListener("keyup", validatePass);

  if (
    !emailFieldLogIn.classList.contains("invalid") &&
    !passFieldLogIn.classList.contains("invalid")
  ) {
    //location.href = formLogIn.getAttribute("action");
    if(postRequest(inputToJsonConverter(formLogIn), loginUrl) === Response.ok) {
      location.href = taskMenuUrl;
    }
  }
});

function inputToJsonConverter(form){
  var formData = new FormData();
  var formElements = form.querySelectorAll("div > .input-field > input");

  for(var i = 0; i < 2; i++){
    var fieldName = formElements[i].name;
    var fieldValue = formElements[i].value;
    formData.append(fieldName, fieldValue);
  }

  var jsonObject = {};

  formData.forEach(function(value, key) {
    jsonObject[key] = value;
  });

  var jsonData = JSON.stringify(jsonObject);
  return jsonData;

}

function postRequest(jsonData, endPoint) {
  fetch(endPoint, {
    method: 'POST',
    headers: {
      'Content-Type' : 'application/json'
    },
    body: jsonData
  }).then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Error en la petición POST');
    }
  })
  /*.then(data => {
    return data;
  })
  .catch(error => {
    console.error('Error:', error);
    return null;
  });*/
}



document.querySelector("#sign-up-a").addEventListener("click", function () {
  document.querySelector(".login-container").classList.remove("active");
  document.querySelector(".signup-container").classList.add("active");
  emailFieldLogIn.classList.remove("invalid");
  passFieldLogIn.classList.remove("invalid");
});
document.querySelector("#log-in-a").addEventListener("click", function () {
  document.querySelector(".signup-container").classList.remove("active");
  document.querySelector(".login-container").classList.add("active");
  emailFieldSignUp.classList.remove("invalid");
  passFieldSignUp.classList.remove("invalid");
  cPassField.classList.remove("invalid");
});
