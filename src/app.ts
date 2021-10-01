import "dotenv/config";
import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";

import Routes from "./routes";

if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app: Express = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(
  "/files",
  express.static(path.resolve(__dirname, "..", "tmp", "uploads"))
);

app.use(Routes);

app.listen(PORT, () => {
  console.log(`🚀 Listening on port ${PORT}`);
});
