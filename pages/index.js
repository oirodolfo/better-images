// import React from 'react';
import React, {useState, useEffect} from 'react';
import Head from 'next/head';

const theGuardianPicture = [
    {
        "media": "(min-width: 1300px) and (-webkit-min-device-pixel-ratio: 1.25), (min-width: 1300px) and (min-resolution: 120dpi)",
        "sizes": "1020px",
        "srcset": "2560.jpg?width=1020&quality=45&dpr=2 2040w"
    },
    {
        "media": "(min-width: 1300px)",
        "sizes": "1020px",
        "srcset": "2560.jpg?width=1020&quality=85 1020w"
    },
    {
        "media": "(min-width: 1140px) and (-webkit-min-device-pixel-ratio: 1.25), (min-width: 1140px) and (min-resolution: 120dpi)",
        "sizes": "940px",
        "srcset": "2560.jpg?width=940&quality=45&dpr=2 1880w"
    },
    {
        "media": "(min-width: 1140px)",
        "sizes": "940px",
        "srcset": "2560.jpg?width=940&quality=85 940w"
    },
    {
        "media": "(min-width: 980px) and (-webkit-min-device-pixel-ratio: 1.25), (min-width: 980px) and (min-resolution: 120dpi)",
        "sizes": "700px",
        "srcset": "2560.jpg?width=700&quality=45&dpr=2 1400w"
    },
    {
        "media": "(min-width: 980px)",
        "sizes": "700px",
        "srcset": "2560.jpg?width=700&quality=85 700w"
    },
    {
        "media": "(min-width: 740px) and (-webkit-min-device-pixel-ratio: 1.25), (min-width: 740px) and (min-resolution: 120dpi)",
        "sizes": "700px",
        "srcset": "2560.jpg?width=700&quality=45&dpr=2 1400w"
    },
    {
        "media": "(min-width: 740px)",
        "sizes": "700px",
        "srcset": "2560.jpg?width=700&quality=85 700w"
    },
    {
        "media": "(min-width: 660px) and (-webkit-min-device-pixel-ratio: 1.25), (min-width: 660px) and (min-resolution: 120dpi)",
        "sizes": "660px",
        "srcset": "2560.jpg?width=660&quality=45&dpr=2 1320w"
    },
    {
        "media": "(min-width: 660px)",
        "sizes": "660px",
        "srcset": "2560.jpg?width=660&quality=85 660w"
    },
    {
        "media": "(min-width: 480px) and (-webkit-min-device-pixel-ratio: 1.25), (min-width: 480px) and (min-resolution: 120dpi)",
        "sizes": "645px",
        "srcset": "2560.jpg?width=645&quality=45&dpr=2 1290w"
    },
    {
        "media": "(min-width: 480px)",
        "sizes": "645px",
        "srcset": "2560.jpg?width=645&quality=85 645w"
    },
    {
        "media": "(min-width: 0px) and (-webkit-min-device-pixel-ratio: 1.25), (min-width: 0px) and (min-resolution: 120dpi)",
        "sizes": "465px",
        "srcset": "2560.jpg?width=465&quality=45&dpr=2 930w"
    },
    {
        "media": "(min-width: 0px)",
        "sizes": "465px",
        "srcset": "2560.jpg?width=465&quality=85 465w"
    }
];


const image = require("./images/image.png");

function getSize() {

    return {
        innerHeight: window.innerHeight,
        innerWidth: window.innerWidth,
        outerHeight: window.outerHeight,
        outerWidth: window.outerWidth,
    };
}

