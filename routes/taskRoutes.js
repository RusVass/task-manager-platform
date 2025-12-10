import express from 'express';
import * as taskController from '../controllers/taskController.js';
import checkAuth from '../middlewares/checkAuth.js';
import { requireRole } from '../middlewares/roleMiddleware.js';

const router = express.Router();

/**
 * @openapi
 * '/api/task':
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

router.post('/task', checkAuth, taskController.createTask);

/**
 * @openapi
 * '/api/task/my':
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
router.get('/task/my', checkAuth, taskController.getTasksByUserId);
router.get('/task/:id', checkAuth, taskController.getTask);
router.put('/task/:id', checkAuth, taskController.updateTask);
router.delete('/task/:id', checkAuth, taskController.deleteTask);
router.get('/task', checkAuth, requireRole('admin'), taskController.getAllTasks);

export default router;
