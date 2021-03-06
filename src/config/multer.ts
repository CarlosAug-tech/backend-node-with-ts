import crypto from "crypto";
import multer from "multer";
import { resolve, extname } from "path";

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, "..", "..", "tmp", "uploads"),
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) {
          return cb(err, file.filename);
        }

        return cb(null, res.toString("hex") + extname(file.originalname));
      });
    },
  }),
};
