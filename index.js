const form = document.querySelector(".task-form");
const titleInput = form.querySelector("#task-title-input");
const infoInput = form.querySelector("#task-info-input");
const list = document.querySelector(".task-list");

const alerter = document.querySelector("header");
const alertText = document.querySelector("header h3");

const submitBtn = form.querySelector("#submit-btn");
const clearBtn = form.querySelector(".clear-btn");

let isEditing = false;
let editId;

/* setting up event listners */
form.addEventListener("submit", addTask);
window.addEventListener("DOMContentLoaded", () => {
    let items = getTaskList();
    if(items.length > 0) {
        items.forEach((i) => {
            createNewTask(i.id, i.title, i.info);
        });
    }
});

clearBtn.addEventListener("click", () => {
    list.innerHTML = "";
    localStorage.removeItem("list");
    displayAlert("All tasks cleared!", "danger");
});

/* functions */
function addTask(e) {
    e.preventDefault();
    const title = titleInput.value;
    const info = infoInput.value;
    const id = new Date().getTime().toString();

    if (title && !isEditing) {
        createNewTask(id, title, info);

        let items = getTaskList();
        items.push({id, title, info});
        localStorage.setItem("list", JSON.stringify(items));
        displayAlert("task Added!");
    }
    else if (title && isEditing) {
        editTask(editId, title, info);
        displayAlert("task changed successfully!", "success");
    }
    else {
        displayAlert("title cannot be empty", "danger");
    }
}

function createNewTask(id, title, info) {


    const task = document.createElement("article");
    task.classList.add("task");
    task.dataset.id = id;
    task.innerHTML = `<h3 class="task-title">${title}</h3>
    <p class="task-info">${info}</p>
    <div class="btn-container">
        <button class="edit-btn btn">
            <i class="fas fa-edit"></i>
        </button>
        <button class="delete-btn btn">
            <i class="fas fa-trash"></i>
        </button>
    </div>`;
    list.appendChild(task);

    const editBtn = task.querySelector(".edit-btn");
    const deleteBtn = task.querySelector(".delete-btn");

    editBtn.addEventListener("click", () => {
        isEditing = true;
        editId = id;

        let items = getTaskList();
        items.forEach((i) => {
            if(i.id === editId) {
                titleInput.value = i.title;
                infoInput.value = i.info;
            }
        })
        submitBtn.innerHTML = "Edit";
    });

    deleteBtn.addEventListener("click", () => {
        list.removeChild(task);
        let items = getTaskList();
        items = items.filter((item) => {
            return item.id !== id;
        });

        localStorage.setItem("list", JSON.stringify(items));
        displayAlert("task Deleted", "danger");
    });

    reset();
}

function editTask(editId, title, info) {
    const tasks = list.querySelectorAll(".task");
    tasks.forEach((task) => {
        if(task.dataset.id == editId) {
            const t = task.querySelector(".task-title");
            const i = task.querySelector(".task-info");
    
            t.innerHTML = title;
            i.innerHTML = info;
        }
    });

    let items = getTaskList();
    items = items.map((i) => {
        if(i.id === editId) {
            i.title = title;
            i.info = info;
        }
        return i;
    })

    localStorage.setItem("list", JSON.stringify(items));
    reset();
}

function reset() {
    isEditing = false;
    editId = "";

    titleInput.value = "";
    infoInput.value = "";
    submitBtn.innerHTML = "Add";
}

function getTaskList() {
    return localStorage.getItem("list") ? JSON.parse(localStorage.getItem("list")) : [];
}


function displayAlert(message, type) {
    alerter.classList.add(`${type}`);
    alertText.textContent = message;

    //rest

    setTimeout(() => {
        alerter.classList.remove(type);
        alertText.textContent = "";
    }, 1000);
}
