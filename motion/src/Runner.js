import React, { Component } from "react";
import { Animate } from "react-rebound";
// import s from "./gifDB/giphy2.webp";

class Runner extends Component {
  state = { x: 0 };
  update = () => {
    this.setState({
      x: this.props.updateX,
      ID: this.props.ID
    });
    return this.state.x;
  };

  getPlace = () => {
    return this.state.x;
  };

  componentDidMount() {
    this.interval = setInterval(() => this.update(), 1);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  render() {
    return (
      <section>
        <Animate translateX={this.state.x} friction={80}>
          <img style={{width: "100px"}} src={"gifs/" + "6" + ".gif"} alt="loading..." />
        </Animate>
      </section>
    );
  }
}

export default Runner;

