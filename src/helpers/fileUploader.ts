import multer from 'multer';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Configuration of cloudinary
cloudinary.config({ 
    cloud_name: 'dbxrmaghj', 
    api_key: '121786356992695', 
    api_secret: 's44z4-KTc6E-KJ74tcsA7ggGZgQ' // Click 'View API Keys' above to copy your API secret
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