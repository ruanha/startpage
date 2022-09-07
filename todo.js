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
  const todoList = todoApi.getTodoList();
  const item =
    document.getElementsByClassName("todo-input")[todoList.length - 1];
  item.focus();

  // Move the cursor to the end
  const length = item.value.length;
  item.setSelectionRange(length, length);
};

const check = (event) => {
  const index = event.target.getAttribute("data-index");
  const value = event.target.value;
  const checked = event.target.checked;

  todoApi.updateTodoItem(index, { checked: checked, text: value });
};

const handleKeyPress = (event) => {
  if (event.key === "Enter") {
    const index = event.target.getAttribute("data-index");
    const value = event.target.value;

    const checkbox = document.querySelector(`input[data-index="${index}"]`);

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
  const todoList = JSON.parse(localStorage.getItem("todoList")) || [];
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
