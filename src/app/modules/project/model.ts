/* eslint-disable @typescript-eslint/no-this-alias */
import { model, Schema } from 'mongoose';

import { IProject, ProjectModel } from './interface';
import { ENUM_PROJECT_STATUS } from '@/enums/project';

const projectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    department: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    manager: { type: Schema.Types.ObjectId, ref: 'Manager', required: true },
    issueDate: { type: Date, required: true },
    expectedEndDate: { type: Date, required: true },
    status: {
      type: String,
      enum: Object.values(ENUM_PROJECT_STATUS),
      default: ENUM_PROJECT_STATUS.TO_DO,
    },
  },
  { timestamps: true }
);

projectSchema.statics.isProjectExist = async function (id: string) {
  const isExist = await Project.findById(id);
  return isExist;
};

const Project = model<IProject, ProjectModel>('Project', projectSchema);

export default Project;
