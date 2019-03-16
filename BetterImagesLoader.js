const loaderUtils = require('loader-utils');
const path = require('path');
// const {runSharp} = require('./BetterImagesWebpackPlugin');
const sharp = require("sharp");
const fs = require('fs-extra');
const debug = require('debug')('BETTER-IMAGES');
const filesize = require("filesize");

// import validateOptions from 'schema-utils';

// const schema = {
//     type: 'object',
//     properties: {
//         test: {
//             type: 'string'
//         }
//     }
// };



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
        // await fs.outputFile(`${filePath}/${filename}`, imageData);
        filesEmitted.push(filename);
        return filesEmitted;
    } catch (err) {
        console.error(err);
        throw new Error(err);
        return;
    }
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
    // console.log(configsMap);


    return configsMap;

    return [
        Math.round(imageCurrentSize / 1),
        Math.round(imageCurrentSize / 2),
        Math.round(imageCurrentSize / 3),
        Math.round(imageCurrentSize / 4),
    ];
};


const getOutputAndPublicPath = (fileName, {outputPath: configOutputPath, publicPath: configPublicPath}) => {
    let outputPath = fileName;

    if (configOutputPath) {
        if (typeof configOutputPath === 'function') {
            outputPath = configOutputPath(fileName);
        } else {
            outputPath = path.posix.join(configOutputPath, fileName);
        }
    }

    let publicPath = `__webpack_public_path__ + ${JSON.stringify(outputPath)}`;

    if (configPublicPath) {
        if (typeof configPublicPath === 'function') {
            publicPath = configPublicPath(fileName);
        } else if (configPublicPath.endsWith('/')) {
            publicPath = configPublicPath + fileName;
        } else {
            publicPath = `${configPublicPath}/${fileName}`;
        }

        publicPath = JSON.stringify(publicPath);
    }

    return {
        outputPath,
        publicPath
    };
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


module.exports = async function loader(content) {
    const options = loaderUtils.getOptions(this);
    this.debug = true;

    const callback = this.async();
    const loaderCallback = callback;

    const loaderContext = this;
    const parsedResourceQuery = this.resourceQuery ? loaderUtils.parseQuery(this.resourceQuery) : {};

    const config = Object.assign({}, loaderUtils.getOptions(this), parsedResourceQuery);

    const outputContext = /** config.context || **/ this.rootContext || this.options && this.options.context;

    const ext = path.extname(this.resourcePath).replace(/\./, '');
    const mime = MIMES[ext];

    const name = ('[hash]-[width].[ext]').replace(/\[ext\]/ig, ext);
    console.log({name, ext, mime});


    /**
     *
     * @param data
     * @param width
     * @param height
     * @param src
     * @param mime
     * @returns {*}
     */
    const createImage = ({data, width, height, src, mime}) => {
        let fileName = loaderUtils.interpolateName(loaderContext, name, {
            context: outputContext,
            content: data
        });


        console.log('---- FILENAME NO REPLACED', fileName);

        fileName = fileName.replace(/\[width\]/ig, width)
            .replace(/\[height\]/ig, height);

        return fileName;
    };

    const createFile = createImage;

    //@todo
    //@todo
    //@todo
    //@todo
    //@todo
    //@todo


const resizeImageSharp = (imagePath) => {
    return {
        resize: ({width, mime, inputFileName, name, filePath, options}) => {
            const image = sharp(imagePath);

            return new Promise((resolve, reject) => {
                let resized = image
                    .withMetadata()
                    .png({
                        // quality: 85,
                        // compressionLevel: 7,
                        ...sharpDefaultConfig,
                        // progressive: true,
                    }).resize(width, null);

                // resized.toFile(`--${outputFileName}`).then(info => {
                resized
                    .toBuffer((err, data, {width, height}) => {
                            // resized.toFile(`--${outputFileName}`).then(info => {
                            // console.log(info);
                            // debug(`${info.width}: %o, %s difference`, filesize(info.size, {base: 10}), filesize(image.size, {base: 10}));


                            if (err) {
                                console.log('rejected', err);

                                reject(err);
                            } else {
                                console.log('resolved', width, height);
                                return resolve({
                                    data,
                                    width,
                                    height,
                                    name,
                                    mime,
                                    filePath,
                                    inputFileName
                                });
                            }


                            return resolve({
                                // info,
                                data,
                                width,
                                height,
                                mime,
                                name,
                                filePath,
                                inputFileName
                            })
                        }
                    )
                //     .catch((err) => {
                //     if (err) {
                //         return reject(err)
                //     } else {
                //
                //     }
                // });

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



    async function runSharp(input, callback) {
        // const image = await sharpAdapter(input);
        // const metadata = await image.metadata();
        // const resized = await image.resize(200);
        input = input || 'pages/images/image.png';


        const ext = path.extname(input).replace(/\./, '');
        const filePath = path.dirname(input);
        const name = ('[hash]-[width].[ext]').replace(/\[ext\]/ig, ext);
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
                        name,
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
                    name,
                    filePath
                }));
            }

            const callbackFn = typeof callback === 'function' ? callback : console.warn;


            return Promise.all(promises)
                .then(results => {
                    return {
                        files: results.slice(0, -1).map(createFile),
                        // placeholder: createPlaceholder(results[results.length - 1])
                    }

                }).then(({files /**, placeholder**/}) => {
                    const srcset = files.map(f => f.src).join('+","+');

                    const images = files.map(f => '{path:' + f.path + ',width:' + f.width + ',height:' + f.height + '}').join(',');

                    const firstImage = files[0];

                    loaderCallback(null, 'module.exports = {' +
                        'srcSet:' + srcset + ',' +
                        'images:[' + images + '],' +
                        'src:' + firstImage.path + ',' +
                        'toString:function(){return ' + firstImage.path + '},' +
                        // 'placeholder: ' + placeholder + ',' +
                        'width:' + firstImage.width + ',' +
                        'height:' + firstImage.height +
                        '};');
                })
                .catch(err => loaderCallback(err));

        }
    }

    //@todo
    //@todo
    //@todo
    //@todo
    //@todo
    //@todo
    //@todo


    // console.log(name)
    // console.log(name)
    // console.log(name)
    // console.log(name)


    // if (!parsedResourceQuery) {
    // console.log(JSON.stringify(parsedResourceQuery));

    // const fileName = loaderUtils.interpolateName(loaderContext, name, {
    //     context: outputContext,
    //     content: content
    // })
    //     .replace(/\[width\]/ig, '100')
    //     .replace(/\[height\]/ig, '100');

    // console.log(fileName);


    /**
     *
     * @param data
     * @param width
     * @param height
     */
    const callbackToSharp = ({data, width, height}) => {

        const fileName = loaderUtils.interpolateName(loaderContext, name, {
            context: outputContext,
            content: data
        }).replace(/\[width\]/ig, width)
            .replace(/\[height\]/ig, height);

        const {outputPath, publicPath} = getOutputAndPublicPath(fileName, config);

        console.log('❌ ❌ ❌ callbackToSharp', fileName, outputPath, publicPath);

        loaderContext.emitFile(fileName, data);
    };

    const img = runSharp(loaderContext.resourcePath, callbackToSharp);
    // img.then(({files, placeholder}) => {
    const {files, placeholder} = await img;

    let imagesSrcMap = [];

    if (files) {
        Promise.all(files)
            .then(async file => {
                console.log('🆑 file:️ ', file);

                const {data, width, height, src, mime} = file;
                const imageCreated = createImage({data, width, height, src, mime});

                console.log('🕎 imageCreated: ', imageCreated);

                imagesSrcMap.push(
                    ...file
                );

                return imagesSrcMap;
            }).then(imagesSrcMap2 => {

            // console.log('imagesSrcMap', imagesSrcMap2);


            const imgFinalModule = generateImgModule(imagesSrcMap2);


            loaderCallback(null, imgFinalModule);
            // loaderContext.emitFile(outputPath, imgFinalModule);

            // console.log({imgFinalModule});
        });

    }


    //
    // files.forEach(async file => {
    //     const fileResolved = await file;
    //     if (fileResolved) {
    //         console.log('♊️ fileResolved', await fileResolved);
    //     }
    // });

    //
    // const contentToEmit = 'module.exports = {srcSet:' + publicPath + ',images:[{path:' + publicPath + ',width:100,height:100}],src: ' + publicPath + ',toString:function(){return ' + publicPath + '}};';
    //
    // loaderContext.emitFile(outputPath, content);
    // loaderCallback(null, contentToEmit);

// }
// else {
//     console.log('EITA!!!');
// }

// const headerPath = path.resolve('header.js');

// this.addDependency(headerPath);
//
// fs.readFile(headerPath, 'utf-8', function (err, header) {
//     if (err) return callback(err);
//     callback(null, header + '\n' + source);
// });


// validateOptions(schema, options, 'Example Loader');

// Apply some transformations to the source...

    // return `export default ${JSON.stringify(content)}`;

// return content;


    function generateImgModule(imagesSrcMap2) {

        const files = imagesSrcMap2;
        const getOutputName = (outputName, outputPath = '') => {
            return `"${outputPath}/${outputName}"`;
        };

        const srcset = files.map(f => getOutputName(f.src)).join('+","+');
        // @fixme USE OUTPUTPATH PLZ
        //
        // const images = files.map(f => '{path:' + `${publicPath}/${f.outputName}` + ',width:' + f.width + ',height:' + (f.height || 'auto') + '}').join(',');

        const firstImage = files[0];
        // src:${getOutputName(firstImage.outputName)},


        return `module.exports = {
            srcSet:[${srcset}],
            toString:function(){
                return ${getOutputName(firstImage.outputName)}},
            width: ${firstImage.width},
        };`.trim();
        // return undefined;
    }
}
;

module.exports.raw = true; // get buffer stream instead of utf8 string
