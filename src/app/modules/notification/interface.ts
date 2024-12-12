/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { Model, Types } from "mongoose"

export type INotification = {
    text: string
    from: Types.ObjectId
    to: Types.ObjectId
    isRead?: boolean
}

export interface NotificationModel extends Model<INotification> {
    isUserExist(id: string): Promise<INotification> | null;
}