import React, { Component } from "react";
import TodoForm from "./TodoForm";
import Todo from "./Todo";

class TodoList extends Component {
  state = {
    todos: [],
    currMode: "all",
    showMode: ["all", "active", "complete"]
  };

  addTodo = newTodo => {
    if (newTodo.text !== "") {
      this.setState({
        todos: [newTodo, ...this.state.todos]
      });
    }
  };

  toggleComplete = id => {
    this.setState({
      todos: this.state.todos.map(todo => {
        if (todo.id === id) {
          return {
            ...todo,
            complete: !todo.complete
          };
        } else {
          return todo;
        }
      })
    });
  };

  toggleTodoTab = currMode => {
    this.setState({ currMode });
  };

  handleDeleteTodo = id => {
    this.setState({
      todos: this.state.todos.filter(todo => todo.id !== id)
    });
  };

  removeComplete = () => {
    this.setState({
      todos: this.state.todos.filter(todo => !todo.complete)
    });
  };

  renderTodos = todos => {
    return todos.map(todo => (
      <Todo
        key={todo.id}
        toggleComplete={() => this.toggleComplete(todo.id)}
        onDelete={() => this.handleDeleteTodo(todo.id)}
        todo={todo}
      />
    ));
  };

  rendershowMode = currMode => {
    return this.state.showMode.map(tab => {
      return (
        <button
          key={tab}
          className={tab === currMode ? "button selected" : "button"}
          onClick={() => this.toggleTodoTab(tab)}
        >
          {tab}
        </button>
      );
    });
  };

  render() {
    let showTodos = [];

    if (this.state.currMode === "all") {
      showTodos = this.state.todos;
    } else if (this.state.currMode === "active") {
      showTodos = this.state.todos.filter(todo => !todo.complete);
    } else if (this.state.currMode === "complete") {
      showTodos = this.state.todos.filter(todo => todo.complete);
    }

    return (
      <div>
        <TodoForm onSubmit={this.addTodo} />
        <ul className="todo-app__list">{this.renderTodos(showTodos)}</ul>

        <footer className="todo-app__footer" id="todo-footer">
          <div className="todo-app__total">
            todos left: {this.state.todos.filter(todo => !todo.complete).length}
          </div>

          <ul className="todo-app__view-buttons">
            {this.rendershowMode(this.state.currMode)}
          </ul>

          <ul className="todo-app__clean">
            {this.state.todos.some(todo => todo.complete) ? (
              <button className="button clear" onClick={this.removeComplete}>
                remove completed
              </button>
            ) : null}
          </ul>
        </footer>
      </div>
    );
  }
}

export default TodoList;
