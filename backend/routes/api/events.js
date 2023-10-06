const express = require('express')
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { Event, Group, Venue, Attendance } = require('../../db/models');

//? Validating Group Request Body (& middleware)
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth.js');
const event = require('../../db/models/event');
const validateEvents = [];

const router = express.Router();

// CODE GOES HERE

//* GET ALL EVENTS ********NEEDS WORK
router.get('/', async (req, res, next) => { //!!!!!!!! THE POWER OF QUERYS!!!!!!! 
    const getEvents = await Event.findAll({
        include: [
            {
                model: Group,
                attributes: ['id', 'name', 'city', 'state']
            },
            {
                model: Venue,
                attributes: ['id', 'city', 'state']
            }
        ],
        attributes:{
            exclude: ["createdAt", "updatedAt"]
        }
    });
    const events = getEvents.map((event) => {
        const arr = event.toJSON();
        return arr
    });



//!!!! CAN POSSIBLY MAKE APART OF ORIGINAL QUERY (alias?)
    for(let i = 0; i < getEvents.length; i++) {
        const image = await getEvents[i].getEventImages()


        const attendances = await getEvents[i].getAttendances({
            where:{
                status: 'Attending'
            }
        });
        events[i].numAttending = attendances.length
        if(image.length === 0){
            events[i].previewImage = null
        } else {
            events[i].previewImage = image[0].url
        }
    }
//!!!! PLUS THE ORDER IN RES BUGGGGGSSSS ME

    res.json({"Events": events})
})

module.exports = router;