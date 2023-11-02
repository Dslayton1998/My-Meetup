const express = require('express')
// const { Op } = require('sequelize');
// const bcrypt = require('bcryptjs');
const { Event, Group, Venue, EventImage, Membership, Attendance, User  } = require('../../db/models');

//? Validating Group Request Body (& middleware)
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth.js');
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
const validateQuery = [
    check('page')
        .custom(value =>{
            if(!value) {
                return true 
            };

            if (value > 0) {
                return true 
            };

            return false;
        })
        .withMessage('Page must be greater than or equal to 1')
        .custom(value =>{
            if(!value) {
                return true 
            };

            if (isNaN(value)) {
                return false
            } else return true;
        })
        .withMessage('Page must be a integer'),
    check('size')
        .custom(value =>{
            if(!value) {
                return true 
            };

            if (value > 0) {
                return true
            }; 

            return false;
            })
        .withMessage('Page must be greater than or equal to 1')
        .custom(value =>{
            if(!value) {
                return true 
            }; 

            if (isNaN(value)) {
                return false
            } else return true;
        })
        .withMessage('Page must be a integer'),
    check('name')
        .custom(value =>{
            if(!value) {
                return true 
            };

            if (isNaN(value)) {
                return true
            } else return false;
        }) 
        .withMessage('Name must be a string'),
    check('type')
    .custom(value =>{
        if(!value) {
            return true 
        };

        if (value === 'Online' || value === 'In person') {
            return true
        } else return false;
    }) 
        .withMessage("Type must be 'Online' or 'In person'"),
    check('startDate')
    .custom(value =>{
        if(!value) {
            return true
        }; 

        // if(typeof val !== "string") {
        //     return false
        // };

        if (isNaN(new Date(value).getTime())) {
            return false
        };

        return true;
    }) 
        .withMessage("Start date must be a valid datetime"),

    handleValidationErrors
]

const router = express.Router();

//! GET's START
//* GET ALL EVENTS 
router.get('/', validateQuery, async (req, res, next) => { 
                                                                //* Query Filters * \\
    let { page, size, name, type, startDate } = req.query;
    const whereObj = {};
    // name: string, optional
    if(name) {
        whereObj.name = name
    };
    // type: string, optional
    if(type) {
        whereObj.type = type
    };
    // startDate: string, optional
    if(startDate) {
        whereObj.startDate = startDate
    };

                                                                //* Pagination * \\
const pagination = {};
    if(!size) {
        size = 20
    };
    if(size > 20) {
        size = 20
    };

    if(!page) {
        page = 1
    };
    if(page > 10) {
        page = 10
    };
    pagination.limit = size;
    pagination.offset = size * (page - 1);


                                                        //* Getting All Events (plus format res) * \\
    const getEvents = await Event.findAll({
        where: {...whereObj},
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
            exclude: ["createdAt", "updatedAt", "description", "capacity", "price"]
        },
        ...pagination
    });
    const events = getEvents.map((event) => {
        const arr = event.toJSON();
        return arr
    });
    
    for(let i = 0; i < getEvents.length; i++) {
        const image = await getEvents[i].getEventImages()
        const attendees = await getEvents[i].getAttendances({
            where:{
                status: 'attending'
            }
        });

        events[i].numAttending = attendees.length;
        if(image.length) {
            events[i].previewImage = image[0].url
        } else {events[i].previewImage = null}
    }
    return res.json({"Events": events})
});


