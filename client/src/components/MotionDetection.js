import Webcam from "react-webcam";
import React, { Component } from "react";
import { Animate } from "react-rebound";

class MotionDetection extends Component {
    constructor(props) {
        super(props)
        this.state = {
            imageSrc: "",
            imageData: [],
            diffPixels: 0,
            notEND: true,
            x: 0
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
                this.updateX(),
                this.test()
            );
        }
    };
    test = () => {
        if (this.state.x >= this.props.endpoint && this.state.notEND) {
            this.setState({ notEND: false }, alert("END"));
        }
    };
    componentDidMount() {
        this.interval = setInterval(() => this.capture(), 10);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    updateX = () => {
        let pixel = Math.round(this.state.diffPixels / 1000)
        pixel = pixel <= this.props.threshold ? pixel : this.props.threshold
        if (
            this.state.diffPixels &&
            this.state.x < this.props.endpoint
        ) {
            this.setState({
                x: this.state.x + pixel
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
                { this.state.imageSrc && <img style={{display: "block"}} src={this.state.imageSrc} alt="loading..." /> }
                <section>
                    <Animate translateX={this.state.x} friction={80}>
                        <img style={{width: "100px"}} src={"gifs/" + "6" + ".gif"} alt="loading..." />
                    </Animate>
                </section>
            </div>
        );
    }
}
export default MotionDetection;

