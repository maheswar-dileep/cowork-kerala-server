import mongoose from 'mongoose';
import { config } from '@config/env';
import { User } from '@models/User.model';

/**
 * Seed admin user
 */
async function seedAdminUser() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(config.mongodb.uri);
    console.log('Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: config.seed.adminEmail });

    if (existingAdmin) {
      console.log('Admin user already exists');
      console.log('Email:', existingAdmin.email);
      console.log('Name:', existingAdmin.name);
      console.log('Role:', existingAdmin.role);

      // Update password if needed
      const shouldUpdatePassword = process.argv.includes('--update-password');

      if (shouldUpdatePassword) {
        existingAdmin.password = config.seed.adminPassword;
        await existingAdmin.save();
        console.log('Password updated successfully');
      }

      return;
    }

    // Create admin user
    console.log('Creating admin user...');
    const adminUser = new User({
      email: config.seed.adminEmail,
      password: config.seed.adminPassword,
      name: config.seed.adminName,
      role: 'super_admin',
      isActive: true,
    });

    await adminUser.save();

    console.log('\n✅ Admin user created successfully!');
    console.log('════════════════════════════════════════');
    console.log('Email:   ', adminUser.email);
    console.log('Password:', config.seed.adminPassword);
    console.log('Name:    ', adminUser.name);
    console.log('Role:    ', adminUser.role);
    console.log('════════════════════════════════════════');
    console.log('\n⚠️  Please change the password after first login!\n');
  } catch (error) {
    console.error('Error seeding admin user:', error);
    throw error;
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
}

// Run seed script
seedAdminUser();
