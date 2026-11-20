import mongoose from 'mongoose';
const { Schema } = mongoose;

import ModelNames from './modelNames.js';

const calendarSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: ModelNames.User,
        required: true,
    },
    members: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: ModelNames.User,
            required: true,
        },
        permissions: {
            can_create_events: { type: Boolean, default: false },
            can_edit_events: { type: Boolean, default: false },   // events of other people
            can_delete_events: { type: Boolean, default: false }, // events of other people
            can_invite_users: { type: Boolean, default: false },
            can_manage_members: { type: Boolean, default: false }, // change perms, remove from calendar
            can_edit_calendar: { type: Boolean, default: false },
            updated_at: { type: Date, default: Date.now },
        },
        joined_at: { type: Date, default: Date.now },
    }],
    color: String,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    is_default: { type: Boolean, default: false }, //can't delete
    is_holiday: { type: Boolean, default: false }, //can't delete
    is_hidden: { type: Boolean, default: false },
});
    // todo: methods
    // todo: make virtual method can_delete() and use is_default and is_holiday there

export default mongoose.model(ModelNames.Calendar, calendarSchema);
