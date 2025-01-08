
const express = require('express');

const { authenticate, getUserDetails,updateUserDetails,deleteUser } = require('../controllers/userDetailsController');

const router = express.Router();

router.get('/user/details', authenticate, getUserDetails);
router.put('/user/update', authenticate, updateUserDetails);
router.delete('/user/delete', authenticate, deleteUser);

module.exports = router;
