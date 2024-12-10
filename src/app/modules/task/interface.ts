/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { ENUM_TASK_STATUS } from "@/enums/task"
import { Model, Types } from "mongoose"

export type ITask = {
    name: string
    project: Types.ObjectId
    assignedTo: Types.ObjectId
    status: ENUM_TASK_STATUS
}

export interface TaskModel extends Model<ITask> {
    isUserExist(id: string): Promise<ITask> | null;
}