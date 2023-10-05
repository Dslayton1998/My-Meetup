const express = require('express')
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { Venue, Group, Membership } = require('../../db/models');

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
router.put('/:venueId', requireAuth, validateVenue, async (req, res, next) => {
    const user = req.user;

        const { venueId } = req.params;
        const venues = await Venue.findByPk(venueId)
    
    //? Confirm the requested Venue exists
        if(!venues) {
            return res.status(404).json({                                   
                "message": "Venue couldn't be found"
            })
        }
    
//? GET the Group 
    const { groupId } = req.params;
    const group = await Group.findByPk(venues.groupId)
    console.log(group)

    //? Check which members of the group have permission
        const validUser = [];
        const getMembers = await Membership.findAll({
            where: {
                groupId: groupId
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
        })
    
    
    //? Check if user has Authorization('co-host', 'organizer'):
        if(user.id === group.organizerId || validUser.length) {
                
        }
    res.json(venues)
})




module.exports = router;