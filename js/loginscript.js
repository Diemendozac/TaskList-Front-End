let formSignUp = document.querySelector(".sign-up"),
  emailFieldSignUp = formSignUp.querySelector(".email-field"),
  emailInputSignUp = emailFieldSignUp.querySelector(".email"),
  passFieldSignUp = formSignUp.querySelector(".create-password"),
  passInputSignUp = passFieldSignUp.querySelector(".password"),
  cPassField = formSignUp.querySelector(".confirm-password"),
  cPassInput = cPassField.querySelector(".cPassword"),
  formLogIn = document.querySelector(".log-in"),
  emailFieldLogIn = formLogIn.querySelector(".email-field"),
  emailInputLogIn = emailFieldLogIn.querySelector(".email"),
  passFieldLogIn = formLogIn.querySelector(".create-password"),
  passInputLogIn = passFieldLogIn.querySelector(".insert-password"),
  signInField = formLogIn.querySelector(".field"),
  usernameField = formSignUp.querySelector(".username-field"),
  usernameInputSignUp = usernameField.querySelector(".username");

  
const loginEndPoint = "http://localhost:8080/login";
const signUpEndPoint = "http://localhost:8080/register";
const taskMenuUrl = "http://127.0.0.1:5500/menu-task-list.html";

let userSignUpData = {
  username: "",
  email: "",
  password: ""
};

let userLoginData = {
  username: "",
  password: ""
};


document.querySelector(".login-container").classList.add("active");

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
  validatePass(passFieldSignUp, passInputSignUp);
  confirmPass(cPassField, cPassInput);

  //calling function on key up
  passInputSignUp.addEventListener("keyup", validatePass);
  cPassInput.addEventListener("keyup", confirmPass);

  if (
    !emailFieldSignUp.classList.contains("invalid") &&
    !passFieldSignUp.classList.contains("invalid") &&
    !cPassField.classList.contains("invalid")
  ) {
    postRequest(signUpDataToJson(), signUpEndPoint);
  }
});

formLogIn.addEventListener("submit", (e) => {
  e.preventDefault(); //preventing form submitting
  validatePass(passFieldLogIn, passInputLogIn);

  //calling function on key up
  passInputLogIn.addEventListener("keyup", validatePass);

  if (
    !emailFieldLogIn.classList.contains("invalid") &&
    !passFieldLogIn.classList.contains("invalid")
  ) {
    //location.href = formLogIn.getAttribute("action");
    if(postRequest(loginDataToJson(), loginEndPoint) === Response.ok) {
      location.href = taskMenuUrl;
    }
  }
});

function signUpDataToJson(){
  userSignUpData.username = usernameInputSignUp.value;
  userSignUpData.email = emailInputSignUp.value;
  userSignUpData.password = passInputSignUp.value;

  return JSON.stringify(userSignUpData);

}

function loginDataToJson(){
  userLoginData.username = emailInputLogIn.value;
  userLoginData.password = passInputLogIn.value;

  return JSON.stringify(userLoginData);

}

async function postRequest(jsonData, endPoint) {
  const location = window.location.hostname;
  const settings = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: jsonData,
  };
  try {
    const fetchResponse = await fetch(
      `${endPoint}`,
      settings
    );
    return (data = await fetchResponse.json());
  } catch (e) {
    return e;
  }
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


/*
function checkEmail(fieldElement, element) {
  const emaiPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  if (!element.value.match(emaiPattern)) {
    return fieldElement.classList.add("invalid"); //adding invalid class if email value do not mathced with email pattern
  }
  fieldElement.classList.remove("invalid"); //removing invalid class if email value matched with emaiPattern
}

 */
