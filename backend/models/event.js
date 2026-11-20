import mongoose from 'mongoose';
const { Schema } = mongoose;

import ModelNames from './modelNames.js';
import EventTypes from './eventTypes.js';

const weekdayOrdinals = ['first', 'second', 'third', 'fourth', 'fifth', 'last'];

const recurrenceSchema = new Schema({
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly'], required: true },
    interval: { type: Number, default: 1, min: 1 },

    weekly: {
        days_of_week: [{ type: Number, min: 0, max: 6 }],
    },

    monthly: {
        mode: { type: String, enum: ['day_of_month', 'weekday_ordinal'] },
        day_of_month: { type: Number, min: 1, max: 31 },
        is_last_day_of_month: Boolean, // overrides day_of_month when true
        // 'weekday_ordinal'
        ordinal: { type: String, enum: weekdayOrdinals },
        days_of_week: [{ type: Number, min: 0, max: 6 }],
    },

    yearly: {
        mode: { type: String, enum: ['date', 'weekday_ordinal'] },
        month: { type: Number, min: 1, max: 12 },
        // 'date'
        day_of_month: { type: Number, min: 1, max: 31 },

        // 'weekday_ordinal'
        ordinal: { type: String, enum: weekdayOrdinals },
        weekday: { type: Number, min: 0, max: 6 },
    },

    end: {
        mode: { type: String, enum: ['never', 'count', 'until'], default: 'never' },
        count: Number,
        until_at: Date,
    },
}, { _id: false });

const eventSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    calendar: { type: Schema.Types.ObjectId, ref: ModelNames.Calendar, required: true },
    author: { type: Schema.Types.ObjectId, ref: ModelNames.User, required: true },
    start_at: { type: Date, required: true },
    end_at: Date,
    is_all_day: { type: Boolean, default: false },
    color: String,
    category: { type: Schema.Types.ObjectId, ref: ModelNames.Category },
    recurrence: recurrenceSchema,
    attendees: [{ type: Schema.Types.ObjectId, ref: ModelNames.User, required: true }],
}, { discriminatorKey: 'type' });

eventSchema.index({ calendar: 1, start_at: 1 });

eventSchema.pre('findOneAndDelete', async function () {
    const event = await this.model.findOne(this.getFilter());
    if (!event) return;

    await mongoose.model(ModelNames.EventModification).deleteMany({ event: event._id });
    await mongoose.model(ModelNames.Invitation).deleteMany({ event: event._id });
});

const Event = mongoose.model(ModelNames.Event, eventSchema);

const Arrangement = Event.discriminator(EventTypes.Arrangement, new Schema({
    duration_minutes: Number, // used to compute end_at when the user doesn't supply one
}));

const Task = Event.discriminator(EventTypes.Task, new Schema({
    is_done: { type: Boolean, default: false },
}));

const Reminder = Event.discriminator(EventTypes.Reminder, new Schema({
    related_event: { type: Schema.Types.ObjectId, ref: ModelNames.Event },
    anchor: {
        type: String,
        enum: ['before_start', 'after_start', 'before_end', 'after_end', 'absolute'],
        default: 'absolute', //absolute for start and end; other for offset.
    },
    offset: Number,
    offset_unit: {
        type: String,
        enum: ['minutes', 'hours', 'days'],
    },
    last_notified_at: Date,
}));

export default Event;
export { Arrangement, Reminder, Task };
