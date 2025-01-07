// cloudinary.js
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// Upload from a Buffer using an upload_stream
const uploadOnCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    // Set any desired options (folder, resource_type, etc.)
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    // "stream.end()" sends the buffer to Cloudinary
    stream.end(fileBuffer);
  });
};

export { uploadOnCloudinary };
