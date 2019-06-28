import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

ReactDOM.render(<App
    endpoint={1000}
    threshold={10}
/>, document.getElementById("root"));
