/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: The user's username
 *         email:
 *           type: string
 *           description: The user's email
 *         password:
 *           type: string
 *           description: The user's password
 *       required:
 *         - username
 *         - email
 *         - password
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Sign up a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Username or Email already exists
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email
 *               password:
 *                 type: string
 *                 description: The user's password
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 token:
 *                   type: string
 *                   description: JWT token
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Generate a verification token for email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email for verification
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Verification token generated successfully
 *       404:
 *         description: Email not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /auth/verification-otp:
 *   post:
 *     summary: Verify OTP with token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *                 description: The OTP sent to the user
 *               forgotpasswordtoken:
 *                 type: string
 *                 description: The forgot password token
 *             required:
 *               - otp
 *               - forgotpasswordtoken
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid token or OTP
 *       401:
 *         description: Token expired. Please request a new OTP.
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /auth/reset-password:
 *   put:
 *     summary: Reset password using an OTP token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 description: The new password for the user
 *               otpToken:
 *                 type: string
 *                 description: The OTP token for verification
 *             required:
 *               - newPassword
 *               - otpToken
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Token has expired or new password missing
 *       404:
 *         description: Invalid OTP token
 *       500:
 *         description: Server error
 */

const express = require('express');
const { signup, login, forgotpassword, verificationOtp, resetpassword } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotpassword);
router.post('/verification-otp', verificationOtp);
router.put('/reset-password', resetpassword);

module.exports = router;
