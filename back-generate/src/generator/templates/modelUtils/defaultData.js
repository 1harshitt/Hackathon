/**
 * Initialize default data for models
 * @param {Object} models - Object containing all models
 */
export const initializeDefaultData = async (models) => {
    try {
        // Initialize roles if they don't exist
        await initializeRoles(models.Role);
        
        // Initialize admin user if it doesn't exist
        await initializeAdmin(models.User, models.Role);
        
        console.log('✅ Default data initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing default data:', error);
    }
};

/**
 * Initialize default roles
 * @param {Object} Role - Role model
 */
async function initializeRoles(Role) {
    if (!Role) return;
    
    const defaultRoles = [
        { name: 'admin', description: 'Administrator with full access' },
        { name: 'user', description: 'Regular user with limited access' },
        { name: 'guest', description: 'Guest user with minimal access' }
    ];
    
    for (const role of defaultRoles) {
        const existingRole = await Role.findOne({ where: { name: role.name } });
        if (!existingRole) {
            await Role.create(role);
            console.log(`Created default role: ${role.name}`);
        }
    }
}

/**
 * Initialize default admin user
 * @param {Object} User - User model
 * @param {Object} Role - Role model
 */
async function initializeAdmin(User, Role) {
    if (!User || !Role) return;
    
    const adminRole = await Role.findOne({ where: { name: 'admin' } });
    if (!adminRole) return;
    
    const existingAdmin = await User.findOne({ 
        where: { email: 'admin@example.com' } 
    });
    
    if (!existingAdmin) {
        await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'admin123', // This should be hashed in a real app
            role_id: adminRole.id,
            is_active: true
        });
        console.log('Created default admin user');
    }
} 