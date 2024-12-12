/* eslint-disable @typescript-eslint/no-this-alias */
import { model, Schema } from 'mongoose';

import { IAnnouncement, AnnouncementModel } from './interface';

const announcementSchema = new Schema<IAnnouncement>(
  {
    text: { type: String, required: true },
    announcedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }
  },
  { timestamps: true }
);


const Announcement = model<IAnnouncement, AnnouncementModel>('Announcement', announcementSchema);

export default Announcement;
