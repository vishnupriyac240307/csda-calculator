import mongoose, { Document, Schema } from 'mongoose';

export interface ISubjectMark {
  subjectId: string;
  marksObtained: number | null;
}

export interface IAcademicRecord extends Document {
  userId: mongoose.Types.ObjectId;
  curriculumVersion: string;
  semester: number;
  marks: ISubjectMark[];
  sgpa: number | null;
  totalEligibleCredits: number;
  completedCredits: number;
  totalWeightedPoints: number;
  status: 'Not Started' | 'In Progress' | 'Completed';
  createdAt: Date;
  updatedAt: Date;
}

const SubjectMarkSchema = new Schema(
  {
    subjectId: {
      type: String,
      required: true,
      trim: true
    },
    marksObtained: {
      type: Number,
      default: null,
      min: [0, 'Marks cannot be negative']
    }
  },
  { _id: false }
);

const AcademicRecordSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    curriculumVersion: {
      type: String,
      required: true,
      default: 'v1.0-configurable'
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 6,
      index: true
    },
    marks: {
      type: [SubjectMarkSchema],
      default: []
    },
    sgpa: {
      type: Number,
      default: null
    },
    totalEligibleCredits: {
      type: Number,
      default: 0
    },
    completedCredits: {
      type: Number,
      default: 0
    },
    totalWeightedPoints: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Completed'],
      default: 'Not Started'
    }
  },
  {
    timestamps: true
  }
);

// Ensure a user has at most one record per semester
AcademicRecordSchema.index({ userId: 1, semester: 1 }, { unique: true });

export const AcademicRecord = mongoose.model<IAcademicRecord>('AcademicRecord', AcademicRecordSchema);
