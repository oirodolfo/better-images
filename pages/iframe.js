import React from 'react';

const image = require("./images/image.png");
const skyLogo = require("./images/sky-logo.png");
const ceu = require("./images/sky.jpeg");

export default function Iframe(props) {
    return <div style={{width: '100vw', height: '100vh'}}>
        <h3>{props.width}w - {props.height}h</h3>
        <img
            src={image}
            srcSet={image.srcSet}
        />
        <hr/>
        Sky-logo png
        <img
            src={skyLogo}
            srcSet={skyLogo.srcSet}
        />
        <hr/>

        Ceu
        <img
            src={ceu}
            srcSet={ceu.srcSet}
        />
    </div>
}
