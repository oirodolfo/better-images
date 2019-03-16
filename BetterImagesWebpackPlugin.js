const sharp = require('sharp');
const path = require('path');
const fs = require('fs-extra');
const debug = require('debug')('BETTER-IMAGES');
const filesize = require("filesize");


var sharpDefaultConfig = {
    crop: false,
    embed: false,
    min: false,
    max: false,
    withoutEnlargement: true,
    skipOnEnlargement: false,
    ignoreAspectRatio: false,
    interpolator: 'bicubic',
    kernel: 'lanczos3',
    extractBeforeResize: false,
    extractAfterResize: false,
    background: '#fff',
    flatten: false,
    negate: false,
    rotate: false,
    flip: false,
    flop: false,
    blur: false,
    sharpen: false,
    threshold: false,
    gamma: false,
    grayscale: false,
    normalize: false,
    quality: 10,
    progressive: false,
    withMetadata: false,
    tile: false,
    withoutChromaSubsampling: false,
    compressionLevel: 6,
    format: null
};

const filesEmitted = [];

const emitFile = async (filePath, filename, imageData) => {
    try {
        await fs.outputFile(`${filePath}/${filename}`, imageData);
        filesEmitted.push(filename);
        return filesEmitted;
    } catch (err) {
        console.error(err);
        throw new Error(err);
        return;
    }
};


const MIMES = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'webp': 'image/webp',
};


const EXTS = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp'
};

const calculateSize = (neededSize, originalSize) => {
    if (neededSize === undefined || neededSize === null) {
        return null
    } else if (typeof neededSize === 'string' && neededSize.indexOf('%') > -1) {
        const percentage = parseFloat(neededSize);

        if (isNaN(percentage)) {
            throw new Error(`Wrong percentage size "${neededSize}"`)
        }

        return Math.round(originalSize * percentage * 0.01)
    } else {
        neededSize = parseInt(neededSize);

        if (isNaN(neededSize)) {
            throw new Error(`Wrong size "${neededSize}"`)
        }

        return neededSize
    }
};


const resizeImageSharp = (imagePath) => {
    return {
        resize: ({width, mime, inputFileName, filePath, options}) => {
            const image = sharp(imagePath);
            const outputFileName = `--${inputFileName}@${width}w.${EXTS[mime]}`;

            return new Promise((resolve, reject) => {
                let resized = image
                    .png({
                        // quality: 85,
                        // compressionLevel: 7,
                        ...sharpDefaultConfig,
                        // progressive: true,
                    }).resize(width, null);

                resized.toFile(`--${outputFileName}`).then(info => {
                        // console.log(info);
                        // debug(`${info.width}: %o, %s difference`, filesize(info.size, {base: 10}), filesize(image.size, {base: 10}));


                        return resolve({
                            info,
                            // data,
                            width,
                            // height,
                            mime,
                            filePath,
                            inputFileName
                        })
                    }
                ).catch((err) => {
                    if (err) {
                        return reject(err)
                    } else {

                    }
                });

                // resized.toBuffer((err, data, {height}) => {
                //     if (err) {
                //         console.log('rejected', err);
                //
                //         reject(err);
                //     } else {
                //         console.log('resolved', width, height);
                //         resolve({
                //             data,
                //             width,
                //             height,
                //             mime,
                //             filePath,
                //             inputFileName
                //         });
                //     }
                // });
            });
        }
    };

};

const createFile = async ({data, width, height, mime, inputFileName, filePath}, callback) => {
    const outputName = `${inputFileName}@${width}x.${EXTS[mime]}`;

    // console.log(`
    //                 createFile
    //                 called
    //                 for => ${outputName}
    //                 `);
    // console.log(width, height);
    const emitted = await emitFile(filePath, outputName, data);

    if (emitted) {
        typeof callback === "function" && callback({data, width, height, mime, inputFileName, filePath});

        return {
            outputName: `@${width}x.${EXTS[mime]}`,
            filePath,
            data, width, height, mime
        }
    }
    return emitted;
};

const input = 'pages/images/image.png';

const calculateXSizes = (imageCurrentSize) => {

    const configs = [
        {width: '20%'},
        {width: '40%'},
        {width: '60%'},
        {width: '80%'},
        {width: '100%'}
    ];

    const configsMap = configs.map(({width}) => {
        return calculateSize(width, imageCurrentSize);
    });

    debug(configsMap);
    console.log(configsMap);


    return configsMap;

    return [
        Math.round(imageCurrentSize / 1),
        Math.round(imageCurrentSize / 2),
        Math.round(imageCurrentSize / 3),
        Math.round(imageCurrentSize / 4),
    ];
};


const createPlaceholder = (placeholder) => placeholder;

async function runSharp(input, callback) {
    // const image = await sharpAdapter(input);
    // const metadata = await image.metadata();
    // const resized = await image.resize(200);
    input = input || 'pages/images/image.png';


    const ext = path.extname(input).replace(/\./, '');
    const filePath = path.dirname(input);
    // const name = ('[hash]-[width].[ext]').replace(/\[ext\]/ig, ext);
    const inputFileName = path.basename(input);

    // console.log('name', {name});

    const mime = MIMES[ext];
    if (!mime) {
        throw new Error('Cant parse ' + ext + ' format');
    }


    const imageSharp = sharp(input);
    let adapterOptions = {
        quality: 80,
    };

    const {width} = await imageSharp.metadata();


    if (width) {
        const sizes = calculateXSizes(width);
        let promises = [];
        const widthsToGenerate = new Set();
        (Array.isArray(sizes) ? sizes : [sizes]).forEach((size) => {
            const newWidth = Math.min(width, parseInt(size, 10));

            // Only resize images if they aren't an exact copy of one already being resized...
            if (!widthsToGenerate.has(newWidth)) {
                widthsToGenerate.add(newWidth);
                promises.push(resizeImageSharp(input).resize({
                    width: newWidth,
                    mime,
                    options: adapterOptions,
                    inputFileName,
                    filePath
                }));
            }
        });

        const outputPlaceholder = true;
        if (outputPlaceholder) {
            promises.push(resizeImageSharp(input).resize({
                width: 40,
                options: adapterOptions,
                mime,
                inputFileName,
                filePath
            }));
        }

        const callbackFn = typeof callback === 'function' ? callback : (args) => console.warn(...args);

        return Promise.all(promises).then(
            results => {
                // console.log('results', results);
                return {
                    files: results.slice(0, -1).map(async file => createFile(file, callbackFn)),
                    placeholder: createPlaceholder(results[results.length - 1])
                };
            })
            .then(({files, placeholder}) => {
                console.log('Promise.all().then.then => files', files);

                return {
                    files,
                    placeholder,
                };
                // files.forEach(emitFile);
                // console.log('files', files);
                // console.log('placeholder', placeholder);
            })
            .catch(err => {
                if (err) {
                    console.error('promise all rejected catch', err);
                    // process.exit(1);
                }
            });
// console.log(promises);

    }


//
//
// if (width) {
//     const sizes = await calculateXSizes(width);
//     console.log(sizes);
//
//     sizes.map(async (size) => {
//             const buffer = await imageSharp
//                 .resize(size)
//                 .webp()
//                 .toBuffer();
//
//             if (!buffer) {
//                 console.error('not buffer, error');
//             }
//
//             console.log(`
    //               buffer ${size}`
//     , await Promise.all(buffer));
    //         }
    //     )
    // } else {
    //     console.error('not width')
    // }
}

//
// runSharp().then(a => {
//     console.log(a);
// }).catch(error => {
//     console.error('sharp found an error', error);
// });
//


module.exports = {
    runSharp,
};
