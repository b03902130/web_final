import Webcam from "react-webcam";
import Runner from "./Runner";
import React, { Component } from "react";

class App extends Component {
  setRef = webcam => {
    this.webcam = webcam;
  };

  state = {
    imageSrc: "",
    imageData: [],
    diffPixels: 0,
    notEND: true,
    x: 0
  };
  getRandomizer = (bottom, top) => {
    return Math.floor(Math.random() * (1 + top - bottom)) + bottom;
  };
  capture = () => {
    const canvas = this.webcam.getCanvas();
    if (canvas != null) {
      let ctx = canvas.getContext("2d");
      let imageDatac = ctx.getImageData(0, 0, 350, 350).data;
      let diff = ctx.getImageData(0, 0, 350, 350).data;
      let count = 0;
      for (var i = 0; i < diff.length; i++) {
        let n = Math.abs(diff[i] - this.state.imageData[i]);
        diff[i] = 255 - n;
        if (diff[i] < 150) count++;
      }
      let iData = new ImageData(diff, 350, 350);
      const diffCanvas = document.createElement("canvas");
      let diffConrtext = diffCanvas.getContext("2d");
      diffConrtext.putImageData(iData, 0, 0);
      this.setState(
        {
          imageData: imageDatac,
          imageSrc: diffCanvas.toDataURL(),
          diffPixels: count
        },
        this.updateX(),
        this.test()
      );
    }
  };
  test = () => {
    if (this.state.x >= 1500 && this.state.notEND) {
      this.setState({ notEND: false }, alert("END"));
    }
  };
  componentDidMount() {
    this.interval = setInterval(() => this.capture(), 100);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  renderMotion = () => {
    return <img src={this.state.imageSrc} alt="loading..." />;
  };

  updateX = () => {
    console.log("num : ", Math.round(this.state.diffPixels / 2000));
    if (
      this.state.diffPixels &&
      this.state.x < 1500 &&
      Math.round(this.state.diffPixels / 2000) < 10
    ) {
      this.setState({
        x: this.state.x + Math.round(this.state.diffPixels / 1000)
      });
    }
  };

  render() {
    const videoConstraints = {
      facingMode: "user"
    };
    return (
      <div>
        <Webcam
          audio={false}
          height={350}
          ref={this.setRef}
          screenshotFormat="image/jpeg"
          width={350}
          videoConstraints={videoConstraints}
        />
        {this.renderMotion()}
        <Runner updateX={this.state.x} ID={this.state.selectImg} />
      </div>
    );
  }
}
export default App;

