import multer from 'multer'

// Use in-memory storage
const storage = multer.memoryStorage();

// Create a multer object with configuration
export const upload = multer({storage: storage});
