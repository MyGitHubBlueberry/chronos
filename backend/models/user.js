import mongoose from 'mongoose';
const { Schema } = mongoose;

import ModelNames from './modelNames.js';

//todo: maybe add validator functions
const userSchema = new Schema({
    display_name: { type: String, required: true },
    login: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    is_email_confirmed: { type: Boolean, default: false },
    email_verification_token: { type: String, default: null },
    password_reset_token: { type: String, default: null },
    password_reset_token_expires: { type: Date, default: null },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },

    country_code: String,
    timezone: String,
    profile_picture_url: String,
});

userSchema.pre('findOneAndDelete', async function() {
    const user = await this.model.findOne(this.getFilter());
    if (!user) return;

    const Calendar = mongoose.model(ModelNames.Calendar);
    const Event = mongoose.model(ModelNames.Event);
    const EventModification = mongoose.model(ModelNames.EventModification);

    const ownedCalendars = await Calendar.find({ owner: user._id }, '_id');
    const ownedCalendarIds = ownedCalendars.map((c) => c._id);

    if (ownedCalendarIds.length) {
        const ownedEvents = await Event.find({ calendar: { $in: ownedCalendarIds } }, '_id');
        await EventModification.deleteMany({ event: { $in: ownedEvents.map((e) => e._id) } });
        await Event.deleteMany({ calendar: { $in: ownedCalendarIds } });
        await mongoose.model(ModelNames.Category).deleteMany({ calendar: { $in: ownedCalendarIds } });
        await mongoose.model(ModelNames.Invitation).deleteMany({ calendar: { $in: ownedCalendarIds } });
        await Calendar.deleteMany({ _id: { $in: ownedCalendarIds } });
    }

    const authoredElsewhere = await Event.find({ author: user._id }, '_id');
    await EventModification.deleteMany({ event: { $in: authoredElsewhere.map((e) => e._id) } });
    await Event.deleteMany({ author: user._id });

    await Calendar.updateMany({ 'members.user': user._id }, { $pull: { members: { user: user._id } } });
    await Event.updateMany({ attendees: user._id }, { $pull: { attendees: user._id } });

    await mongoose.model(ModelNames.Invitation).deleteMany({ created_by: user._id });
});

export default mongoose.model(ModelNames.User, userSchema);
