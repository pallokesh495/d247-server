// fileController.js
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";

// Get the directory name (equivalent to __dirname in CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../../uploads"); // Adjusted path
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG and PNG are allowed."));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const fileController = {
  // Upload a file
  uploadFile: async (req, res) => {
    try {
      upload.single("screenshot")(req, res, (err) => {
        if (err) {
          return res.status(400).json({ success: false, message: err.message });
        }

        if (!req.file) {
          return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const filePath = req.file.path;
        res.status(200).json({ success: true, filePath });
      });
    } catch (error) {
      console.error("Error in uploadFile:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Serve a file securely
  serveFile: async (req, res) => {
    try {
      const { filename } = req.params;
      const filePath = path.join(__dirname, "../../uploads", filename); // Adjusted path

      console.log("filepath----->>>>>>", filePath);

      // Check if the file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ success: false, message: "File not found" });
      }

      // Send the file
      res.sendFile(filePath);
    } catch (error) {
      console.error("Error in serveFile:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  },
};

export default fileController;