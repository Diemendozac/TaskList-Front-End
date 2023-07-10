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
  searchTaskButton = document.querySelector("[data-task-search]"),
  categoryCardsList = document.querySelector(".cardsList"),
  sendReportBtn = document.querySelector("[data-sndrep-btn]");
  /*reportBox = document.querySelector("");*/

const pendingTasksEnd = "/tasks?status=pending";
var token = localStorage.getItem("token");

var RepeatOnConfig = {
  type: "",
  interval: "",
  finishDate: "",
};

let category = {
  categoryId: -1,
  name: "",
};

let noteIdAux;

/*const notes = JSON.parse(localStorage.getItem("notes") || "[]");*/
var notes = [],
  categories = [],
  data;
getRequestforTaskSearch(pendingTasksEnd);
getAllCategories("/categories");

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
  let filterDesc;
  document.querySelectorAll(".note").forEach((li) => li.remove());
  notes.forEach((note, id) => {
    if(note.description !== null){
      filterDesc = note.description.replaceAll("\n", "<br/>");
    } else {
      filterDesc = "";
    }
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
  /*let confirmDel = confirm("Are you sure you want to delete this note?");
  if (!confirmDel) return;*/
  console.log(notes[noteId].taskId);
  deleteRequestForTask(`/tasks/${notes[noteId].taskId}`);
  getRequestforTaskSearch(pendingTasksEnd);
}

function updateNote(noteId, title, filterDesc) {
  let description = filterDesc.replaceAll("<br/>", "\r\n");
  updateId = noteId;
  noteIdAux = noteId;
  isUpdate = true;
  addBox.click();
  titleTag.value = title;
  descTag.value = description;
  popupTitle.innerText = "Update a Note";
  addBtn.innerText = "Update Note";
}

function setCompleted(noteId) {
  putStatusOnTask(`/tasks/${notes[noteId].taskId}`);
  showNotes();
}

function getStatus(noteId) {
  if (notes[noteId].completedDate === null) {
    completedData = ["uil-check", "Done"];   
  } else {
    completedData = ["uil-times", "Pending"];
  }
}

addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let name = titleTag.value.trim();

  if (name) {
    let description = descTag.value.trim(),
      dueDate = dueDateTag.value,
      specifiedTime = specifiedTimeTag.value,
      category,
      relevance = relevanceTag.value,
      repeatConfig;

    if(categoryTag.value === '') {
      category = null;
    } else {
      category = categories[categoryTag.value];
    }

    if(RepeatOnConfig.type === ""){
      repeatConfig = null;
    } else {
      repeatConfig = RepeatOnConfig;
    }
      
    let noteInfo = {
      taskId: null,
      name: name,
      description: description,
      category: category,
      relevance: relevance,
      dueDate: dueDate,
      specifiedTime: specifiedTime,
      repeatConfig: repeatConfig,
    };
    setBlankToNull(noteInfo);

    if (!isUpdate) {
      postRequestforTaskCreation(JSON.stringify(noteInfo), "/tasks");
    } else {
      isUpdate = false;
      noteInfo.taskId = notes[noteIdAux].taskId;
      let temp = noteInfo;
      temp = {...noteInfo, user: { userId: notes[noteIdAux].user.userId }};
      putRequestForTask(JSON.stringify(temp), "/tasks");
      
    }
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
    closeIcon.click();
  }
});

function setBlankToNull(obj) {
  Object.keys(obj).forEach(function (index) {
    if (obj[index] === "") {
      obj[index] = null;
    }
  });
}

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
  categoryCardsList.innerHTML = "";
  refreshCategoryManager();
});

categoryExitIcon.addEventListener("click", () => {
  categoryBox.classList.remove("show");
  categoryCard.classList.remove("show");
});

/*Task HTTP Requests */

const searchTask = (event) => {
  categoryBox.classList.add("show");
  searchBox.classList.add("show");
};

searchTaskBtn.addEventListener("click", searchTask);

function endPointTaskQueryGenerator() {
  let allSelectSearchForm = searchForm.querySelectorAll(".row > select");
  let result = "/tasks?";
  allSelectSearchForm.forEach((element) => {
    if (element.value !== "all") {
      if (element.value !== "status" && element.value !== "pending") result += "&";
      result += `${element.name}=${element.value}`;
    }
  });
  console.log(result);
  return result;
}

searchTaskButton.addEventListener("click", (e) => {
  e.preventDefault();
  getRequestforTaskSearch(endPointTaskQueryGenerator());
  categoryBox.classList.remove("show");
  searchBox.classList.remove("show");
});

/*Category HTTP Request*/

const createCategory = (evento) => {
  evento.preventDefault();
  let category = {
    name: ""
  };
  const input = document.querySelector("[data-form-input]");
  category.name = input.value.trim();
  console.log(category);
  postNewCategory(JSON.stringify(category), "/categories");
  input.value = "";
};

createCategoryBtn.addEventListener("click", createCategory);

