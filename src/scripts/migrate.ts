import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not found in .env');
  process.exit(1);
}

// User Schema (inline for script simplicity)
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function migrate() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log('Connected to MongoDB');

    const username = 'jayatama';
    const rawPassword = 'admin@jayatama';

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log('Admin user already exists');
    } else {
      const hashedPassword = await bcrypt.hash(rawPassword, 10);
      await User.create({
        username,
        password: hashedPassword,
      });
      console.log('Admin user created successfully');
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
