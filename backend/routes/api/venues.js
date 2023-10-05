const express = require('express')
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { Venue } = require('../../db/models');

//? Validating Venue Request Body (& middleware)
const { requireAuth } = require('../../utils/auth.js');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const validateVenue = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Street address required'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage("requires a City"),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage("requires a State"),
    check('lat')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a latitude')
        .isDecimal()
        .withMessage("Not a valid latitude"),
    check('lng')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a longitude')
        .isDecimal()
        .withMessage("Not a valid longitude"),
    handleValidationErrors
]

const router = express.Router();

// CODE GOES HERE





module.exports = router;