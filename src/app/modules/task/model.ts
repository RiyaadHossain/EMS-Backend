/* eslint-disable @typescript-eslint/no-this-alias */
import { model, Schema } from 'mongoose';

import { ITask, TaskModel } from './interface';
import { ENUM_TASK_STATUS } from '@/enums/task';

const taskSchema = new Schema<ITask>(
  {
    name: { type: String, required: true },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    status: {
      type: String,
      enum: Object.values(ENUM_TASK_STATUS),
      default: ENUM_TASK_STATUS.TO_DO,
    },
  },
  { timestamps: true }
);

taskSchema.statics.isTaskExist = async function (id: string) {
  const isExist = await Task.findById(id);
  return isExist;
};

const Task = model<ITask, TaskModel>('Task', taskSchema);

export default Task;
