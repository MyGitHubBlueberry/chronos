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

inviteSchema.index({ calendar: 1 });

const Invite = mongoose.model(ModelNames.Invite, inviteSchema);

const invitationSchema = new Schema({
    // set when registered
    invited_user: { type: Schema.Types.ObjectId, ref: ModelNames.User },
    // set when not registered yet
    invited_email: String,

    // invite to event only if set
    event: { type: Schema.Types.ObjectId, ref: ModelNames.Event },

    status: { type: String, enum: ['pending', 'accepted', 'declined', 'expired'], default: 'pending' },

    expires_at: Date,
});

invitationSchema.index({ event: 1 });

const Invitation = Invite.discriminator(InviteTypes.Invitation, invitationSchema);

const JoinLink = Invite.discriminator(InviteTypes.JoinLink, new Schema({
    expires_at: { type: Date, required: true },
}));

export default Invite;
export { Invitation, JoinLink };
