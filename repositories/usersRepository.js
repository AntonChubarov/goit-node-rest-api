import User from "./models/Users.js";

class UsersRepository {
    async create({email, password, avatarURL, verificationToken}) {
        try {
            return await User.create({email: email, password: password, avatarURL: avatarURL});
        } catch (error) {
            console.error(`[DB] Error creating user ${email}:`, error);
            throw error;
        }
    }

    async findByEmail(email) {
        return await User.findOne({where: {email}});
    }

    async findById(id) {
        return await User.findByPk(id);
    }

    async updateToken(userId, token) {
        console.log(`[DB] Updating token for user ${userId}: ${token}`);
        const [rowsUpdated] = await User.update(
            {token},
            {where: {id: userId}}
        );

        if (rowsUpdated === 0) {
            console.error(`[DB] Failed to update token for user ${userId}`);
        }
    }

    async updateSubscription(userId, subscription) {
        const [rowsUpdated, [updatedUser]] = await User.update(
            {subscription},
            {where: {id: userId}, returning: true}
        );
        return rowsUpdated ? updatedUser : null;
    }

    async updateAvatar(userId, avatarURL) {
        await User.update({avatarURL}, {where: {id: userId}});
    }

    async findByVerificationToken(token) {
        return await User.findOne({where: {verificationToken: token}});
    }

    async verifyUser(userId) {
        await User.update({verified: true, verificationToken: null}, {where: {id: userId}});
    }

    async updateVerificationToken(userId, verificationToken) {
        await User.update({verificationToken}, {where: {id: userId}});
    }
}

const usersRepository = new UsersRepository();
export default usersRepository;
