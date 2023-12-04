import dotenv from "dotenv";
import express from "express";
import SynchronizationRouter from "./routes/SynchronizationRouter";

dotenv.config();

const app = express();

app.get("/health", (req, res) => {
    res.send("API is healthy!");
});

app.use('/synchronise', SynchronizationRouter);

app.listen(process.env.PORT, () => {
    console.log(`API up and running at http://localhost:${process.env.PORT}`);
});