import React, {useEffect, useState} from 'react';

const image = require("./images/image.png");
const skyLogo = require("./images/sky-logo.png");
const ceu = require("./images/sky.jpeg");


function getSize() {
    return {
        innerHeight: window.innerHeight,
        innerWidth: window.innerWidth,
        outerHeight: window.outerHeight,
        outerWidth: window.outerWidth,
    };
}

export default function Iframe(props) {


    let [windowSize, setWindowSize] = useState(getSize());

    function handleResize() {
        setWindowSize(getSize());
    }

    useEffect(() => {
        ['load', 'resize'].forEach(event =>
            window.addEventListener(event, handleResize));

        return () => {
            ['load', 'resize'].forEach(event =>
                window.removeEventListener(event, handleResize));
        };
    }, []);

    return <>
        <style>

            {`
             pre {
                font-size: 12px;
            }
            `}
        </style>
        <div style={{width: '100vw', height: '100vh'}}>
        <pre>{
            JSON.stringify(windowSize, null, 4)
        }</pre>
        <hr/>
        <img
            src={image.placeholder}
            data-src={image}
            srcSet={image.srcSet}
            width={image.width}
            height={image.height}
        />
        <hr/>
        Sky-logo png
        <img
            src={skyLogo}
            srcSet={skyLogo.srcSet}
            width={skyLogo.width}
            height={skyLogo.height}
        />
        <hr/>

        Ceu
        <img
            src={ceu}
            srcSet={ceu.srcSet}
            width={ceu.width}
            height={skyLogo.height}
        />
    </div>
        </>
}
