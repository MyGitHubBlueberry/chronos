import mongoose from 'mongoose';
const { Schema } = mongoose;

import ModelNames from './modelNames.js';

const userSchema = new Schema({
    display_name: { type: String, required: true },
    login: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    country_code: String,
    profile_picture_url: String,
}, {
    //methods
});

export default mongoose.model(ModelNames.User, userSchema);