//* GET ALL ATTENDEES OF EVENT
router.get('/:eventId/attendees', async (req, res, next) => {
//    Successful Response: If you ARE the organizer of the group or a member of the group
//     with a status of "co-host". Shows all attendees including those with a status of "pending".

    const { eventId } = req.params
    const user = req.user

                                                                //* Getting Event (set up for manipulation) * \\
    const getEvent = await Event.findByPk(eventId);
    if(!getEvent) {
        return res.status(404).json({
            "message": "Event couldn't be found"
          })
    }
    const event = getEvent.toJSON(); //* {event} (findByPk)

                                                                //* Get the Group to check member status * \\
    // const getGroup = await Group.findByPk(event.groupId);
    // const group = getGroup.toJSON();
    const getGroups = await getEvent.getGroup();
    const group = getGroups.toJSON();
    // console.log(group)

                                                                //* Check if current user is member with * \\
    const getMembers = await getGroups.getMemberships({
        where: {
            status: 'co-host',
            userId: user.id
        }
    });
    const member = getMembers.map(ele => {
        const arr = ele.toJSON();
        return arr
    });
    // console.log(member) 
    // const getMembers = await Membership.findAll({
    //     where: {
    //         userId: user.id,
    //         groupId: group.id,
    //         status: 'co-host'
    //     }
    // });
                                                                 //* Begin Response * \\
  const resObj = {
    Attendees: []
  };
                                                                //* If current user is organizer or co-host * \\
    if(user.id === group.organizerId || member.length) {
        const getAttendance = await Attendance.findAll({
            where: {
                eventId: eventId
            }
        });
        const attendees = getAttendance.map(ele => {
            const arr = ele.toJSON();
            return arr
        });
        console.log(attendees)

        for(let i = 0; i < attendees.length; i++) {
            const attendeeObj = {};
            const attendee = attendees[i]; //* get status from here
            const statusObj = {status: attendee.status};

            const attendeeInfo = await User.findByPk(attendee.userId);
            const userData = attendeeInfo.toJSON();

            attendeeObj.id = userData.id
            attendeeObj.firstName = userData.firstName
            attendeeObj.lastName = userData.lastName
            attendeeObj.Attendance = statusObj;
            resObj.Attendees.push(attendeeObj)
        }

        return res.json(resObj)

    } else {                                                     //* Everyone else (does not show pending) * \\
        const getAttendance = await Attendance.findAll({
            where: {
            eventId: eventId
        }
    });
        const attendees = getAttendance.map(ele => {
            const arr = ele.toJSON();
            return arr
        });
        const notPending = [];
        // const attendeeObj = {};

        for(let i = 0; i < attendees.length; i++) {
            const attendee = attendees[i]; //* get status from here
            if(attendee.status !== 'pending') {notPending.push(attendee)};
        }

        for(let i = 0; i < notPending.length; i++) {
            const attendeeObj = {};
            const attendee = notPending[i];
            const statusObj = {status: attendee.status};
            const attendeeInfo = await User.findByPk(attendee.userId);
            const userData = attendeeInfo.toJSON();

                attendeeObj.id = userData.id
                attendeeObj.firstName = userData.firstName
                attendeeObj.lastName = userData.lastName
                attendeeObj.Attendance = statusObj;
            
            resObj.Attendees.push(attendeeObj)
        }

        
        return res.json(resObj)
    }
})


//* GET DETAILS OF EVENT BY ITS ID
router.get('/:eventId', async (req, res, next) => {
    const { eventId } = req.params;
    const getEvents = await Event.findAll({
        where: {
            id: eventId,
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

    if(!getEvents.length) {
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
                status: 'attending'
            }
        });
        event[i].numAttending = attendees.length;
    }

    return res.json(event[0])
});



//! POST's START
//* REQUEST TO ATTEND AN EVENT
router.post('/:eventId/attendance', requireAuth, async (req, res, next) => {
    const { eventId } = req.params;
    const user = req.user;
    const getEvent = await Event.findByPk(eventId);
    if(!getEvent) {
        return res.status(404).json({
            "message": "Event couldn't be found"
          })
    }
    const event = getEvent.toJSON();
    const getGroup = await Group.findByPk(event.groupId);
    const group = getGroup.toJSON();
    const getMembers = await Membership.findAll({
        where: {
            userId: user.id,
            groupId: group.id
        }
    });
    const member = getMembers.map(ele => {
        const arr = ele.toJSON();
        return arr
    });


    const getAttendance = await Attendance.findAll({
        where: {
            eventId: event.id,
            userId: user.id
        }
    });
    const attendance = getAttendance.map(ele => {
        const arr = ele.toJSON();
        return arr
    });

    if(!getAttendance.length) {
        if(member.length && member[0].status !== "pending") { //! probs don't need organizer
            const resObj = {};
            const attendanceRequest = await Attendance.create({
                eventId,
                userId: user.id,
                status: "pending"
            });
    
            resObj.userId = attendanceRequest.id //* might not need [0]
            resObj.status = attendanceRequest.status
    
            return res.json(resObj)
        } else {
            return res.status(403).json({
                "error": "Authorization required",
                "message": "Must be a group member to send this request."
            })
        }
    } else {
        if(attendance[0].status === 'pending') {
           return res.status(400).json({
                "message": "Attendance has already been requested"
              })
        }

        if(attendance[0].status === 'attending') {
           return res.status(400).json({
                "message": "User is already an attendee of the event"
              })
        }
    }

})


