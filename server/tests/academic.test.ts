import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AcademicRecord } from '../src/models/AcademicRecord';
import * as academicController from '../src/controllers/academicController';

describe('Academic Records & Multi-Student Isolation Tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('Data Isolation Between Different Students', () => {
    it('retrieves only records associated with the authenticated student userId', async () => {
      const studentAId = 'studentA_id_123';
      const studentBId = 'studentB_id_456';

      const studentARecords = [
        {
          userId: studentAId,
          semester: 1,
          marks: [{ subjectId: 'CSDA101', marksObtained: 85 }],
          sgpa: 8.5
        }
      ];

      // Spy on find: ensure it filters strictly by user._id
      const findSpy = vi.spyOn(AcademicRecord, 'find').mockReturnValue({
        sort: vi.fn().mockResolvedValue(studentARecords)
      } as any);

      const req: any = {
        user: { _id: studentAId, fullName: 'Student A' }
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

      await academicController.getAllAcademicRecords(req, res, next);
      expect(res.statusCode).toBe(200);

      // Verify strict isolation query
      expect(findSpy).toHaveBeenCalledWith({ userId: studentAId });
      expect(findSpy).not.toHaveBeenCalledWith({ userId: studentBId });
    });

    it('rejects saving marks with marks exceeding subject maximum', async () => {
      const req: any = {
        user: { _id: 'student1' },
        params: { semester: '1' },
        body: {
          marks: [
            { subjectId: 'CSDA101', marksObtained: 150 } // CSDA101 maxMarks is 100
          ]
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

      await academicController.saveSemesterMarks(req, res, next);
      expect(res.statusCode).toBe(400);
      expect(res.data.success).toBe(false);
      expect(res.data.message).toContain('Marks cannot exceed 100');
    });

    it('rejects saving negative marks', async () => {
      const req: any = {
        user: { _id: 'student1' },
        params: { semester: '1' },
        body: {
          marks: [
            { subjectId: 'CSDA101', marksObtained: -10 }
          ]
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

      await academicController.saveSemesterMarks(req, res, next);
      expect(res.statusCode).toBe(400);
      expect(res.data.success).toBe(false);
      expect(res.data.message).toContain('Marks cannot be negative');
    });

    it('saves valid marks and computes SGPA', async () => {
      const studentId = 'student1';
      const upsertSpy = vi.spyOn(AcademicRecord, 'findOneAndUpdate').mockResolvedValue({
        userId: studentId,
        semester: 1,
        marks: [{ subjectId: 'CSDA101', marksObtained: 90 }]
      } as any);

      const req: any = {
        user: { _id: studentId },
        params: { semester: '1' },
        body: {
          marks: [
            { subjectId: 'CSDA101', marksObtained: 90 }
          ]
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

      await academicController.saveSemesterMarks(req, res, next);
      expect(res.statusCode).toBe(200);
      expect(res.data.success).toBe(true);
      expect(upsertSpy).toHaveBeenCalledWith(
        { userId: studentId, semester: 1 },
        expect.objectContaining({
          userId: studentId,
          semester: 1
        }),
        expect.anything()
      );
    });

    it('resets all academic marks for the current student without deleting account', async () => {
      const studentId = 'student_to_reset';
      const deleteManySpy = vi.spyOn(AcademicRecord, 'deleteMany').mockResolvedValue({
        acknowledged: true,
        deletedCount: 6
      } as any);

      const req: any = {
        user: { _id: studentId }
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

      await academicController.resetAllAcademicMarks(req, res, next);
      expect(res.statusCode).toBe(200);
      expect(deleteManySpy).toHaveBeenCalledWith({ userId: studentId });
      expect(res.data.message).toContain('Your account and profile remain intact');
    });
  });
});
