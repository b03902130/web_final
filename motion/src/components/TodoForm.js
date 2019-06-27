import React, { Component } from "react";

class TodoForm extends Component {
  state = {
    text: "",
    id: 0
  };

  handleInput = e => {
    this.setState({
      text: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.onSubmit({
      id: this.state.id,
      text: this.state.text,
      complete: false
    });
    this.setState({
      text: "",
      id: this.state.id + 1
    });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          className="todo-app__input"
          placeholder="What needs to be done?"
          name="text"
          value={this.state.text}
          onChange={this.handleInput}
        />
      </form>
    );
  }
}

export default TodoForm;