function refreshCategoryCreateSelector() {
  categoryListCreate.innerHTML = "";
  let option = document.createElement("option");
  option.value = "";
  option.text = "None";
  categoryListCreate.appendChild(option);
  for (var i = 0; i < categories.length; i++) {
    option = document.createElement("option");
    option.value = i;
    option.text = categories[i].name;
    categoryListCreate.appendChild(option);
  }
}

function refreshCategorySearchSelector() {
  categoryListSearch.innerHTML = "";
  let option = document.createElement("option");
  option.value = "all";
  option.text = "ALL";
  categoryListSearch.appendChild(option);
  for (var i = 0; i < categories.length; i++) {
    option = document.createElement("option");
    option.value = categories[i].categoryId;
    option.text = categories[i].name;
    categoryListSearch.appendChild(option);
  }
}

function refreshCategoryManager() {
  
  categoryCardsList.innerHTML = "";
  for(var i = 0; i < categories.length; i++) {
    const list = document.querySelector("[data-list]");
    const task = document.createElement("li");
    task.value = categories[i].categoryId;
    task.classList.add("card");
    //backticks
    const taskContent = document.createElement("div");
    taskContent.classList.add("icon__task");

    const titleTask = document.createElement("span");
    titleTask.classList.add("task");
    titleTask.innerText = categories[i].name;
    taskContent.appendChild(checkComplete());
    taskContent.appendChild(titleTask);
    // task.innerHTML = content;
    task.appendChild(taskContent);
    task.appendChild(deleteIcon());
    list.appendChild(task);

  }
}
taskStatusSearch.addEventListener("change", (e) => {
  if (taskStatusSearch.value === "COMPLETED") {
    futureOption.classList.add("hide");
    if (dueToSearch.value === "FUTURE") {
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
  i.addEventListener("click", deleteCategory);
  return i;
};

const deleteCategory = (event) => {
  const parent = event.target.parentElement;
  let categoryId = event.srcElement.parentElement.value;
  console.log(categoryId);
  deleteRequestForCategory(`/categories/${categoryId}`,  parent);

};

sendReportBtn.addEventListener("click", () => {
  getReportRequest("/report");
});


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

async function getReportRequest(endPoint) {
  const settings = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
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

async function getRequestforTaskSearch(endPoint) {
  const settings = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    },
  };
  try {
    const fetchResponse = await fetch(
      `http://localhost:8080${endPoint}`,
      settings
    );
    notes = await fetchResponse.json();
    showNotes();
  } catch (e) {
    return e;
  }
}

async function postRequestforTaskCreation(noteInfo, endPoint) {
  const settings = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: noteInfo,
  };
  try {
    const fetchResponse = await fetch(
      `http://localhost:8080${endPoint}`,
      settings
    );
    note = await fetchResponse.json();
    notes.push(note);
    showNotes();
  } catch (e) {
    return e;
  }
}

async function putRequestForTask(noteInfo, endPoint) {
  const settings = {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: noteInfo
  };
  try {
    const fetchResponse = await fetch(
      `http://localhost:8080${endPoint}`,
      settings
    );
    note = await fetchResponse.json();
    notes[updateId] = note;
    showNotes();
  } catch (e) {
    return e;
  }
}

async function putStatusOnTask(endPoint) {
  const settings = {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    },
  };
  try {
    const fetchResponse = await fetch(
      `http://localhost:8080${endPoint}`,
      settings
    );
    location.reload();
    showNotes();
  } catch (e) {
    return e;
  }
}



async function deleteRequestForTask(endPoint) {
  const settings = {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    },
  };
  try {
    const fetchResponse = await fetch(
      `http://localhost:8080${endPoint}`,
      settings
    );
    location.reload();
  } catch (e) {
    return e;
  }
}

async function getAllCategories(endPoint) {
  const settings = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    },
  };
  try {
    const fetchResponse = await fetch(
      `http://localhost:8080${endPoint}`,
      settings
    );
    categories = await fetchResponse.json();
    refreshCategoryCreateSelector();
    refreshCategorySearchSelector();
    
  } catch (e) {
    return e;
  }
}

async function postNewCategory(categoryInfo, endPoint) {
  const settings = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: categoryInfo,
  };
  try {
    const fetchResponse = await fetch(
      `http://localhost:8080${endPoint}`,
      settings
    );
    let newCategory = await fetchResponse.json();
    categories.push(newCategory);
    refreshCategoryCreateSelector();
    refreshCategorySearchSelector();
    refreshCategoryManager();
  } catch (e) {
    return e;
  }
}

async function deleteRequestForCategory(endPoint, parent) {
  const settings = {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    },
  };
  try {
    const fetchResponse = await fetch(
      `http://localhost:8080${endPoint}`,
      settings
    );
    getAllCategories("/categories");
    parent.remove();
    refreshCategoryCreateSelector();
    refreshCategorySearchSelector();
  } catch (e) {
    return e;
  }
}
