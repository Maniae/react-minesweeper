const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: './src/index.tsx',
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
    ]
  },
  resolve: {
    extensions: [ '.ts', '.js', '.json', '.tsx', '.jsx' ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
				filename: 'index.html',
			template: './src/index.html',
			inject: 'body'
    })
  ],
  devServer: {
		historyApiFallback: {
			index: "",
			verbose: true,
			disableDotRule: true
		}
	}
};
