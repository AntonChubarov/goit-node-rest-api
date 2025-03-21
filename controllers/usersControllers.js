import fs from "fs/promises";
import path from "path";
import { updateAvatar } from "../services/usersService.js";

const avatarsDir = path.join(process.cwd(), "public/avatars");

export const updateUserAvatar = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({message: "File is required"});
        }

        const {path: tempPath, filename} = req.file;
        const newFilePath = path.join(avatarsDir, filename);
        await fs.rename(tempPath, newFilePath);

        const avatarURL = `/avatars/${filename}`;
        await updateAvatar(req.user.id, avatarURL);

        res.status(200).json({avatarURL});
    } catch (error) {
        next(error);
    }
};
