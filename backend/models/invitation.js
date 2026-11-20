import mongoose from 'mongoose';
const { Schema } = mongoose;

import ModelNames from './modelNames.js';

const invitationSchema = new Schema({
    calendar: { type: Schema.Types.ObjectId, ref: ModelNames.Calendar, required: true },
    // invite only to event if set
    event: { type: Schema.Types.ObjectId, ref: ModelNames.Event },

    created_by: { type: Schema.Types.ObjectId, ref: ModelNames.User, required: true },

    invited_user: { type: Schema.Types.ObjectId, ref: ModelNames.User },
    //when inviting unregistered users
    invited_email: String,

    status: { type: String, enum: ['pending', 'accepted', 'declined', 'expired'], default: 'pending' },

    token_hash: { type: String, unique: true, sparse: true },
    expires_at: Date,

    created_at: { type: Date, default: Date.now },
});

invitationSchema.index({ calendar: 1 });
invitationSchema.index({ event: 1 });
invitationSchema.index({ invited_user: 1, status: 1 });

export default mongoose.model(ModelNames.Invitation, invitationSchema);
