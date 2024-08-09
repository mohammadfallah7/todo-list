let storage = localStorage.getItem("tasks");
let tasks = storage ? JSON.parse(storage) : [];

document.querySelector("#app").innerHTML = `
  <div class="container mx-auto p-6 sm:p-0 sm:pt-6">
    <h1 class="text-2xl mb-5">Todo Application</h1>
    <div class="flex gap-8 justify-between items-center">
      <input id="input-task" type="text" placeholder="Your task here ..." class="input input-bordered w-full" />
      <button id="submit-btn" class="btn btn-primary">Submit</button>
    </div>
    <h2 id="error" class="font-bold text-lg mt-8"></h2>
    <ul id="task-list" class="mt-8"></ul>
  </div>
`;

const inputTask = document.querySelector("#input-task");
const submitBtn = document.querySelector("#submit-btn");
const errorEl = document.querySelector("#error");
const taskList = document.querySelector("#task-list");

function render() {
  taskList.innerHTML = tasks
    .map((task) => {
      return task.isCompleted
        ? `
    <li class="bg-base-200 rounded-md mb-4 flex items-center justify-between px-5">
      <div class="flex items-center gap-3">
        <input data-id="${task.id}" class="checkbox checkbox-sm" type="checkbox" checked />
        <p class="whitespace-nowrap overflow-hidden text-ellipsis py-5 line-through">${task.title}</p>
      </div>
      <button data-id="${task.id}" class="btn btn-error btn-sm">delete</button>
    </li>
    `
        : `
    <li class="bg-base-200 rounded-md mb-4 flex items-center justify-between px-5">
      <div class="flex items-center gap-3">
        <input data-id="${task.id}" class="checkbox checkbox-sm" type="checkbox" />
        <p class="whitespace-nowrap overflow-hidden text-ellipsis py-5">${task.title}</p>
      </div>
      <button data-id="${task.id}" class="btn btn-error btn-sm">delete</button>
    </li>
    `;
    })
    .join("");

  localStorage.setItem("tasks", JSON.stringify(tasks));

  const deleteButtons = document.querySelectorAll("#task-list > li > button");
  deleteButtons.forEach((deleteButton) => {
    deleteButton.addEventListener("click", (event) => {
      const id = event.target.dataset.id;

      deleteTask(id);
    });
  });

  const checkboxes = document.querySelectorAll("input[type='checkbox']");
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {
      const id = event.target.dataset.id;

      doneTask(id);
    });
  });
}

render();

function createTask() {
  const taskTitle = inputTask.value;
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

submitBtn.addEventListener("click", () => {
  try {
    createTask();
    errorEl.textContent = "";
  } catch (error) {
    errorEl.textContent = error.message;
  }
});
