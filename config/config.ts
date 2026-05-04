// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import routes from './routes';
// import proxy from './proxy';
// const { REACT_APP_ENV } = process.env;

export default defineConfig({
	hash: true,
	targets: {
		ie: 11,
	},
	routes,
	// Theme for antd: https://ant.design/docs/react/customize-theme-cn
	theme: {
		'primary-color': defaultSettings.primaryColor,
		'border-radius-base': defaultSettings.borderRadiusBase,
	},
	title: false,
	ignoreMomentLocale: true,
	manifest: {
		basePath: '/',
	},
	locale: {
		default: 'vi-VN',
		antd: true,
		baseNavigator: true,
	},
	define: {
		'process.env.NODE_ENV': process.env.NODE_ENV,
		...Object.entries(process.env).reduce((result, [key, value]) => {
			if (key.startsWith('APP_CONFIG_')) {
				result[key] = value;
			}
			return result;
		}, {}),
	},
	layout: {
		locale: true,
		...defaultSettings,
	},
});
