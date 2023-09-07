import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  storage: diskStorage({
    // destination: join(__dirname, '..', 'uploads')
    destination: './dist/src/uploads',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const extension = extname(file.originalname);
      callback(null, file.fieldname + '-' + uniqueSuffix + extension);
    },
  }),
};
