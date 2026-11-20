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

calendarSchema.methods.is_delitable = function() {
    return !this.is_default && !this.is_holiday;
}

calendarSchema.pre('findOneAndDelete', async function () {
    const calendar = await this.model.findOne(this.getFilter());
    if (!calendar) return;

    const Event = mongoose.model(ModelNames.Event);
    const events = await Event.find({ calendar: calendar._id }, '_id');
    await mongoose.model(ModelNames.EventModification).deleteMany({ event: { $in: events.map((e) => e._id) } });
    await Event.deleteMany({ calendar: calendar._id });
    await mongoose.model(ModelNames.Category).deleteMany({ calendar: calendar._id });
    await mongoose.model(ModelNames.Invitation).deleteMany({ calendar: calendar._id });
});

export default mongoose.model(ModelNames.Calendar, calendarSchema);
