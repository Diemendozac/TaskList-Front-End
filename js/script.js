/*import checkComplete from "./category-components/checkComplete.js";
import deleteIcon from "./category-components/deleteIcon.js";
*/

/*token = eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkaWVtZW5kb3phYyIsImlhdCI6MTY4ODg4NjYwMywiZXhwIjoxNjg4OTczMDAzfQ.8VQTL-PzKjTzFf7Nm-ns6hrqXT-SzOHPuHb_ri3hrbY */
/*status=${task__status.value.toLowercase} */
/*completed: no future */
const addBox = document.querySelector(".add-box"),
  popupBox = document.querySelector(".popup-box"),
  popupTitle = popupBox.querySelector("header p"),
  closeIcon = popupBox.querySelector("header i"),
  titleTag = popupBox.querySelector("input"),
  descTag = popupBox.querySelector("textarea"),
  dueDateTag = popupBox.querySelector("#due-date-field"),
  specifiedTimeTag = popupBox.querySelector("#time-field"),
  categoryTag = popupBox.querySelector("#category-field"),
  relevanceTag = popupBox.querySelector("#relevance-field"),
  addBtn = popupBox.querySelector("button"),
  repeatSwitch = document.getElementById("repetition-slider"),
  repeatBox = document.getElementById("repeat-box"),
  closeExitIcon = document.getElementById("repeat-exit"),
  repeatButton = document.getElementById("repeat-button"),
  repeatType = document.getElementById("repeat-type"),
  interval = document.getElementById("interval"),
  endDateTag = document.getElementById("end-date-field"),
  categoryBtn = document.querySelector("[data-shwcat-btn]"),
  categoryBox = document.querySelector(".category-box"),
  categoryCard = document.querySelector(".mainCard"),
  categoryExitIcon = document.getElementById("category-exit"),
  createCategoryBtn = document.querySelector("[data-form-btn]"),
  searchTaskBtn = document.querySelector("[data-shwtsk-btn]"),
  searchBox = document.getElementById("search-box"),
  closeTaskIcon = document.querySelector("[data-tsksrch-cls]"),
  taskStatusSearch = document.querySelector("[data-task-status]"),
  dueToSearch = document.querySelector("[data-due-to]"),
  relevanceSearch = document.querySelector("[data-relevance-search]"),
  categoryListSearch = document.querySelector("[data-category-search]"),
  categoryListCreate = document.querySelector("[data-category-create]"),
  futureOption = document.querySelector(".dueTo__Data"),
  searchForm = document.getElementById("search-box"),
  searchTaskButton = document.querySelector("[data-task-search]");

const pendingTasksEnd = "/tasks?status=pending";

let categoryArray = ["Salir", "Entrenar", "Estudiar"];
var RepeatOnConfig = {
  type: "",
  interval: "",
  finishDate: "",
};

let note = {
  name: "",
  description: "",
  dueDate: "",
  specifiedTime: "",
  category: "",
  relevance: "",
  isCompleted: false,
  repeatOnConfig: null,
};

let user = {
  userId: "5",
  username: "asdfgg",
  email: "alexit4@gmail.com",
  password: "AlxisMore*00000",
};

let category = {
  name: "",
  user: user,
};

/*const notes = JSON.parse(localStorage.getItem("notes") || "[]");*/
var notes, categories, data;
tasksRequests(JSON.stringify(user), pendingTasksEnd);
categoriesRequests(JSON.stringify(user), pendingTasksEnd);
/*postRequestv2(JSON.stringify(user));*/

let isUpdate = false,
  updateId,
  completedData = ["uil-check", "Done"];

addBox.addEventListener("click", () => {
  popupTitle.innerText = "Add a new Note";
  addBtn.innerText = "Add Note";
  popupBox.classList.add("show");
  dueDateTag.valueAsDate = new Date();
  document.querySelector("body").style.overflow = "hidden";
  if (window.innerWidth > 660) titleTag.focus();
});

