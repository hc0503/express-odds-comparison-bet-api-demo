const fs = require("fs");
const randomstring = require("randomstring");

const _fileStore = async (file, newFileFolder = "upload") => {
	try {
		const regex = /[^.]*/;
		const data = fs.readFileSync(file.path);
		const fileName = file.name.replace(regex, randomstring.generate());
		const filePath = newFileFolder;
		if (!fs.existsSync(`./public/${filePath}`)) {
			fs.mkdirSync(`./public/${filePath}`, {
				recursive: true
			})
		}
		fs.writeFileSync(`./public/${filePath}/${fileName}`, data);
		fs.unlinkSync(file.path);
		return Promise.resolve(`${filePath}/${fileName}`);
	} catch (error) {
		return Promise.reject(error);
	}
}

const _fileDelete = async (filePath) => {
	try {
		if (fs.existsSync(`./public/${filePath}`))
			fs.unlinkSync(`./public/${filePath}`);
		return Promise.resolve(true);
	} catch (error) {
		return Promise.reject(error);
	}
}

module.exports = {
	fileStore: _fileStore,
	fileDelete: _fileDelete,
};
