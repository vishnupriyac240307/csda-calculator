import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcryptjs';
import { User } from '../src/models/User';
import * as profileController from '../src/controllers/profileController';

describe('Profile and Settings Controller - Unit Tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('Get Profile', () => {
    it('returns student profile for authenticated user without exposing passwordHash', async () => {
      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        fullName: 'Alex Morgan',
        rollNumber: '23CSDA015',
        email: 'alex@example.com',
        username: 'alexm',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const req: any = { user: mockUser };
      const res: any = {
        statusCode: 0,
        data: null,
        status(code: number) {
          this.statusCode = code;
          return this;
        },
        json(payload: any) {
          this.data = payload;
          return this;
        }
      };
      const next = vi.fn();

      await profileController.getProfile(req, res, next);
      expect(res.statusCode).toBe(200);
      expect(res.data.profile.fullName).toBe('Alex Morgan');
      expect(res.data.profile.passwordHash).toBeUndefined();
    });
  });

  describe('Update Profile', () => {
    it('updates student profile successfully when fields are valid', async () => {
      const userDoc = {
        _id: '507f1f77bcf86cd799439011',
        fullName: 'Old Name',
        rollNumber: '23CSDA015',
        email: 'old@example.com',
        username: 'olduser',
        save: vi.fn().mockResolvedValue(true)
      };

      vi.spyOn(User, 'find').mockResolvedValueOnce([]); // No conflicts with other users

      const req: any = {
        user: userDoc,
        body: {
          fullName: 'New Name',
          rollNumber: '23CSDA015',
          email: 'new@example.com',
          username: 'newuser'
        }
      };

      const res: any = {
        statusCode: 0,
        data: null,
        status(code: number) {
          this.statusCode = code;
          return this;
        },
        json(payload: any) {
          this.data = payload;
          return this;
        }
      };
      const next = vi.fn();

      await profileController.updateProfile(req, res, next);
      expect(res.statusCode).toBe(200);
      expect(res.data.success).toBe(true);
      expect(userDoc.fullName).toBe('New Name');
      expect(userDoc.email).toBe('new@example.com');
      expect(userDoc.save).toHaveBeenCalled();
    });

    it('rejects update if email is taken by another student', async () => {
      const userDoc = {
        _id: 'user1_id',
        fullName: 'User One',
        rollNumber: '23CSDA001',
        email: 'user1@example.com',
        username: 'user1'
      };

      // Conflict found with user2
      vi.spyOn(User, 'find').mockResolvedValueOnce([
        {
          _id: 'user2_id',
          email: 'existing@example.com'
        }
      ] as any);

      const req: any = {
        user: userDoc,
        body: {
          fullName: 'User One',
          rollNumber: '23CSDA001',
          email: 'existing@example.com',
          username: 'user1'
        }
      };

      const res: any = {
        statusCode: 0,
        data: null,
        status(code: number) {
          this.statusCode = code;
          return this;
        },
        json(payload: any) {
          this.data = payload;
          return this;
        }
      };
      const next = vi.fn();

      await profileController.updateProfile(req, res, next);
      expect(res.statusCode).toBe(409);
      expect(res.data.message).toContain('Email address is already in use');
    });
  });

  describe('Change Password', () => {
    it('rejects when current password does not match', async () => {
      const currentHashed = await bcrypt.hash('realCurrentPassword', 10);
      const userDoc = {
        _id: 'user1',
        passwordHash: currentHashed,
        save: vi.fn()
      };

      const req: any = {
        user: userDoc,
        body: {
          currentPassword: 'wrongPassword',
          newPassword: 'newSecretPassword123',
          confirmNewPassword: 'newSecretPassword123'
        }
      };

      const res: any = {
        statusCode: 0,
        data: null,
        status(code: number) {
          this.statusCode = code;
          return this;
        },
        json(payload: any) {
          this.data = payload;
          return this;
        }
      };
      const next = vi.fn();

      await profileController.changePassword(req, res, next);
      expect(res.statusCode).toBe(400);
      expect(res.data.message).toContain('Current password does not match');
      expect(userDoc.save).not.toHaveBeenCalled();
    });

    it('rejects when new password and confirm password do not match', async () => {
      const userDoc = { _id: 'user1' };
      const req: any = {
        user: userDoc,
        body: {
          currentPassword: 'password',
          newPassword: 'passwordA',
          confirmNewPassword: 'passwordB'
        }
      };

      const res: any = {
        statusCode: 0,
        data: null,
        status(code: number) {
          this.statusCode = code;
          return this;
        },
        json(payload: any) {
          this.data = payload;
          return this;
        }
      };
      const next = vi.fn();

      await profileController.changePassword(req, res, next);
      expect(res.statusCode).toBe(400);
      expect(res.data.message).toContain('do not match');
    });

    it('successfully changes password when current password matches', async () => {
      const currentHashed = await bcrypt.hash('correctPassword', 10);
      const userDoc: any = {
        _id: 'user1',
        passwordHash: currentHashed,
        save: vi.fn().mockResolvedValue(true)
      };

      const req: any = {
        user: userDoc,
        body: {
          currentPassword: 'correctPassword',
          newPassword: 'newSuperPassword123',
          confirmNewPassword: 'newSuperPassword123'
        }
      };

      const res: any = {
        statusCode: 0,
        data: null,
        status(code: number) {
          this.statusCode = code;
          return this;
        },
        json(payload: any) {
          this.data = payload;
          return this;
        }
      };
      const next = vi.fn();

      await profileController.changePassword(req, res, next);
      expect(res.statusCode).toBe(200);
      expect(res.data.success).toBe(true);
      expect(userDoc.save).toHaveBeenCalled();

      // Verify that stored passwordHash matches new password
      const isNewMatch = await bcrypt.compare('newSuperPassword123', userDoc.passwordHash);
      expect(isNewMatch).toBe(true);
    });
  });
});
