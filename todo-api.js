class TodoApi {
  constructor() {
    this.todos = this.initTodoList();
  }

  updateTodoItem = (index, value) => {
    const todoList = this.getTodoList();
    todoList[index] = value;
    localStorage.setItem("todoList", JSON.stringify(todoList));
  };

  createTodoItem = (value) => {
    const todoList = this.getTodoList();
    todoList.push(value);
    localStorage.setItem("todoList", JSON.stringify(todoList));
  };

  deleteTodoItem = (index) => {
    const todoList = this.getTodoList();
    todoList.splice(index, 1);
    localStorage.setItem("todoList", JSON.stringify(todoList));
  };

  getTodoList = () => {
    return this.todos;
  };

  initTodoList = () => JSON.parse(localStorage.getItem("todoList")) || [];
}

const todoApi = new TodoApi();

export default todoApi;
