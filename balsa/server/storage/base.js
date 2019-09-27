import fs from 'fs';
import shortid from 'shortid';

const UPLOAD_DIR = 'uploads';

// ReadStream
export default class BaseStorage {
  generateId() {
    return shortid.generate();
  }

  // processUpload
  async store(file, subDirectory) {
    const { createReadStream, filename, mimetype } = await file;
    const stream = createReadStream();
    const { id, path } = await this.saveFile(stream, filename, subDirectory);
    return { id, filename, mimetype, path };
  }

  checkPath(path) {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }
  }

  // storeFS
  async saveFile(fileStream, fileName, subDirectory) {
    const id = this.generateId();
    const directory = subDirectory ? `${UPLOAD_DIR}/${subDirectory}` : UPLOAD_DIR;
    fileName = `${id}-${fileName}`;
    const filePath = `${directory}/${fileName}`;
    const path = `${subDirectory}/${fileName}`;

    this.checkPath(directory);

    return new Promise((resolve, reject) =>
      fileStream
        .on('error', error => {
          if (fileStream.truncated) {
            // Delete the truncated file.
            fs.unlinkSync(path);
          }

          reject(error);
        })
        .pipe(fs.createWriteStream(filePath))
        .on('error', error => reject(error))
        .on('finish', () => resolve({ path })),
    );
  }
}
