

const express = require('express');

const { authenticate, getUserDetails,updateUserDetails,deleteUser ,isAdmin, getAllUsers} = require('../controllers/userDetailsController');

const router = express.Router();


/**
 * @swagger
 * /user/details:
 *   get:
 *     summary: Get user details
 *     description: Retrieves the details of the authenticated user.
 *     tags:
 *       - User Details
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
 *                 userDetails:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     email:
 *                       type: string
 *                     mobile:
 *                       type: string
 *                     pincode:
 *                       type: string
 *                     address:
 *                       type: string
 *       401:
 *         description: Authorization token missing or invalid
 *       404:
 *         description: User or user details not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /user/update/{userId}:
 *   put:
 *     summary: Update user details
 *     description: Updates the user's details (mobile, pincode, address).
 *     tags:
 *       - User Details
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to update
 *       - in: body
 *         name: userDetails
 *         description: The user details to update
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             mobile:
 *               type: string
 *             pincode:
 *               type: string
 *             address:
 *               type: string
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
 *                 userDetails:
 *                   type: object
 *       400:
 *         description: At least one field is required to update
 *       404:
 *         description: User details not found
 *       403:
 *         description: Access denied. Admins only
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /user/delete:
 *   delete:
 *     summary: Delete user account and details
 *     description: Deletes the authenticated user's account and associated details.
 *     tags:
 *       - User Details
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User account and details deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */


router.get('/user/details', authenticate, getUserDetails);

router.get('/all-user-details', authenticate,isAdmin ,getAllUsers);
// router.put('/user/update', authenticate, updateUserDetails);
router.put('/user/update/:userId', authenticate, isAdmin, updateUserDetails);

router.delete('/user/delete', authenticate,isAdmin, deleteUser);

module.exports = router;
