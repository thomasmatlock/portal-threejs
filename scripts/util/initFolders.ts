import fs from 'fs';
export const initFolders = (res: number) => {
	if (!fs.existsSync(`./public/models/${res.toString()}`)) {
		fs.mkdirSync(`./public/models/${res.toString()}`);
	}
	// create new folder for each resolution for tsx files
	if (!fs.existsSync(`./models/${res.toString()}`)) {
		fs.mkdirSync(`./models/${res.toString()}`);
	}
};
export default initFolders;
