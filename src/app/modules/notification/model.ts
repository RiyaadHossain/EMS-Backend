/* eslint-disable @typescript-eslint/no-this-alias */
import { model, Schema } from 'mongoose';

import { INotification, NotificationModel } from './interface';

const notificationSchema = new Schema<INotification>(
  {
    text: { type: String, required: true },
    from: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);


const Notification = model<INotification, NotificationModel>('Notification', notificationSchema);

export default Notification;
