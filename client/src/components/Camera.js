import React, { Component } from "react";
import Webcam from "react-webcam";
import {Paper} from "@material-ui/core"

class Camera extends Component {
    constructor(props) {
        super(props)
        this.state = {
            imageSrc: "",
            imageData: [],
            diffPixels: 0,
        };
    }

    setRef = webcam => {
        this.webcam = webcam;
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
                this.props.updateX(this.state.diffPixels),
            );
        }
    };

    componentDidMount() {
        this.interval = setInterval(() => this.capture(), 10);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        const videoConstraints = {
            facingMode: "user"
        };
        return (
            <Paper style={{padding: "25px", width: "350px", height: "470px", margin: "15px"}}>
                { this.state.imageSrc && 
                    <img
                        style={{
                            width: "300px",
                            display: "block",
                            border: "solid gray 1px",
                            borderRadius: "5px",
                        }}
                        src={this.state.imageSrc}
                        alt="loading..."
                    />
                }
                <Webcam
                    audio={false}
                    height={300}
                    ref={this.setRef}
                    screenshotFormat="image/jpeg"
                    width={300}
                    videoConstraints={videoConstraints}
                />
            </Paper>
        );
    }
}

export default Camera;

