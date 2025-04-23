import multer from 'multer';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import config from '../config';

// Configuration of cloudinary
cloudinary.config({ 
    cloud_name: config.cloudinary.name, 
    api_key: config.cloudinary.api_key, 
    api_secret: config.cloudinary.api_secret // Click 'View API Keys' above to copy your API secret
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'uploads'))
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

export const upload = multer({ storage: storage });

export const uploadToCloudinary = async(file: any) => {
    // Upload an image
    const uploadResult = await cloudinary.uploader
    .upload(
        file.path, {
            public_id: file.originalname,
        }
    )
    .catch((error) => {
        console.log(error);
    });
    fs.unlinkSync(file.path);

    return uploadResult;
};