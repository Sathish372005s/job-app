// middleware/upload.js

import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudnary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "resumes",
    resource_type: "raw", // 🔥 important for PDF/DOC
    allowed_formats: ["pdf", "doc", "docx"],
  },
});

const upload = multer({ storage });

export default upload;