closeIcon.addEventListener("click", () => {
  isUpdate = false;
  titleTag.value = descTag.value = "";
  popupBox.classList.remove("show");
  document.querySelector("body").style.overflow = "auto";
});

function showNotes() {
  if (!notes) return;
  document.querySelectorAll(".note").forEach((li) => li.remove());
  notes.forEach((note, id) => {
    let filterDesc = note.description.replaceAll("\n", "<br/>");
    getStatus(id);
    let liTag = `<li class="note">
                        <div class="details">
                            <p>${note.name}</p>
                            <span>${filterDesc}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${note.dueDate}</span>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="menu">
                                    <li onclick="updateNote(${id}, '${note.name}', '${filterDesc}')"><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick="deleteNote(${id})"><i class="uil uil-trash"></i>Delete</li>
                                    <li onclick="setCompleted(${id})"><i class="uil ${completedData[0]}"></i>${completedData[1]}</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;
    addBox.insertAdjacentHTML("afterend", liTag);
  });
}
showNotes();

function showMenu(elem) {
  RepeatOnConfig.type = "";
  RepeatOnConfig.intervals = "";
  elem.parentElement.classList.add("show");
  document.addEventListener("click", (e) => {
    if (e.target.tagName != "I" || e.target != elem) {
      elem.parentElement.classList.remove("show");
    }
  });
}

function deleteNote(noteId) {
  let confirmDel = confirm("Are you sure you want to delete this note?");
  if (!confirmDel) return;
  notes.splice(noteId, 1);
  localStorage.setItem("notes", JSON.stringify(notes));
  showNotes();
}

function updateNote(noteId, title, filterDesc) {
  let description = filterDesc.replaceAll("<br/>", "\r\n");
  updateId = noteId;
  isUpdate = true;
  addBox.click();
  titleTag.value = title;
  descTag.value = description;
  popupTitle.innerText = "Update a Note";
  addBtn.innerText = "Update Note";
}

function setCompleted(noteId) {
  notes[noteId].isCompleted = !notes[noteId].isCompleted;
  showNotes();
}

function getStatus(noteId) {
  if (notes[noteId].isCompleted) {
    completedData = ["uil-times", "Pending"];
  } else {
    completedData = ["uil-check", "Done"];
  }
}

addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let title = titleTag.value.trim();

  if (title) {
    let description = descTag.value.trim(),
      dueDate = dueDateTag.value,
      specifiedTime = specifiedTimeTag.value,
      category = categoryTag.value,
      relevance = relevanceTag.value;
    repeatConfig = RepeatOnConfig;
    let noteInfo = {
      title,
      description,
      dueDate,
      specifiedTime,
      category,
      relevance,
      repeatConfig,
    };
    if (!isUpdate) {
      postRequest(JSON.stringify(noteInfo), createUrl);
      notes.push(noteInfo);
    } else {
      isUpdate = false;
      notes[updateId] = noteInfo;
    }
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
    closeIcon.click();
  }
});

repeatSwitch.addEventListener("click", (e) => {
  repeatSwitch.checked = false;
  if (RepeatOnConfig.type !== "") {
    RepeatOnConfig.type = "";
    RepeatOnConfig.intervals = "";
  } else {
    endDateTag.valueAsDate = new Date();
    repeatBox.classList.add("show");
  }
});

closeExitIcon.addEventListener("click", () => {
  titleTag.value = descTag.value = "";
  repeatBox.classList.remove("show");
});

repeatButton.addEventListener("click", (e) => {
  e.preventDefault();
  if (interval.value > 0) {
    RepeatOnConfig.type = repeatType.value;
    RepeatOnConfig.interval = interval.value;
    RepeatOnConfig.finishDate = endDateTag.value;
    repeatSwitch.checked = true;
    closeExitIcon.click();
  }
  //TODO: ERROR MESSAGE
});

categoryBtn.addEventListener("click", (e) => {
  categoryBox.classList.add("show");
  categoryCard.classList.add("show");
});

categoryExitIcon.addEventListener("click", () => {
  categoryBox.classList.remove("show");
  categoryCard.classList.remove("show");
});

/*Task HTTP Requests */

const searchTask = (event) => {
  categoryBox.classList.add("show");
  searchBox.classList.add("show");
}

searchTaskBtn.addEventListener("click", searchTask);


function endPointGenerator() {
  let allSelectSearchForm = searchForm.querySelectorAll(".row > select");
  let result = "";
  allSelectSearchForm.forEach((element) => {
    
    if(element.value !== "ALL") {
      if(element.name !== "status") result += "&";
      result += `${element.name}=${element.value}`
    } 
  });
  console.log(result.toLowerCase());
}

async function tasksRequests(jsonData, endPoint) {
  notes = await postRequestv2(jsonData, endPoint);
  showNotes();
}

searchTaskBtn.addEventListener("click", (e) => {
  e.preventDefault();
  tasksRequests("", endPointGenerator());
  
});

/*Category HTTP Request*/

const createCategory = (evento) => {
  evento.preventDefault();
  const input = document.querySelector("[data-form-input]");
  const value = input.value.trim();
  if (value !== "") {
    const list = document.querySelector("[data-list]");
    const task = document.createElement("li");
    task.classList.add("card");
    input.value = "";
    //backticks
    const taskContent = document.createElement("div");
    taskContent.classList.add("icon__task");

    const titleTask = document.createElement("span");
    titleTask.classList.add("task");
    titleTask.innerText = value;
    taskContent.appendChild(checkComplete());
    taskContent.appendChild(titleTask);
    // task.innerHTML = content;
    task.appendChild(taskContent);
    task.appendChild(deleteIcon());
    list.appendChild(task);
  }
  input.value = "";
};

createCategoryBtn.addEventListener("click", createCategory);

async function categoriesRequests(jsonData, endPoint) {
  categories = await postRequestv2(jsonData, endPoint);
}

function refreshCategoryCreateSelector(){
  categoryListCreate.innerHTML = "";
  let option = document.createElement("option");
  option.value = "";
  option.text = "None";
  categoryListCreate.appendChild(option);
  for (var i = 0; i < categoryArray.length; i++) {
    option = document.createElement("option");
    option.value = categoryArray[i];
    option.text = categoryArray[i];
    categoryListCreate.appendChild(option);
  }
}

function refreshCategorySearchSelector(){
  categoryListSearch.innerHTML = "";
  let option = document.createElement("option");
  option.value = "";
  option.text = "None";
  categoryListSearch.appendChild(option);
  for (var i = 0; i < categoryArray.length; i++) {
    option = document.createElement("option");
    option.value = categoryArray[i];
    option.text = categoryArray[i];
    categoryListSearch.appendChild(option);
  }
}

taskStatusSearch.addEventListener("change", (e) => {
  if(taskStatusSearch.value === "COMPLETED"){
    futureOption.classList.add("hide");
    if(dueToSearch.value === "FUTURE") {
      dueToSearch.value = "ALL";
    }
  } else {
    futureOption.classList.remove("hide");
  }
});



closeTaskIcon.addEventListener("click", () => {
  categoryBox.classList.remove("show");
  searchBox.classList.remove("show");
});


const checkComplete = () => {
  const i = document.createElement("i");
  i.classList.add("uil", "uil-search", "icon");
  i.addEventListener("click", completeTask);
  return i;
};
// Immediately invoked function expression IIFE
const completeTask = (event) => {
  const element = event.target;
  alert("Hola mundo");
};

const deleteIcon = () => {
  const i = document.createElement("i");
  i.classList.add("uil-trash", "trashIcon", "icon");
  i.addEventListener("click", deleteTask);
  return i;
};

const deleteTask = (event) => {
  const parent = event.target.parentElement;
  parent.remove();
};

function getRequest(url, endPoint) {
  fetch(`${url}${endPoint}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Error en la petición POST");
      }
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("Error:", error);
      return null;
    });
}

async function postRequestv2(jsonData, endPoint) {
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
      `http://localhost:8080${endPoint}`,
      settings
    );
    return (data = await fetchResponse.json());
  } catch (e) {
    return e;
  }
}


