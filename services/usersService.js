import usersRepository from "../repositories/usersRepository.js";

export async function updateAvatar(userId, avatarURL) {
    return await usersRepository.updateAvatar(userId, avatarURL);
}
