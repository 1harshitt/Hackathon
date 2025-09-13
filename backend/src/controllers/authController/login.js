import Joi from "joi";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Op } from "sequelize";
import { JWT_SECRET } from "../../config/config.js";
import responseHandler from "../../utils/responseHandler.js";
import validator from "../../utils/validator.js";
import Admin from "../../models/adminModel.js";

export default {
    validator: validator({
        body: Joi.object({
            id: Joi.string().required(),
            password: Joi.string().required()
        })
    }),
    handler: async (req, res) => {
        try {
            const { id, password } = req.body;

            const user = await Admin.findOne({ where: { [Op.or]: [{ username: id }, { email: id }] } });
            if (!user) return responseHandler.error(res, "User not found");

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) return responseHandler.error(res, "Invalid password");

            const token = jwt.sign({ id: user.id, role: user.role_id }, JWT_SECRET, { expiresIn: '1y' });
            return responseHandler.success(res, "Login successful", { token, user });
        } catch (error) {
            return responseHandler.error(res, error?.message);
        }
    }
};
