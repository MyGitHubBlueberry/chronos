import mongoose from 'mongoose';
const { Schema } = mongoose;

import ModelNames from './modelNames.js';
import InviteTypes from './inviteTypes.js';

const inviteSchema = new Schema({
    calendar: { type: Schema.Types.ObjectId, ref: ModelNames.Calendar, required: true },
    created_by: { type: Schema.Types.ObjectId, ref: ModelNames.User, required: true },

    token_hash: { type: String, unique: true, sparse: true }, // click-link redemption
    code_hash: { type: String, unique: true, sparse: true },  // type-it-in redemption

    created_at: { type: Date, default: Date.now },
}, { discriminatorKey: 'type' });

const Invite = mongoose.model(ModelNames.Invite, inviteSchema);

const Invitation = Invite.discriminator(InviteTypes.Invitation, new Schema({
    // set when registered
    invited_user: { type: Schema.Types.ObjectId, ref: ModelNames.User },
    // set when not registered yet
    invited_email: String,

    status: { type: String, enum: ['pending', 'accepted', 'declined', 'expired'], default: 'pending' },

    expires_at: Date,
}));

const JoinLink = Invite.discriminator(InviteTypes.JoinLink, new Schema({
    expires_at: { type: Date, required: true }, // shareable links must expire
}));

export default Invite;
export { Invitation, JoinLink };
