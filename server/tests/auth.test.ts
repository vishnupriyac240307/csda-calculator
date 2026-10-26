import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcryptjs';
import { User } from '../src/models/User';
import * as authController from '../src/controllers/authController';

describe('Authentication Controller - Unit & Logic Tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('User Registration', () => {
    it('rejects registration when required fields are missing', async () => {
      const req: any = {
        body: {
          fullName: 'John Doe',
          rollNumber: '',
          email: 'john@example.com',
          username: 'johndoe',
          password: 'password123',
          confirmPassword: 'password123'
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

      await authController.register(req, res, next);
      expect(res.statusCode).toBe(400);
      expect(res.data.success).toBe(false);
      expect(res.data.message).toContain('All fields are required');
    });

    it('rejects registration when passwords do not match', async () => {
      const req: any = {
        body: {
          fullName: 'John Doe',
          rollNumber: '23CSDA001',
          email: 'john@example.com',
          username: 'johndoe',
          password: 'password123',
          confirmPassword: 'differentPassword'
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

      await authController.register(req, res, next);
      expect(res.statusCode).toBe(400);
      expect(res.data.message).toContain('Passwords do not match');
    });

    it('rejects duplicate username gracefully with 409 conflict', async () => {
      vi.spyOn(User, 'findOne').mockResolvedValueOnce({
        username: 'existinguser',
        email: 'other@example.com',
        rollNumber: '23CSDA999'
      } as any);

      const req: any = {
        body: {
          fullName: 'John Doe',
          rollNumber: '23CSDA001',
          email: 'john@example.com',
          username: 'existinguser',
          password: 'password123',
          confirmPassword: 'password123'
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

      await authController.register(req, res, next);
      expect(res.statusCode).toBe(409);
      expect(res.data.message).toContain('already taken');
    });

    it('rejects duplicate roll number gracefully with 409 conflict', async () => {
      vi.spyOn(User, 'findOne').mockResolvedValueOnce({
        username: 'someoneelse',
        email: 'other@example.com',
        rollNumber: '23CSDA001'
      } as any);

      const req: any = {
        body: {
          fullName: 'John Doe',
          rollNumber: '23CSDA001',
          email: 'john@example.com',
          username: 'johndoe',
          password: 'password123',
          confirmPassword: 'password123'
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

      await authController.register(req, res, next);
      expect(res.statusCode).toBe(409);
      expect(res.data.message).toContain('Roll Number already exists');
    });

    it('creates new user and hashes password with bcrypt', async () => {
      vi.spyOn(User, 'findOne').mockResolvedValueOnce(null);

      const fakeUser = {
        _id: '507f1f77bcf86cd799439011',
        fullName: 'John Doe',
        rollNumber: '23CSDA001',
        email: 'john@example.com',
        username: 'johndoe',
        createdAt: new Date()
      };

      const createSpy = vi.spyOn(User, 'create').mockResolvedValueOnce(fakeUser as any);

      const req: any = {
        body: {
          fullName: 'John Doe',
          rollNumber: '23csda001', // test uppercase normalization
          email: 'John@Example.Com', // test lowercase normalization
          username: 'JohnDoe',
          password: 'secretPassword123',
          confirmPassword: 'secretPassword123'
        }
      };

      const res: any = {
        statusCode: 0,
        data: null,
        cookies: {},
        cookie(name: string, val: string) {
          this.cookies[name] = val;
          return this;
        },
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

      await authController.register(req, res, next);
      expect(res.statusCode).toBe(201);
      expect(res.data.success).toBe(true);
      expect(res.data.user.rollNumber).toBe('23CSDA001');
      expect(res.cookies.token).toBeDefined();

      // Verify that create received a hashed password, not plaintext
      const createArgs = createSpy.mock.calls[0][0] as any;
      expect(createArgs.passwordHash).not.toBe('secretPassword123');
      expect(createArgs.passwordHash.startsWith('$2')).toBe(true);
    });
  });

  describe('User Login', () => {
    it('rejects invalid password with 401', async () => {
      const hashedPassword = await bcrypt.hash('correctPassword123', 10);
      vi.spyOn(User, 'findOne').mockResolvedValueOnce({
        _id: '507f1f77bcf86cd799439011',
        username: 'johndoe',
        passwordHash: hashedPassword
      } as any);

      const req: any = {
        body: {
          username: 'johndoe',
          password: 'wrongPassword'
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

      await authController.login(req, res, next);
      expect(res.statusCode).toBe(401);
      expect(res.data.message).toContain('Invalid username or password');
    });

    it('authenticates valid credentials and sets session cookie', async () => {
      const password = 'mySecretPassword';
      const hashedPassword = await bcrypt.hash(password, 10);

      vi.spyOn(User, 'findOne').mockResolvedValueOnce({
        _id: '507f1f77bcf86cd799439011',
        fullName: 'Jane Smith',
        rollNumber: '23CSDA042',
        email: 'jane@example.com',
        username: 'janesmith',
        passwordHash: hashedPassword,
        createdAt: new Date()
      } as any);

      const req: any = {
        body: {
          username: 'janesmith',
          password
        }
      };

      const res: any = {
        statusCode: 0,
        data: null,
        cookies: {},
        cookie(name: string, val: string) {
          this.cookies[name] = val;
          return this;
        },
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

      await authController.login(req, res, next);
      expect(res.statusCode).toBe(200);
      expect(res.data.success).toBe(true);
      expect(res.data.user.fullName).toBe('Jane Smith');
      expect(res.cookies.token).toBeDefined();
    });

    it('clears session cookie on logout', async () => {
      const req: any = {};
      const res: any = {
        clearedCookies: {},
        statusCode: 0,
        data: null,
        clearCookie(name: string) {
          this.clearedCookies[name] = true;
          return this;
        },
        status(code: number) {
          this.statusCode = code;
          return this;
        },
        json(payload: any) {
          this.data = payload;
          return this;
        }
      };

      await authController.logout(req, res);
      expect(res.statusCode).toBe(200);
      expect(res.clearedCookies.token).toBe(true);
      expect(res.data.message).toContain('Logged out successfully');
    });
  });
});
