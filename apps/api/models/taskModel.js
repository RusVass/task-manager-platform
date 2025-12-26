import mongoose from 'mongoose';

const taskSchema = mongoose.Schema({
    title: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    dueDate: {
        type: Date,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
