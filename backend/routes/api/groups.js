const express = require('express')
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { Group } = require('../../db/models');

//? Validating Group Request Body (& middleware)
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth.js');
const validateGroups = [ //*https://express-validator.github.io/docs/api/validation-chain/
    check('name')
      .exists({ checkFalsy: true })
      .withMessage('A name is required.')
      .isLength({ min: 1, max: 60 })
      .withMessage("Name must be 60 characters or less"),
    check('about')
      .exists({ checkFalsy: true })
      .withMessage('Please tell us a little about this group.')
      .isLength({ min: 50})
      .withMessage("About must be 50 characters or more"),
    check('type')
      .exists({ checkFalsy: true })
      .withMessage('A type is required.')
      .isIn(['Online','In person'])
      .withMessage("Type must be 'Online' or 'In person'"),
    check('private')
      .exists({ checkFalsy: true })
      .withMessage('A private status is required')
      .isBoolean()
      .withMessage("Private must be a boolean"),
    check('city')
      .exists({ checkFalsy: true })
      .withMessage('City is required'),
    check('state')
      .exists({ checkFalsy: true })
      .withMessage('State is required'),
   handleValidationErrors
  ];

const router = express.Router();


// CODE HERE 

//* CREATE A GROUP
router.post('/', validateGroups, requireAuth, async (req, res, next) => {
    const { name, about, type, private, city, state } = req.body;
    const organizer = req.user
    const NewGroup = await Group.create({
        organizerId: organizer.id,
        name,
        about,
        type,
        city,
        private,
        state})
    res.statusCode = 201
    res.json(NewGroup)
})


//* GET ALL GROUPS
router.get('/', async (req,res,next) => {
    const groups = await Group.findAll()
    res.json({Groups:groups})
})


module.exports = router;