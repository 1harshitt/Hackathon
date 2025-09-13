import { DataTypes, sequelize, createBaseModel } from './modelUtils/modelUtils.js';

const contactAttributes = {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    }
};

const Contact = createBaseModel(sequelize, 'Contact', contactAttributes);

export default Contact;
