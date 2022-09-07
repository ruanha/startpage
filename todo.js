import todoApi from "./todo-api.js";

const initTodo = () => {
  const todoList = todoApi.getTodoList();
  if (todoList.length === 0) {
    todoApi.createTodoItem({ checked: false, text: "" });
    renderTodoList();
    focusOnLastItem();
  }
};

const focusOnLastItem = () => {
  const item =
    document.querySelectorAll("input")[
      document.querySelectorAll("input").length - 1
    ];
  item.focus();

  // Move the cursor to the end
  const length = item.value.length;
  item.setSelectionRange(length, length);
};

const check = (event) => {
  const index = event.target.getAttribute("data-index");
  const input = document.querySelector(`[data-index="${index}"][type="text"]`);

  todoApi.updateTodoItem(index, {
    checked: event.target.checked,
    text: input.value,
  });
};

const handleKeyPress = (event) => {
  if (event.key === "Enter") {
    updateTodoItemFromElement(event.target);
    const todoList = todoApi.getTodoList();
    if (todoList[todoList.length - 1].text !== "") {
      todoApi.createTodoItem({ checked: false, text: "" });
    }
    renderTodoList();
    focusOnLastItem();
  }

  if (event.key === "Backspace" && event.target.value === "") {
    event.preventDefault();
    const index = event.target.getAttribute("data-index");
    todoApi.deleteTodoItem(index);
    renderTodoList();
    focusOnLastItem();
  }

  if ((event.key === "ArrowDown" || event.key === "ArrowUp") && event.altKey) {
    const direction = event.key === "ArrowDown" ? 1 : -1;
    event.preventDefault();
    const index = event.target.getAttribute("data-index");
    const todoList = todoApi.getTodoList();
    if (index < todoList.length - 1) {
      const nextIndex = parseInt(index) + direction;
      todoApi.switch(index, nextIndex);
      renderTodoList();
      const nextElement = document.querySelector(
        `[data-index="${nextIndex}"][type="text"]`
      );
      nextElement.focus();
    }
  }
};

const createTodoElement = (item, index) => {
  const todoItemTemp = document.getElementById("todo-item-template");

  /* input */
  const input = todoItemTemp.content.querySelector(".todo-input");

  input.dataset.index = index;
  input.value = item.text;

  /* checkbox */
  const checkbox = todoItemTemp.content.querySelector("input[type=checkbox]");

  checkbox.dataset.index = index;
  checkbox.checked = item.checked;

  return todoItemTemp.content.querySelector("div").cloneNode(true);
};

const updateTodoItemFromElement = (element) => {
  const index = element.getAttribute("data-index");
  const checkbox = document.querySelector(`input[data-index="${index}"]`);

  todoApi.updateTodoItem(index, {
    checked: checkbox.checked,
    text: element.value,
  });
};

const renderTodoList = () => {
  const todoList = todoApi.getTodoList();
  document.getElementById("todo-list").innerHTML = "";
  todoList.forEach((item, index) => {
    const todoItem = createTodoElement(item, index);
    document.getElementById("todo-list").appendChild(todoItem);
  });
  addEventListeners();
};

const addEventListeners = () => {
  document.getElementById("todo-fieldset").addEventListener("click", initTodo);

  document.querySelectorAll("input[type=checkbox]").forEach((item) => {
    item.addEventListener("change", check);
  });

  document.querySelectorAll(".todo-input").forEach((item) => {
    item.addEventListener("keydown", handleKeyPress);
  });

  document.querySelectorAll(".todo-input").forEach((item) => {
    item.addEventListener("blur", (event) => {
      updateTodoItemFromElement(event.target);
    });
  });
};

renderTodoList();
