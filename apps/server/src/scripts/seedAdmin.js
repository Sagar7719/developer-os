import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/user.model.js';
import { hashPassword } from '../utils/password.util.js';
import { Roles } from '../constants/roles.js';

dotenv.config();

async function seedAdmin() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/developer_os';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for admin seeding.');

    const email = 'admin@sagar.dev';
    const existing = await User.findOne({ email });

    if (existing) {
      existing.role = Roles.ADMIN;
      existing.isActive = true;
      existing.password = await hashPassword('admin123');
      await existing.save();
      console.log('Updated existing admin user credentials.');
    } else {
      const hashedPassword = await hashPassword('admin123');
      await User.create({
        name: 'System Admin',
        email,
        password: hashedPassword,
        role: Roles.ADMIN,
        isActive: true,
      });
      console.log('Created new Admin user: admin@sagar.dev');
    }

    await mongoose.disconnect();
    console.log('Admin seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding admin:', err);
    process.exit(1);
  }
}

seedAdmin();
