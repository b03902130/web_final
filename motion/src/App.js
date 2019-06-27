import Webcam from "react-webcam";
import React, { Component } from "react";

class App extends Component {
  setRef = webcam => {
    this.webcam = webcam;
  };
  state = {
    imageSrc: "",
    imageData: [],
    diff: []
  };

  capture = () => {
    const imageSrcc = this.webcam.getScreenshot();
    const canvas = this.webcam.getCanvas();
    if (canvas != null) {
      let ctx = canvas.getContext("2d");
      let imageDatac = ctx.getImageData(0, 0, 350, 350).data;
      let diff = ctx.getImageData(0, 0, 350, 350).data;
      for (var i = 0; i < diff.length; i++) {
        diff[i] = 255 - Math.abs(diff[i] - this.state.imageData[i]);
      }
      var iData = new ImageData(diff, 350, 350);
      const c = document.createElement("canvas");
      let t = c.getContext("2d");
      t.putImageData(iData, 0, 0);
      this.setState({
        imageData: imageDatac,
        imageSrc: c.toDataURL()
      });
    }
  };
  componentDidMount() {
    this.interval = setInterval(() => this.capture(), 10);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  test = () => {
    return <img src={this.state.imageSrc} width={100} />;
  };
  render() {
    const videoConstraints = {
      width: 1280,
      height: 720,
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
        {/* {this.run} */}
        <button onClick={this.run}>Capture photo</button>
        {this.test()}
      </div>
    );
  }
}

export default App;
