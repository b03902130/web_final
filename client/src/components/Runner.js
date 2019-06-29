import React, { Component } from "react";
import { Animate } from "react-rebound";

function Runner(props) {
    return (
        <section>
            <Animate translateX={props.x} friction={80}>
                <img style={{width: "100px"}} src={`${window.env.backend}/gifs/6.gif`} alt="loading..." />
            </Animate>
        </section>
    )
}

export default Runner;


