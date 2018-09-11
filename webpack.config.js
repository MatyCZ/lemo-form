const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'lemo-form.js'
    },
    module: {
        rules: [
            {
                test: /.\js$/,
                exclude: /(node_modules)/,
                use: [
                    {
                        loader: 'babel-loader'
                    }
                ]
            },
        ]
    },
    externals : {
        '@fortawesome/fontawesome-svg-core': 'Icon',
        '@fortawesome/react-fontawesome': 'FontAwesomeIcon',
        'lemo-object': 'lemo-object',
        'lemo-validator': 'lemo-validator',
        'react-dom': 'react-dom',
        'prop-types': 'prop-types',
        react: 'react',
        reactstrap: 'reactstrap'
    },
    resolve: {
        alias: {
            "lemo-form": 'src/index'
        },
        extensions: ['.js', '.json'],
    },
};
