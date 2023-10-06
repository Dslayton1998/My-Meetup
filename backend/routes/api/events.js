const express = require('express')
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { Event, Group, Venue, EventImage, Membership  } = require('../../db/models');

//? Validating Group Request Body (& middleware)
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth.js');
const event = require('../../db/models/event');
const validateEvents = [
    check('venueId')
        .custom(async val => {
            if(val === null) return true

            const venue = await Venue.findByPk(val)
            if(!venue) {
                throw new Error("Venue does not exist")
            } else return true
        }),
    check('name')
        .exists({ checkFalsy: true })
        .withMessage("Please provide a name")
        .isLength({ min: 5})
        .withMessage("Name must be at least 5 characters"),
    check('type')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a type.')
        .isIn(['Online','In person'])
        .withMessage("Type must be 'Online' or 'In person'"),
    check('capacity')
        .exists({ checkFalsy: true })
        .withMessage('Please specify a capacity')
        .isInt()
        .withMessage("Capacity must be an integer"),
    check('price')
        .exists({ checkFalsy: true })
        .withMessage('Please include a price')
        .isDecimal()
        .withMessage("Price is invalid"),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage("Description is required"),
    check('startDate')
        .exists({ checkFalsy: true })
        .withMessage("starting date is required")
        .isAfter(new Date().toLocaleDateString())
        .withMessage("startDate must be in the future"),
    check('endDate')
        .exists({ checkFalsy: true })
        .isAfter(this.startDate)
        .withMessage("End date is less than start date"),
    handleValidationErrors
]

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


//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! COME BACK TO IT
router.post('/:eventId/images', requireAuth, async (req, res, next) => {
    const user = req.user;
    const { url, preview } = req.body;
    const { eventId } = req.params;
    const event = await Event.findByPk(eventId);

    if(!event){
        return res.status(404).json({
            message: "Event couldn't be found"
        })
    }

    const group = await event.getGroup();

    const membership = await group.getMemberships({
      where:{
        userId: user.id
      }
    });
    
    const attendance = await event.getAttendances({
      where:{
        userId: user.id
      }
    });
//! REQUIRES FUTURE TESTING !!!!!!!!!
    if(membership.length) {
        if(membership[0].status === "co-host" || user.id === group.organizerId || attendance[0].status === "Attending") {
            const newEventImg = await EventImage.create({ url, preview });
            const resObj = {};
            resObj.id = newEventImg.id
            resObj.url = newEventImg.url
            resObj.preview = newEventImg.preview
            res.json(resObj)
        } else {
            return res.status(403).json({
                "error": "Authorization required",
                message: "Only group organizer, or co-host, is authorized to do that"
            })
        }
    } else {
        return res.status(403).json({
            message: "Must be a group member to do this."
        })
    }

})



router.put('/:eventId', requireAuth, validateEvents, async (req, res, next) => {
    const user = req.user
    const { eventId } = req.params;
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;
    const venue = await Venue.findByPk(venueId);
    const event = await Event.findByPk(eventId)

    if(!venue) {
        return res.status(404).json({
            message: "Venue couldn't be found"
        })
    }

    if(!event) {
          return res.status(404).json({
            message: "Event couldn't be found"
        })
    }

    const group = await Group.findAll({
        where: {
            id: event.groupId
        }
    });
    const organizer = group.forEach(ele => {
        const arr = ele.toJSON();
        return arr
    });
    console.log(organizer)

    const member = await Membership.findAll({
        where: {
            status: "co-host"
        }
    })


    

})



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