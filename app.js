import express from "express";
import morgan from "morgan";
import cors from "cors";

import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/authRouter.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);
app.use("/api/auth", authRouter);

app.use((_, res) => {
    res.status(404).json({message: "Route not found"});
});

app.use((err, req, res, next) => {
    console.error(`[ERROR] ${err.status || 500}: ${err.message}`);

    if (!err.status) {
        console.error("[ERROR] Stack Trace:", err.stack);
    }

    const status = err.status || 500;
    const message = err.message || "Server error";

    res.status(status).json({message});

    next();
});

app.listen(3000, () => {
    console.log("Server is running. Use our API on port: 3000");
});