//* ADD IMAGE TO EVENT
router.post('/:eventId/images', requireAuth, async (req, res, next) => {
    const user = req.user;
    const { url, preview } = req.body;
    const { eventId } = req.params;
    const event = await Event.findByPk(eventId);
    // console.log(user)

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
    // console.log(membership)
    
    const attendance = await event.getAttendances({
      where:{
        userId: user.id
      }
    });
    // const checkUserMem = await Membership.findAll({
    //     where: {
    //         userId: user.id,
    //         groupId: group.id,
    //     }
    // })

    if(membership.length || user.id === group.organizerId) {
        if (user.id === group.organizerId || membership[0].status === "co-host") {
            const newEventImg = await EventImage.create({ eventId, url, preview });
                const resObj = {};
                resObj.id = newEventImg.id
                resObj.url = newEventImg.url
                resObj.preview = newEventImg.preview
                return res.json(resObj)
        };

        if(!attendance.length) {
            return res.status(403).json({
                "error": "Authorization required",
                "message": "Must be a member of this group to perform this action."
            })
        }
//! another conditional to check if attendance 
    if(attendance[0].status === "attending") {
        const newEventImg = await EventImage.create({ eventId, url, preview });
                const resObj = {};
                resObj.id = newEventImg.id
                resObj.url = newEventImg.url
                resObj.preview = newEventImg.preview
                return res.json(resObj)
    } else {
        return res.status(403).json({
            "error": "Authorization required",
            "message": "Must be a member of this group to perform this action."
        })
    }
    }
    return res.status(403).json({
        "error": "Authorization required",
        "message": "Must be a member of this group to perform this action."
    })
})



//! PUT's START
//* CHANGE STATUS OF ATTENDANCE FOR EVENT
router.put('/:eventId/attendance', requireAuth, async (req, res, next) => {
    const user = req.user;
    const { userId, status } = req.body;
    const getUser = await User.findByPk(userId);
    if(!getUser) {
        return res.status(404).json({
            "message": "User with that Id, could not be found"
        })
    }
    const { eventId } = req.params;
    const getEvent = await Event.findByPk(eventId);
    if(!getEvent) {
        return res.status(404).json({
            "message": "Event couldn't be found"
          })
    }
    const event = getEvent.toJSON();
    const getGroup = await Group.findByPk(event.id);
    const group = getGroup.toJSON();
    const getMembers = await Membership.findAll({
        where: {
            userId: user.id,
            groupId: group.id,
            status: "co-host"
        }
    });
    // console.log(getMembers)

    if(status === 'pending') {
        return res.status(400).json({
            "message": "Cannot change an attendance status to pending"
          })
    };

    const getAttendance = await Attendance.findAll({
        where: {
            userId: userId,
            eventId: event.id
        }
    });

    if(!getAttendance.length) {
       return res.status(404).json({
            "message": "Attendance between the user and the event does not exist"
          })
    };
    const attendance = getAttendance.map(ele => {
        const arr = ele.toJSON();
        return arr
    });


    if(getMembers.length || user.id === group.organizerId) {
       const update = await getAttendance[0].update({userId, status});
       const resObj = {
        id: attendance[0].id,
        eventId: event.id,
        userId,
        status
       };

       return res.json(resObj); //! finished here, need to run testing !\\
    } else {
        return res.status(403).json({
            "error": "Authorization required",
            "message": "Must be the owner of this group, or co-host, to perform this action."
        })
    }

});


