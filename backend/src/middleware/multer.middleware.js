import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    // cb(null, `${Date.now()}-${file.originalname}`);
    const ex = path.extname(file.originalname || "").toLowerCase();
    const safeExt = [".jpeg", ".jpg", ".png", ".webp"].includes(ext) ? ext : "";
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${safeExt}`);
  },
});

// file filter: only jpeg,jpg,png,webp
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/; // reg expression
  const extName = allowedTypes.test(
    path.extname(file.originalname).toLocaleLowerCase(),
  );
  const mimeType = allowedTypes.test(file.mimeType);

  if (extName && mimeType) {
    cb(null, file);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});
