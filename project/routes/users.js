import express from "express";
import Users from "../models/users.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const users = await Users.find();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
    }
})

export default router