/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { Model, Types } from "mongoose"

export type IAnnouncement = {
    text: string
    announcedBy: Types.ObjectId
}

export interface AnnouncementModel extends Model<IAnnouncement> {
    isUserExist(id: string): Promise<IAnnouncement> | null;
}