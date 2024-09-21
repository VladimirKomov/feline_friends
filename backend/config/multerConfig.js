import multer from 'multer'

// Используем хранилище в памяти
const storage = multer.memoryStorage();

// Создаем объект multer с конфигурацией
export const upload = multer({ storage: storage });