function AppIndex() {
    let [windowSize, setWindowSize] = useState({
        innerHeight: 300,
        innerWidth: 300,
        outerHeight: 300,
        outerWidth: 300,
    });

    function handleResize() {
        setWindowSize(getSize());
    }

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    /**
     *
     the guardian

     <picture>
     <!--[if IE 9]><video style="display: none;"><![endif]-->
     <source media="(min-width: 1300px) and (-webkit-min-device-pixel-ratio: 1.25), (min-width: 1300px) and (min-resolution: 120dpi)" sizes="1020px" srcset="/2560.jpg?width=1020&quality=45&dpr=2&s=edb8a1a8ad8141fb20a9d33a63fc90d9 2040w">
     <source media="(min-width: 1300px)" sizes="1020px" srcset="/2560.jpg?width=1020&quality=85&s=b9901b36475f562cb301347d2dfe0140 1020w">
     <source media="(min-width: 1140px) and (-webkit-min-device-pixel-ratio: 1.25), (min-width: 1140px) and (min-resolution: 120dpi)" sizes="940px" srcset="/2560.jpg?width=940&quality=45&dpr=2 1880w">
     <source media="(min-width: 1140px)" sizes="940px" srcset="/2560.jpg?width=940&quality=85 940w">
     <source media="(min-width: 980px) and (-webkit-min-device-pixel-ratio: 1.25), (min-width: 980px) and (min-resolution: 120dpi)" sizes="700px" srcset="/2560.jpg?width=700&quality=45&dpr=2 1400w">
     <source media="(min-width: 980px)" sizes="700px" srcset="/2560.jpg?width=700&quality=85&s=59c4a28fcdc2a61b2edd8654f1a58e24 700w">
     <source media="(min-width: 740px) and (-webkit-min-device-pixel-ratio: 1.25), (min-width: 740px) and (min-resolution: 120dpi)" sizes="700px" srcset="/2560.jpg?width=700&quality=45&dpr=2 1400w">
     <source media="(min-width: 740px)" sizes="700px" srcset="/2560.jpg?width=700&quality=85&s=59c4a28fcdc2a61b2edd8654f1a58e24 700w">
     <source media="(min-width: 660px) and (-webkit-min-device-pixel-ratio: 1.25), (min-width: 660px) and (min-resolution: 120dpi)" sizes="660px" srcset="/2560.jpg?width=660&quality=45&dpr=2&s=cb5dd56b93f1d59ff3b0dfe98d4808e5 1320w">
     <source media="(min-width: 660px)" sizes="660px" srcset="/2560.jpg?width=660&quality=85&s=cc326911e45dfd7f7a1357726e4bc872 660w">
     <source media="(min-width: 480px) and (-webkit-min-device-pixel-ratio: 1.25), (min-width: 480px) and (min-resolution: 120dpi)" sizes="645px" srcset="/2560.jpg?width=645&quality=45&dpr=2&s=22620a28fd5428250d67409dcfffe1db 1290w">
     <source media="(min-width: 480px)" sizes="645px" srcset="/2560.jpg?width=645&quality=85&s=d55368b9df60328cbe2eb83dc615c0e7 645w">
     <source media="(min-width: 0px) and (-webkit-min-device-pixel-ratio: 1.25), (min-width: 0px) and (min-resolution: 120dpi)" sizes="465px" srcset="/2560.jpg?width=465&quality=45&dpr=2&s=e981bc8d94a0e02f71bdaa6e25399057 930w">
     <source media="(min-width: 0px)" sizes="465px" srcset="/2560.jpg?width=465&quality=85&s=71c3729664b79685f81a50c9399978b7 465w">
     <!--[if IE 9]></video><![endif]-->
     <img class="maxed responsive-img" itemprop="contentUrl" alt="Illustration by R Fresson" src="/2560.jpg?width=300&quality=85&s=16adbcba2ff979cb5a3cb3d962fd1ff8">
     </picture>

     * **/
    return (
        <div>
            <Head>
                <meta name="viewport" content="width=device-width"/>
            </Head>
            {`(max-width: ${windowSize.innerWidth}px) 100vw, (max-width: ${windowSize.innerWidth / 2}px) 50vw, 33vw}`}

            Hello World.

            <img
                    src={image}
                    srcSet={image.srcSet}
                />
            <hr />
            <hr />
            <hr />
            <hr />
            <hr />

            <img
                srcSet="https://res.cloudinary.com/oirodolfo/image/upload/w_300/v1552752977/image_muyoik.png 300w,
          https://res.cloudinary.com/oirodolfo/image/upload/w_700/v1552752977/image_muyoik.png 700w,
          https://res.cloudinary.com/oirodolfo/image/upload/w_1000/v1552752977/image_muyoik.png 1000w,
          https://res.cloudinary.com/oirodolfo/image/upload/w_1600/v1552752977/image_muyoik.png 1600w"
                // sizes="(max-width: 700px) 100vw, (max-width: 900px) 50vw, 33vw"
                // sizes="(max-width: 1600px) 100vw, (max-width: 900px) 50vw, 33vw"
                // sizes={`${windowSize.innerWidth}px`}
                // sizes={`(min-width: ${windowSize.innerWidth}px) 100vw, (min-width: ${windowSize.innerWidth / 2}px) 50vw, 33vw}`}
                sizes={`(max-width: 480px) 100vw, (max-width: 900px) 33vw, 254px`}
                // src="https://res.cloudinary.com/oirodolfo/image/upload/w_1600/v1552752977/image_muyoik.png 1600w"
                src="https://res.cloudinary.com/oirodolfo/image/upload/v1552752977/image_muyoik.png"
                alt="PS4 Slim"
            />
        </div>
    );
};

export default AppIndex;
