let storage = localStorage.getItem("tasks");
let tasks = storage ? JSON.parse(storage) : [];

document.querySelector("#app").innerHTML = `
  <div class="container mx-auto p-6 sm:p-0 sm:pt-6">
    <h1 class="text-2xl mb-5">Todo Application</h1>
    <div class="flex gap-8 justify-between items-center">
      <input id="input-task" type="text" placeholder="Your task here ..." class="input input-bordered w-full" />
      <button id="submit-btn" class="btn btn-primary">Submit</button>
    </div>
    <p id="task-count" class="mt-3 text-xs"></p>
    <div id="error-container" role="alert" class="alert alert-warning transition-all hidden mt-6">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span id="error-message"></span>
    </div>
    <ul id="task-list" class="mt-8"></ul>
  </div>
`;

const inputTask = document.querySelector("#input-task");
const submitBtn = document.querySelector("#submit-btn");
const taskCount = document.querySelector("#task-count");
const errorContainer = document.querySelector("#error-container");
const errorMessage = document.querySelector("#error-message");
const taskList = document.querySelector("#task-list");

document.addEventListener("DOMContentLoaded", () => {
  render();
});

taskList.addEventListener("click", (event) => {
  if (event.target instanceof HTMLButtonElement) {
    const id = event.target.parentNode.dataset.id;
    deleteTask(id);
  } else if (event.target instanceof HTMLInputElement) {
    const id = event.target.closest("li").dataset.id;
    doneTask(id);
  }
});

submitBtn.addEventListener("click", () => {
  try {
    createTask();

    if (!errorContainer.classList.contains("hidden"))
      errorContainer.classList.add("hidden");
  } catch (error) {
    errorContainer.classList.remove("hidden");
    errorMessage.textContent = error.message;
  }
});

/// Task Functions
function render() {
  taskCount.textContent =
    tasks.length === 0
      ? "You have no task yet!"
      : `You have ${tasks.length} task(s) to do!`;

  taskList.innerHTML = tasks
    .map((task) => {
      return task.isCompleted
        ? `
    <li data-id="${task.id}" class="bg-base-200 rounded-md mb-4 flex items-center justify-between px-5">
      <div class="flex items-center gap-3">
        <input class="checkbox checkbox-sm" type="checkbox" checked />
        <p class="whitespace-nowrap overflow-hidden text-ellipsis py-5 line-through">${task.title}</p>
      </div>
      <button class="btn btn-error btn-sm">delete</button>
    </li>
    `
        : `
    <li data-id="${task.id}" class="bg-base-200 rounded-md mb-4 flex items-center justify-between px-5">
      <div class="flex items-center gap-3">
        <input class="checkbox checkbox-sm" type="checkbox" />
        <p class="whitespace-nowrap overflow-hidden text-ellipsis py-5">${task.title}</p>
      </div>
      <button class="btn btn-error btn-sm">delete</button>
    </li>
    `;
    })
    .join("");

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function createTask() {
  const taskTitle = inputTask.value.trim();
  if (!taskTitle) throw new Error("Task title is required");
  if (taskTitle.length < 3)
    throw new Error("Task title should be at least 3 characters");
  if (taskTitle.length > 50)
    throw new Error("Task title should be less than 50 characters");

  tasks.unshift({
    id: new Date().toISOString(),
    title: taskTitle,
    isCompleted: false,
  });
  inputTask.value = "";
  render();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  render();
}

function doneTask(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
  );
  render();
}
