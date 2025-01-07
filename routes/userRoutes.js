/**
 * @swagger
 * tags:
 *   name: User
 *   description: User authentication and management operations
 */

/**
 * @swagger
 * /user/details:
 *   get:
 *     summary: Get user details
 *     description: Retrieves the details of the authenticated user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User details retrieved successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                       example: john_doe
 *                     email:
 *                       type: string
 *                       example: john@example.com
 *                     mobile:
 *                       type: string
 *                       example: '1234567890'
 *                     pincode:
 *                       type: string
 *                       example: '123456'
 *       401:
 *         description: Unauthorized - Invalid or expired token
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /user/update:
 *   put:
 *     summary: Update user details
 *     description: Update the mobile number and pincode of the authenticated user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobile:
 *                 type: string
 *                 example: '9876543210'
 *               pincode:
 *                 type: string
 *                 example: '654321'
 *     responses:
 *       200:
 *         description: User details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User details updated successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                       example: john_doe
 *                     email:
 *                       type: string
 *                       example: john@example.com
 *                     mobile:
 *                       type: string
 *                       example: '9876543210'
 *                     pincode:
 *                       type: string
 *                       example: '654321'
 *       400:
 *         description: Missing mobile or pincode
 *       401:
 *         description: Unauthorized - Invalid or expired token
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /user/delete:
 *   delete:
 *     summary: Delete user account
 *     description: Deletes the authenticated user's account
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User account deleted successfully
 *       401:
 *         description: Unauthorized - Invalid or expired token
 *       404:
 *         description: User not found
 */

const express = require('express');

const { authenticate, getUserDetails,updateUserDetails,deleteUser } = require('../controllers/userController');

const router = express.Router();

router.get('/user/details', authenticate, getUserDetails);
router.put('/user/update', authenticate, updateUserDetails);
router.delete('/user/delete', authenticate, deleteUser);

module.exports = router;
