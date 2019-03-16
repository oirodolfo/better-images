const loaderUtils = require('loader-utils');
const path = require('path');
// import validateOptions from 'schema-utils';

// const schema = {
//     type: 'object',
//     properties: {
//         test: {
//             type: 'string'
//         }
//     }
// };


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

module.exports = function (content) {
    const options = loaderUtils.getOptions(this);
    const callback = this.async();
    const loaderContext = this;
    const parsedResourceQuery = this.resourceQuery ? loaderUtils.parseQuery(this.resourceQuery) : {};

    const config = Object.assign({}, loaderUtils.getOptions(this), parsedResourceQuery);

    const outputContext = /** config.context || **/ this.rootContext || this.options && this.options.context;

    const ext = path.extname(this.resourcePath).replace(/\./, '');
    const mime = MIMES[ext];

    const name = ('[hash]-[width].[ext]').replace(/\[ext\]/ig, ext);
    console.log(name, ext, mime);
    // console.log(name)
    // console.log(name)
    // console.log(name)
    // console.log(name)


    if (!parsedResourceQuery) {
        console.log(JSON.stringify(parsedResourceQuery));

        const fileName = loaderUtils.interpolateName(loaderContext, name, {
            context: outputContext,
            content: content
        })
            .replace(/\[width\]/ig, '100')
            .replace(/\[height\]/ig, '100');

        console.log(fileName)
    } else {
        console.log('EITA!!!');
    }

    const loaderCallback = callback;
    // const headerPath = path.resolve('header.js');

    // this.addDependency(headerPath);
    //
    // fs.readFile(headerPath, 'utf-8', function (err, header) {
    //     if (err) return callback(err);
    //     callback(null, header + '\n' + source);
    // });


    // validateOptions(schema, options, 'Example Loader');

    // Apply some transformations to the source...

    // return `export default ${JSON.stringify(source)}`;

    return content;
}
