import { Router, Response } from 'express';
import { authenticateToken, AuthenticatedRequest } from '../middleware/authMiddleware';
import { Task } from '../models/Task';

const router = Router();

// 1. Get All Tasks
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tasks = await Task.find({ userId: req.user?.id }).sort({ dueDate: 1 });
    return res.json(tasks);
  } catch (err) {
    return res.status(500).json({ message: 'Server error: ' + (err as Error).message });
  }
});

// 2. Create Custom Assignment or Task
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, description, dueDate, subjectName, priority } = req.body;
    
    if (!title || !dueDate) {
      return res.status(400).json({ message: 'Title and due date are required.' });
    }

    const newTask = new Task({
      userId: req.user?.id,
      title,
      description,
      dueDate: new Date(dueDate),
      subjectName: subjectName || 'General',
      priority: priority || 'medium'
    });

    await newTask.save();
    return res.status(201).json(newTask);
  } catch (err) {
    return res.status(500).json({ message: 'Server error: ' + (err as Error).message });
  }
});

// 3. Update Task Status or Details
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, description, dueDate, subjectName, status, priority } = req.body;
    
    const task = await Task.findOne({ _id: req.params.id, userId: req.user?.id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (dueDate) task.dueDate = new Date(dueDate);
    if (subjectName) task.subjectName = subjectName;
    if (status) task.status = status;
    if (priority) task.priority = priority;

    await task.save();
    return res.json(task);
  } catch (err) {
    return res.status(500).json({ message: 'Server error: ' + (err as Error).message });
  }
});

// 4. Delete Task
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user?.id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }
    return res.json({ message: 'Task deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error: ' + (err as Error).message });
  }
});

export default router;
