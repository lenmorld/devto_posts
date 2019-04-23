var path = require("path");

module.exports = {
	mode: "development",
	context: path.join(__dirname, "./"),
	entry: "./app/index.jsx",
	output: {
		path: path.join(__dirname, "public"),
		filename: "bundle.js"
	},
	resolve: {
		extensions: [".js", ".jsx"]
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				loader: "babel-loader",
				exclude: /node_modules/,
				include: path.join(__dirname, "app"),
				options: {
					presets: ["@babel/react"]
				}
			},
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"]
			}
		]
	},
	devServer: {
		contentBase: "./public",
		port: 4002,
		// all backend requests (/api) must go to localhost:4001/api
		proxy: {
			"/api": "http://localhost:4001"
		}
	}
};
