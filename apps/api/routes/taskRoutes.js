import express from 'express';
import * as taskController from '../controllers/taskController.js';
import checkAuth from '../middlewares/checkAuth.js';
import { requireRole } from '../middlewares/roleMiddleware.js';

const router = express.Router();

/**
 * @openapi
 * '/api/tasks':
 *  post:
 *     tags:
 *     - Task
 *     summary: Create a task
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              description:
 *                type: string
 *                default: Buy a book
 *     responses:
 *      201:
 *        description: Created
 *      400:
 *        description: Bad Request
 */

router.post('/tasks', checkAuth, taskController.createTask);

/**
 * @openapi
 * '/api/tasks/my':
 *  get:
 *     tags:
 *     - Task
 *     summary: Get current user tasks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                  description:
 *                    type: string
 *                  completed:
 *                    type: boolean
 *                  createdBy:
 *                    type: string
 *       400:
 *         description: Bad request
 */
router.get('/tasks/my', checkAuth, taskController.getTasksByUserId);
router.get('/tasks/:id', checkAuth, taskController.getTask);
router.put('/tasks/:id', checkAuth, taskController.updateTask);
router.delete('/tasks/:id', checkAuth, taskController.deleteTask);
router.get('/tasks', checkAuth, requireRole('admin'), taskController.getAllTasks);

export default router;
