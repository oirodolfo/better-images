const loaderUtils = require('loader-utils');
const path = require('path');
const {runSharp} = require('./BetterImagesWebpackPlugin');
const sharp = require("sharp");

// import validateOptions from 'schema-utils';

// const schema = {
//     type: 'object',
//     properties: {
//         test: {
//             type: 'string'
//         }
//     }
// };


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
