import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStats
} from '../controllers/user.controller.js';

const router = express.Router();




router.post('/', createUser);

router.get('/', getAllUsers);

// Get user by ID
router.get('/:id', getUserById);

// Update user ( or user updating own profile)
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.get('/stats', getUserStats);

export default router;