//* EDIT AN EVENT
router.put('/:eventId', requireAuth, validateEvents, async (req, res, next) => {
    const user = req.user
    const { eventId } = req.params;
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;
//* EVENT
    const events = await Event.findByPk(eventId);
    if(!events) {
        return res.status(404).json({
            message: "Event couldn't be found"
        })
    }
    const event = events.toJSON();

//* GROUP
    const getGroup = await Group.findAll({
        where: {
            id: event.groupId
        }
    });
    
    const group = getGroup.map(ele => {
        const arr = ele.toJSON();
        return arr
    });

//* VENUE    
    const venue = await Venue.findAll({
        where: {
            groupId: group[0].id,
            id: venueId
        }
    });
    if(!venue.length) {
        return res.status(404).json({
            message: "Venue couldn't be found"
        })
    }

//* MEMBERSHIPS
    const getMembers = await Membership.findAll({
        where: {
            status: "co-host",
            groupId: group[0].id
        }
    });
    const members = getMembers.map(ele => {
        const arr = ele.toJSON();
        return arr
    });

        if(user.id === group[0].organizerId || user.id === members[0].userId) {
            const update = await events.update({ venueId, name, type, capacity, price, description, startDate, endDate })
            const resObj = {
                id: update.id,
                groupId: update.groupId,
                venueId: update.venueId,
                name: update.name,
                type: update.type,
                capacity: update.capacity,
                price: update.price,
                description: update.description,
                startDate: update.startDate,
                endDate: update.endDate
            };

            return res.json(resObj);

        } else {
            return res.status(403).json({
                "error": "Authorization required",
                "message": "Only group organizer, or co-host, is authorized to do that"
            })
        }
     
});



//! DELETE's START
//* DELETE ATTENDANCE TO AN EVENT
router.delete('/:eventId/attendance', requireAuth, async (req, res, next) => {
    const user = req.user;
    const { eventId } = req.params;
    const { userId } = req.body;


    const getEvent = await Event.findByPk(eventId);
    if(!getEvent) {
        return res.status(404).json({
            "message": "Event couldn't be found"
          })
    }
    const event = getEvent.toJSON();
    const getGroup = await Group.findByPk(event.groupId);
    if(!getGroup) {
        return res.status(404).json({
            "message": "Group couldn't be found"
          })
    }
    const group = getGroup.toJSON();
    const getMembership = await Membership.findAll({
        where: {
            groupId: group.id,
            userId: userId
        }
    });
    if(!getMembership) {
        return res.status(404).json({
            "message": "Group member couldn't be found"
          })
    }

    const getAttendance = await Attendance.findAll({
        where: {
            userId: userId,
            eventId: event.id
        }
    });

    if(!getAttendance.length) {
        return res.status(404).json({
            "message": "Attendance does not exist for this User"
          })
    }

    if(userId === user.id || user.id === group.organizerId) {
        await getAttendance[0].destroy();

        return res.json({
            "message": "Successfully deleted attendance from event"
          })
    } else {
        return res.status(403).json({
            "error": "Authorization required",
            "message": "Only the User or organizer may delete an Attendance"
          })
    }
})


//* DELETE A EVENT
router.delete('/:eventId', requireAuth, async (req, res, next) => {
    const user = req.user
    const { eventId } = req.params;
    const events = await Event.findByPk(eventId);


    if(!events) {
          return res.status(404).json({
            message: "Event couldn't be found"
        })
    };
    const event = events.toJSON();
    // console.log(event)

    const group = await Group.findAll({
        where: {
            id: event.groupId
        }
    });

    const organizer = group.map(ele => {
        const arr = ele.toJSON();
        return arr
    });
    // console.log("here", organizer)

    const getMembers = await Membership.findAll({
        where: {
            status: "co-host",
            userId: user.id
        }
    });
    // console.log(member)
    const members = getMembers.map(ele => {
        const arr = ele.toJSON();
        return arr
    });
    console.log(members)
    
    if(members.length) {
        await events.destroy();
       return res.json({
            "message": "Successfully deleted"
        })
    };

    if(user.id === organizer[0].organizerId) {
            await events.destroy();

            res.json({
                "message": "Successfully deleted"
            })

        } else {
            return res.status(403).json({
                "error": "Authorization required",
                "message": "Only group organizer, or co-host, is authorized to do that"
            })
        };

});




module.exports = router;