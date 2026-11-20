import mongoose from 'mongoose';
const { Schema } = mongoose;

import ModelNames from './modelNames.js';

const eventModificationSchema = new Schema({
    event: { type: Schema.Types.ObjectId, ref: ModelNames.Event, required: true },
    // the parent's unmodified start_at
    occurrence_start_at: { type: Date, required: true },

    is_cancelled: { type: Boolean, default: false },

    // overwrites
    title: String,
    description: String,
    start_at: Date,
    end_at: Date,
    color: String,
    category: { type: Schema.Types.ObjectId, ref: ModelNames.Category },
});

eventModificationSchema.index({ event: 1, occurrence_start_at: 1 }, { unique: true });

export default mongoose.model(ModelNames.EventModification, eventModificationSchema);
