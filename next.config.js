const path = require('path');
const withImages = require('next-images');

module.exports = withImages({
	reactStrictMode: false,
	sassOptions: {
		includePaths: [path.join(__dirname, 'src')]
	},
	images: {
		disableStaticImages: true,
		domains: ['flagcdn.com']
	}
});
