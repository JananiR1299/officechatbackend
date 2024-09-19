import multer from "multer";
import path from "path";
console.log("enter middleware");

// Define storage options
const storage = multer.memoryStorage(); // Store files in memory for processing

// Define upload middleware with a 10 MB limit
const uploadLogo = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});

const excelFilter: any = (req: Request, file: any, cb: any) => {
  if (file.mimetype) {
    cb(null, true);
  } else {
    cb("Please upload only excel file.", false);
  }
};

let importstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/"));
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, `${Date.now()}-leads-${file.originalname}`);
  },
});

let uploadFile = multer({ storage: importstorage, fileFilter: excelFilter });

export default { uploadLogo, uploadFile };

// import multer from "multer";
// import path from "path";

// // Storage configuration for both images and other files
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     console.log(file);
//     console.log(path.join(__dirname));
//     // Determine destination based on file type
//     if (file.mimetype.startsWith("image/")) {
//       cb(null, path.join(__dirname, "../public/images"));
//     } else {
//       cb(null, path.join(__dirname, "../public/files"));
//     }
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// // File filters for both images and other files
// const fileFilter = (req: any, file: any, cb: any) => {
//   if (
//     file.mimetype.startsWith("image/") ||
//     [
//       "application/vnd.ms-excel",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//       "text/plain",
//     ].includes(file.mimetype)
//   ) {
//     cb(null, true); // Accept images and specific file types
//   } else {
//     cb(new Error("Please upload only images or allowed file types."), false);
//   }
// };

// // Multer configuration
// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 10 * 1024 * 1024 },
// }); // 10 MB limit

// export default upload;
