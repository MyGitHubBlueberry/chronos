import mongoose from 'mongoose';
const { Schema } = mongoose;

import ModelNames from './modelNames.js';

const refreshTokenSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: ModelNames.User, required: true },
    token_hash: { type: String, required: true },
    expires_at: { type: Date, required: true },
    revoked: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
});

export default mongoose.model(ModelNames.RefreshToken, refreshTokenSchema);
