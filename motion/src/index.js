import React from "react";
import ReactDOM from "react-dom";
import MotionDetection from "./MotionDetection";

ReactDOM.render(
    <MotionDetection
        endpoint={1000}
        threshold={10}
    />,
document.getElementById("root"));
