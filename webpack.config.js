module.exports = {
    entry: "./main.js",
    output: {
      path: __dirname,
      filename: "bundle.js"
    },
    module: {
        rules: [
            {  
                test: /\.js$/,
                exclude: __dirname + '/node_modules',
            },
            {
                test: /\.(ico)$/,
                use: [
                    'file-loader'
                ]
            }
       ]
    },
    target: 'node'
  };