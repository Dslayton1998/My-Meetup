const express = require('express')
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { Group, User } = require('../../db/models');

const router = express.Router();


// CODE HERE 
router.get('/', async (req,res,next) => {
    const groups = await Group.findAll({
    })
})

res.json(groups)

module.exports = router;