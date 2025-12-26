import Task from '../models/taskModel.js';

export const createTask = async (req, res) => {
    try {
        const { title, description, dueDate } = req.body;
        const userId = req.user.id;

        const normalizedTitle = title?.trim();
        const normalizedDescription = description?.trim();
        const parsedDueDate = dueDate ? new Date(dueDate) : undefined;
        const normalizedDueDate =
            parsedDueDate && !Number.isNaN(parsedDueDate.getTime()) ? parsedDueDate : undefined;

        if (!normalizedTitle && !normalizedDescription) {
            return res.status(400).json({ message: 'Provide a title or description' });
        }

        const task = await Task.create({
            title: normalizedTitle,
            description: normalizedDescription ?? normalizedTitle,
            dueDate: normalizedDueDate,
            completed: false,
            createBy: userId,
        });

        return res.status(201).json(task);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Failed to create the task' });
    }
};

export const updateTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const userId = req.user.id;

        const task = await Task.findOneAndUpdate(
            { _id: taskId, createBy: userId },
            req.body,
            { new: true, runValidators: true }
        );

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        return res.status(200).json(task);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Failed to update the task' });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const userId = req.user.id;

        const task = await Task.findOneAndDelete({
            _id: taskId,
            createBy: userId,
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        return res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Failed to delete the task' });
    }
};

export const getTasksByUserId = async (req, res) => {
    try {
        const userId = req.user.id;

        const tasks = await Task.find({ createBy: userId });

        return res.status(200).json(tasks);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Failed to find all tasks' });
    }
};

export const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        return res.status(200).json(tasks);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Failed to find all tasks' });
    }
};

export const getTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const userId = req.user.id;

        const task = await Task.findOne({ _id: taskId, createBy: userId });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        return res.status(200).json(task);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Failed to get the task' });
    }
};
