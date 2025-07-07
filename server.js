import express from 'express'
import dotenv from 'dotenv/config'
import { sql } from './config/db.js'

import { initDB } from './config/db.js'
import rateLimiter from './middleware/rateLimiter.js'
import transactionsRoute from "./routes/transactionsRoutes.js";
import job from './config/cron.js'

const app = express()

if (process.env.NODE_ENV === "production") job.start()

app.use(express.json())
app.use(rateLimiter)


app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok" })
})

app.use("/api/transactions", transactionsRoute);



initDB().then(() => {

    app.listen(process.env.PORT, () => {
        console.log(`Server is up and running on PORT: ${process.env.PORT}`)
    })
})