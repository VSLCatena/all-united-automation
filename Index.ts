import { CronJob } from 'cron';
import axios from 'axios';
import dotenv from "dotenv";
import express from "express";
import SynchronizationRouter from "./routes/SynchronizationRouter";

dotenv.config();

const app = express();

app.get("/health", (req, res) => {
    res.send("API is healthy!");
});

app.use('/synchronise', SynchronizationRouter);

// Runs every day at midnight
const cronJob = new CronJob('0 0 0 * * *', () => {
    console.info('Started cron job');
    let retryCount = 0;
    const executeCronJob = async () => {
        try {
            await axios.get('http://localhost:3000/synchronise');
        } catch (error) {
            console.error('Error executing cron job:', error);

            retryCount++;
            if (retryCount <= 3) {
                console.log(`Retrying... (Attempt ${retryCount})`);
                executeCronJob();
            } else {
                console.error('Cron job failed after 3 retries');
                // TODO Send email to admin
            }
        }
    }
    executeCronJob();
});

app.listen(process.env.PORT, () => {
    console.info(`API up and running at http://localhost:${process.env.PORT}`);
    cronJob.start();
});