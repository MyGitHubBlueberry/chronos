import mongoose from 'mongoose';
const { Schema } = mongoose;

import ModelNames from './modelNames.js';

const categorySchema = new Schema({
    calendar: { type: Schema.Types.ObjectId, ref: ModelNames.Calendar, required: true },
    title: { type: String, required: true },
    color: String,
});

categorySchema.index({ calendar: 1, title: 1 }, { unique: true });

export default mongoose.model(ModelNames.Category, categorySchema);
