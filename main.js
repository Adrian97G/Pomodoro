let tasks = [];
let time = 30 * 60; // Cambiado a 30 minutos
let timer = null;
let timerBreak = null;
let current = null;
let statusApp = "stop";

const bAdd = document.querySelector("#bAdd");
const itTask = document.querySelector("#itTask");
const form = document.querySelector("#form");
const bReset = document.querySelector("#bReset");

renderTasks();
renderTime();

form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (itTask.value !== "") {
        createTask(itTask.value);
        itTask.value = "";
        renderTasks();
    }
});

function createTask(value) {
    const newTask = {
        id: (Math.random() * 100).toString(36).slice(2),
        title: value,
        completed: false,
    };

    tasks.unshift(newTask);
}

function renderTasks() {
    const html = tasks.map((task) => {
        return `
            <div class="task">
                <div class="completed">${
                    task.completed
                        ? "<span class='done'>Done</span>"
                        : `<button class="start-button" data-id="${task.id}">Start</button></div>`
                }
                <div class="title">${task.title}</div>
            </div>`;
    });
    const tasksContainer = document.querySelector("#tasks");
    tasksContainer.innerHTML = html.join("");

    const startButtons = document.querySelectorAll(".task .start-button");
    startButtons.forEach((startButton) => {
        startButton.addEventListener("click", () => {
            if (!timer) {
                startButtonHandler(startButton.getAttribute("data-id"));
                startButton.textContent = "In progress...";
            }
        });
    });
}

function startButtonHandler(id) {
    time = 30 * 60; // Reiniciar el tiempo a 30 minutos
    current = id;
    const taskId = tasks.findIndex((task) => task.id === id);
    document.querySelector("#time #taskName").textContent = tasks[taskId].title;
    timer = setInterval(() => {
        timerHandler(id);
    }, 1000);
}

function timerHandler(id = null) {
    time--;
    renderTime();
    if (time === 0) {
        markComplete(id);
        clearInterval(timer);
        renderTasks();
        startBreak();
    }
}

function markComplete(id) {
    const taskId = tasks.findIndex((task) => task.id === id);
    tasks[taskId].completed = true;
}

function startBreak() {
    time = 1 * 60;
    document.querySelector("#time #taskName").textContent = "Break";
    timerBreak = setInterval(timerBreakHandler, 1000);
}

function timerBreakHandler() {
    time--;
    renderTime();
    if (time === 0) {
        clearInterval(timerBreak);
        current = null;
        document.querySelector("#time #taskName").textContent = "";
        renderTime();
    }
}

function renderTime() {
    const timeDiv = document.querySelector("#time #value");
    const minutes = parseInt(time / 60);
    const seconds = parseInt(time % 60);
    timeDiv.textContent = `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

bAdd.addEventListener("click", () => {
    if (statusApp === "stop") {
        // Iniciar el Pomodoro
        if (itTask.value !== "") {
            createTask(itTask.value);
            itTask.value = "";
            renderTasks();
            startButtonHandler(current);
            statusApp = "start";
            bAdd.setAttribute("disabled", true); // Deshabilitar el botón de agregar
        }
    } else {
        // Detener el Pomodoro
        clearInterval(timer);
        clearInterval(timerBreak);
        current = null;
        statusApp = "stop";
        document.querySelector("#time #taskName").textContent = "";
        renderTime();
        bAdd.removeAttribute("disabled"); // Habilitar el botón de agregar
    }
});

bReset.addEventListener("click", () => {
    resetPomodoro();
    location.reload(); // Recargar la página
});

function resetPomodoro() {
    clearInterval(timer);
    clearInterval(timerBreak);
    time = 0;
    current = null;
    statusApp = "stop";
    document.querySelector("#time #taskName").textContent = "";
    renderTime();
    clearCompletedTasks();

    // Habilitar el botón de agregar
    bAdd.removeAttribute("disabled");
}

function clearCompletedTasks() {
    tasks = tasks.filter((task) => !task.completed);
    renderTasks();
}
