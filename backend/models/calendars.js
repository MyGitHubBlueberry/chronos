import mongoose from 'mongoose';
import ModelNames from './models';
const { Schema }= mongoose;

const calendarSchema = new Schema({
    title: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: ModelNames.User,
        required: true,
    },
    description: String | Node,
    color: String,
    created_at: Date,
    updated_at: Date,
}, {
    // methods
});

export default mongoose.model(ModelNames.Calendar, calendarSchema);
