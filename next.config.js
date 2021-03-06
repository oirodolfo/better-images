const path = require('path');

module.exports = (nextConfig = {}) => {
    return Object.assign({}, nextConfig, {
        webpack(config, options) {
            const {dev, isServer} = options;
            nextConfig = Object.assign({inlineImageLimit: 8192, assetPrefix: ""}, nextConfig);

            if (!options.defaultLoaders) {
                throw new Error(
                    'This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade'
                )
            }


            let enrichedConfig = config;

            console.log('isServer', isServer);
            // console.log('enrichedConfig', enrichedConfig);


            config.module.rules.push({
                test: /\.(jpe?g|png|svg|gif|ico|webp)$/,
                exclude: nextConfig.exclude,
                oneOf: [
                    {
                        use: [
                            {
                                loader: path.resolve("./BetterImagesLoader"),
                                options: {
                                    limit: nextConfig.inlineImageLimit,
                                    fallback: "file-loader",
                                    publicPath: `${nextConfig.assetPrefix}/_next/static/images/`,
                                    outputPath: `${isServer ? "../" : ""}static/images/`,
                                    name: "[name]-[hash].[ext]"
                                }
                            }
                        ]
                    }
                ],

            });

            if (typeof nextConfig.webpack === 'function') {
                return nextConfig.webpack(config, options)
            }

            return config
        }
    })
}
