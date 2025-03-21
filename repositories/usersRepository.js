import User from "./models/Users.js";

class UsersRepository {
    async create({email, password, avatarURL}) {
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
}

const usersRepository = new UsersRepository();
export default usersRepository;
