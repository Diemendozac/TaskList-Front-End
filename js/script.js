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
  endDateTag = document.getElementById("end-date-field");

const createUrl = "http://localhost:8080/",
  target = "/tasks";

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

const notes = JSON.parse(localStorage.getItem("notes") || "[]");
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
                            <p>${note.title}</p>
                            <span>${filterDesc}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${note.dueDate}</span>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="menu">
                                    <li onclick="updateNote(${id}, '${note.title}', '${filterDesc}')"><i class="uil uil-pen"></i>Edit</li>
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
  /*if(repeatOn === null && intervals === null) {
    console.log("Hola mundo");
  }*/
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
  /*document.querySelector("body").style.overflow = "auto";*/
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

function postRequest(jsonData, endPoint) {
  fetch(endPoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: jsonData,
  }).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Error en la petición POST");
    }
  });
  /*.then(data => {
    return data;
  })
  .catch(error => {
    console.error('Error:', error);
    return null;
  });*/
}

function getRequest (url, endPoint) {
  fetch(`${url}${endPoint}`)
  .then(function (data) {
    console.log('the data', data);
  })
}
