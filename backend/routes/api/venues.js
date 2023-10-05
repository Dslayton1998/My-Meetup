const express = require('express')
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { Venue, Group, Membership, User } = require('../../db/models');

//? Validating Venue Request Body (& middleware)
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth.js');
const validateVenue = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage("City is required"),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage("State is required"),
    check('lat')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a latitude')
        .isDecimal()
        .withMessage("Latitude is not valid"),
    check('lng')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a longitude')
        .isDecimal()
        .withMessage("Longitude is not valid"),
    handleValidationErrors
    ];

const router = express.Router();

// CODE GOES HERE
router.put('/:venueId', requireAuth, validateVenue, async (req, res, next) => {
    const { address, city, state, lat, lng } = req.body

    const { venueId } = req.params;
    const venue = await Venue.findByPk(venueId);

//? Confirm the requested Group exists
        if(!venue) {
            return res.status(404).json({
                "message": "Venue couldn't be found"
            })
        }

//? Require Authentication: Current User must be the organizer of the group or, co-host
    const user = req.user;
    const group = await Group.findByPk(venue.groupId);


//? Check which members of the group have permission
    const validUser = [];
    const getMembers = await Membership.findAll({
        where: {
            groupId: group.id
        }
    });
    const members = getMembers.map((member) => {
        const arr = member.toJSON();
        return arr
        //* Array of Memberships objects
    });
    members.forEach(member => {
        if(member.status === 'co-host' && user.id === member.userId) {
            validUser.push(member)
        }
    });


//? Check if user has Authorization('co-host', 'organizer'):
    if(user.id === group.organizerId || validUser.length) {
        const update = await venue.update({
            address,
            city,
            state, 
            lat,
            lng
        })

        const resObj = {
            id: update.id,
            groupId: group.id, 
            address,
            city,
            state,
            lat,
            lng
        };

        res.json(resObj)

    } else {
        return res.status(403).json({
            "error": "Authorization required",
            "message": "Only group organizer (or co-host) is authorized to do that"
        })
    }

})




module.exports = router;