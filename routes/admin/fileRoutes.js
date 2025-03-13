import express from 'express';
import fileController from '../../controller/admin/fileControler.js'
import AuthController from '../../controller/admin/ownerAuthController.js';

const router = express.Router();

// File upload endpoint--- not used yet this one
// router.post("file/upload", fileController.uploadFile);

// Serve files securely
router.get("/file/:filename",fileController.serveFile);



export default router;