const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const defaultConfig = require("@wordpress/scripts/config/webpack.config");

module.exports = {
    ...defaultConfig,
	entry: {
		'drivetestpage': './src/googledrive-page/main.jsx',
	},

	output: {
		path: path.resolve(__dirname, 'assets/js'),
		filename: '[name].min.js',
		publicPath: '../../',
		assetModuleFilename: 'images/[name][ext][query]',
	},

	resolve: {
		extensions: ['.js', '.jsx'],
	},

	module: {
        rules: [
            // Keep WordPress default rules but add our custom ones
            ...defaultConfig.module.rules.filter(rule => {
                // Filter out default CSS/SCSS rules to avoid conflicts
                return !(rule.test && rule.test.toString().includes('css|scss'));
            }),
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            ['@babel/preset-react', { runtime: 'automatic' }]
                        ]
                    }
                },
            },
            {
                test: /\.(css|scss)$/,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader, // Don't use style-loader with MiniCssExtractPlugin
                    {
                        loader: 'css-loader',
                        options: {
                            esModule: false,
                        }
                    },
                    'sass-loader',
                ],
            },
            {
                test: /\.svg$/,
                type: 'asset/inline',
            },
            {
                test: /\.(png|jpg|gif)$/,
                type: 'asset/resource',
                generator: {
                    filename: '../images/[name][ext][query]',
                },
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                type: 'asset/resource',
                generator: {
                    filename: '../fonts/[name][ext][query]',
                },
            },
        ],
	},

	plugins: [
        ...defaultConfig.plugins,
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: '../css/[name].min.css',
		}),
	],

	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					format: {
						comments: false,
					},
				},
				extractComments: false,
			}),
		],
	},
}
