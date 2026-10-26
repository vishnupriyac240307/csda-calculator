import bcrypt from 'bcryptjs';
import { User } from '../models/User';

export async function seedAdminUser(): Promise<void> {
  try {
    const adminUsername = 'admin';
    const adminPassword = 'admincsda68';

    const existingAdmin = await User.findOne({ username: adminUsername });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPassword, salt);

    if (!existingAdmin) {
      await User.create({
        fullName: 'CSDA Department Administrator',
        rollNumber: 'ADMIN-CSDA',
        email: 'admin@csda.ac.in',
        username: adminUsername,
        passwordHash,
        role: 'admin'
      });
      console.log('[Seed] Admin account created successfully: username="admin"');
    } else {
      existingAdmin.passwordHash = passwordHash;
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log('[Seed] Admin account updated/verified: username="admin"');
    }
  } catch (error) {
    console.error('[Seed] Error seeding admin user:', error);
  }
}
