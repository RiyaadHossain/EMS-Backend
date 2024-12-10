/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { ENUM_PROJECT_STATUS } from "@/enums/project"
import { Model, Types } from "mongoose"

export type IProject = {
    name: string
    department: Types.ObjectId
    manager: Types.ObjectId
    issueDate: Date
    expectedEndDate: Date 
    status: ENUM_PROJECT_STATUS
}

export interface ProjectModel extends Model<IProject> {
    isUserExist(id: string): Promise<IProject> | null;
}