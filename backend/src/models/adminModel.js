import bcrypt from 'bcrypt';
import Role from './roleModel.js';
import { DataTypes, sequelize, createBaseModel } from './modelUtils/modelUtils.js';
import { CONFIG } from '../config/config.js';

const adminAttributes = {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    role_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    profilePic: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
        unique: true
    }
};

const Admin = createBaseModel(sequelize, 'Admin', adminAttributes);

// Initialize default super admin
const initializeAdmin = async () => {
    try {
        const existingAdmin = await Admin.findOne({
            where: { email: CONFIG.email }
        });

        if (!existingAdmin) {
            const [role] = await Role.findOrCreate({
                where: { role_name: 'admin' },
                defaults: {
                    role_name: 'admin',
                    permissions: { all: true },
                    created_by: 'ADMIN'
                }
            });

            const hashedPassword = await bcrypt.hash(CONFIG.password, 12);
            await Admin.create({
                username: CONFIG.username,
                password: hashedPassword,
                email: CONFIG.email,
                phone: CONFIG.phone,
                role_id: role.id,
                isActive: true,
                created_by: 'ADMIN'
            });
        }
    } catch (error) {
        console.error('Error creating default Admin:', error);
    }
};

// Call this after database sync
sequelize.sync().then(() => {
    initializeAdmin();
});

export default Admin;
