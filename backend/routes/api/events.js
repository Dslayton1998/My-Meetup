const express = require('express')
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { Event, Group, Venue, EventImage  } = require('../../db/models');

//? Validating Group Request Body (& middleware)
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth.js');
const event = require('../../db/models/event');
const validateEvents = [];

const router = express.Router();

// CODE GOES HERE

//* GET ALL EVENTS ********NEEDS WORK
router.get('/', async (req, res, next) => { 
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
    const event = getEvents.map((event) => {
        const arr = event.toJSON();
        return arr
    });



//!!!! CAN POSSIBLY MAKE APART OF ORIGINAL QUERY (alias?)
    for(let i = 0; i < getEvents.length; i++) {
        const image = await getEvents[i].getEventImages()


        const attendees = await getEvents[i].getAttendances({
            where:{
                status: 'Attending'
            }
        });

        event[i].numAttending = attendees.length;
        if(image.length) {
            event[i].previewImage = image[0].url
        } else {event[i].previewImage = null}
    }
//!!!! PLUS THE ORDER IN RES BUGGGGGSSSS ME

    res.json({"Events": event})
});



//* GET DETAILS OF EVENT BY ITS ID
router.get('/:eventId', async (req, res, next) => {
    const { eventId } = req.params;
    const getEvents = await Event.findAll({
        where: {
            id: req.params.eventId,
        },
            include: [
                {
                    model: Group,
                    attributes: ["id", "name", "private", "city", "state"]
                },
                {
                    model: Venue,
                    attributes: ["id", "address", "city", "state", "lat", "lng"]
                },
                {
                    model: EventImage,
                    attributes: ["id", "url", "preview"]
                }
            ],
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            }
    });

    if(!getEvents) {
        return res.status(404).json({
            "message": "Event couldn't be found"
        })
    }

    const event = getEvents.map((event) => {
        const arr = event.toJSON();
        return arr
    });
    
    for(let i = 0; i < getEvents.length; i++) {
        const attendees = await getEvents[i].getAttendances({
            where:{
                status: 'Attending'
            }
        });
        event[i].numAttending = attendees.length;
    }

    res.json(event[0])
});

module.exports = router;