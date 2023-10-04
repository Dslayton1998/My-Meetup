const express = require('express')
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { Group } = require('../../db/models');

const router = express.Router();


// CODE HERE 
router.get('/', async (req,res,next) => {
    const groups = await Group.findAll()
    res.json({Groups:groups})
})


module.exports = router;