import express, { json} from "express";

import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import "dotenv/config";
import medicationsRouter from "./medications/medications.router.js";
import usersRouter from "./users/users.router.js";
import { ErrorResponse } from "./error.js";
import path from 'node:path';

const app = express();

const directoryPath = path.join(
  'C:', 'Users', 'LENOVO', 'Documents', 'Courses2023', 'Angular', 
  'final-project-Bennymedic-3', 'frontend', 'dist', 'frontend'
);
app.use(express.static(directoryPath));

(async function () {
  try {
    if (process.env.DB_SERVER_URL) {
      await mongoose.connect(process.env.DB_SERVER_URL);
      console.log(`MongoDB server is connected successfully`);
    } else {
      throw new Error(`DB server URL is not found`);
    }
  } catch (error) {
    console.log(error);
    process.exit(0);
  }
})();

app.use(cors());
app.use(morgan("dev"));
app.use(json());

// routes
app.use("/users", usersRouter);
app.use("/medications", medicationsRouter);

// Fallback route to serve the Angular index.html for any undefined routes

app.get("*", (req, res) => {
  res.sendFile(path.join(directoryPath + 'index.html'));
});


// Catch all unhandled requests
app.all("*", async (req, res, next) => {
  next(new ErrorResponse(`Route not found`, 404));
});

// error handler
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({ success: false, data: error.message });
});

app.listen(3000, () => console.log(`Express server is listening on port 3000`));
