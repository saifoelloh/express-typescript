import * as fs from 'fs';
import * as path from 'path';
import multer from 'multer';
import { randomUUID } from 'crypto';
import { ImageDto } from '@/dtos/image.dto';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.resolve(__dirname, '../../storage')),

  filename: (req, file, cb) => {
    const fileExt = file.mimetype.split('/')[1];
    const filePath = new Date().toISOString().split('T')[0].split('-').join('/');
    const fileName = `${randomUUID()}.${fileExt}`;

    // create file path
    const storagePath = __dirname + `/../../storage/${filePath}`;

    const fullPath = path.resolve(storagePath);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }

    req.fileData = {
      extension: fileExt,
      name: fileName,
      path: `${filePath}/${fileName}`,
    } as ImageDto;

    cb(null, req.fileData.path);
  },
});

export const imageUploadMw = (fieldName: string) =>
  multer({
    storage,
    limits: { fileSize: 1024 ** 2 },
  }).single(fieldName);

export const deleteImageMw = async (location: string) => {
  try {
    const filePath = __dirname + `/../../storage/${location}`;
    await fs.promises.access(filePath, fs.constants.R_OK | fs.constants.W_OK);
    fs.unlinkSync(filePath);
  } catch (error) {
    console.log(error);
  }
};
