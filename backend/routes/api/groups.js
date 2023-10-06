const express = require('express')
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { Group, Membership, GroupImage, User, Venue, Event } = require('../../db/models');

//? Validating Group Request Body (& middleware)
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth.js');
const { group } = require('console');//!?????! WHAT IS THIS???
const event = require('../../db/models/event');//?????????????
const validateGroups = [ //*https://express-validator.github.io/docs/api/validation-chain/ (Make more validation chains during refactor)
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


// CODE HERE 

//* CREATE A GROUP
router.post('/', validateGroups, requireAuth, async (req, res, next) => {
    const { name, about, type, private, city, state } = req.body;
    const organizer = req.user
                        //* ^ console.log(req)
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
});




//* GET ALL GROUPS
router.get('/', requireAuth, async (req,res,next) => {

    const getGroups = await Group.findAll(); 
    const groups = getGroups.map((group) => {
        const arr = group.toJSON();
        return arr 
    //* Array of Groups objects
    });

    const getMembers = await Membership.findAll();
    const members = getMembers.map((member) => {
        const arr = member.toJSON();
        return arr
    //* Array of Memberships objects
    });

    for(let i = 0; i < groups.length; i++) {
        let group = groups[i];
        const confirmedMembers = [];
        const id = group.id;
        members.forEach(member => {
            if(member.groupId === id) {
                if(member.status === 'co-host' || member.status === 'member') {
                    confirmedMembers.push(member)
                }   
            }
        });
        group.numMembers = confirmedMembers.length
        //* Creates numMembers key: 'and value'
    };
    // console.log(members)
    // console.log(groups)


    const groupImg = await GroupImage.findAll();
    const confirmPreview = groupImg.map((ele) => {
        const arr = ele.toJSON();
        return arr
    //* Array on GroupImages objects 
    });

    for(let i = 0; i < confirmPreview.length; i++) {
        if(confirmPreview[i].preview === true) {
            let group = groups[i];
            group.previewImage = confirmPreview[i].url
        }
    //* Provide the url if the preview status is true
    }

    res.json({Groups:groups})
});




//* GET ALL GROUPS OF CURRENT USER
router.get('/current', requireAuth, async (req, res, next) => {
    const user = req.user;

//? Getting all joined or organized groups:

    const member = await Group.findAll({
        include: {
            model: Membership,
            where: {
                userId: user.id,
                status: {
                    [Op.in]: ['co-host', 'member']
                }
            },
            attributes: []
        }
    }); 
    const memberOf = member.map((group) => {
        const arr = group.toJSON();
        return arr;
    //* Array of Groups that user is a MEMBER of
    });

    const usersGroups = await Group.findAll({
        where: {
            organizerId: user.id
        }
    });
    const groups = usersGroups.map((group) => {
        const arr = group.toJSON();
        return arr;
    //* Array of Groups that BELONG to the user
    });

    memberOf.forEach(member => {
        groups.push(member)
    //* Adds the Groups user is a member of to the array of groups that User owns
    })


//? Adding numMembers & previewImage:

    const getMembers = await Membership.findAll();
    const members = getMembers.map((member) => {
        const arr = member.toJSON();
        return arr
    //* Array of Memberships objects
    });
    const groupImg = await GroupImage.findAll();
    const confirmPreview = groupImg.map((ele) => {
        const arr = ele.toJSON();
        return arr
    //* Array on GroupImages objects 
    });
    groups.forEach(group => {
        console.log(group)
        const confirmedMembers = [];                
        const id = group.id;
        members.forEach(member => {
            if(member.groupId === id) {
                if(member.status === 'co-host' || member.status === 'member') {
                    confirmedMembers.push(member)
                }   
            }
        });
        group.numMembers = confirmedMembers.length
        //* Creates numMembers key: 'and value'
        
        for(let i = 0; i < confirmPreview.length; i++) {
            if(confirmPreview[i].preview === true) {
                group.previewImage = confirmPreview[i].url
            }
            //* Provide the url if the preview status is true
        }
        
    });
    res.json({Groups:groups})
});


//* ADD IMAGE TO GROUP BASED ON GROUP ID
router.post('/:groupId/images', requireAuth, async (req, res, next) => {
    const user = req.user
    const { groupId }= req.params;
    const { url, preview } = req.body;
    const getGroup = await Group.findByPk(groupId);
    
    if(!getGroup) {
        return res.status(404).json({
            "message": "Group couldn't be found"
        })
    }
    
    if(user.id === getGroup.organizerId) {
        const newImage = await GroupImage.create({ 
            groupId: groupId,
            url,
            preview})
            
            const details = await GroupImage.findAll({
                where: {
                    groupId: groupId,
                    id: newImage.id
                },
                attributes: ["id", "url", "preview"]
            })
            
            res.json(details[0])
        } else {
            return res.status(403).json({
                "error": "Authorization required",
                "message": "Only group organizer is authorized to do that"
            })
        }
    });
    
    
    //*CREATE NEW VENUE FOR A GROUP BY ID
    router.post('/:groupId/venues', validateVenue, requireAuth, async (req, res, next) => {
        const { address, city, state, lat, lng } = req.body
        const user = req.user;

        const { groupId } = req.params;
        const group = await Group.findByPk(groupId)
    
    //? Confirm the requested Group exists
        if(!group) {
            return res.status(404).json({
                "message": "Group couldn't be found"
            })
        }
    
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
            const newVenue = await Venue.create({ 
                groupId: groupId,
                address, 
                city, 
                state, 
                lat, 
                lng 
            });

        //? To get rid of created&updated at
        const resObj = {
            id: newVenue.id,
            groupId: groupId,
            address, 
            city,
            state,
            lat,
            lng
        };

            res.json(resObj);
        } else {
            return res.status(403).json({
                "error": "Authorization required",
                "message": "Only group organizer is authorized to do that"
            })
        }
    })


    
    //* EDIT A GROUP
    router.put('/:groupId', requireAuth, validateGroups, async (req, res, next) => {
        const { name, about, type, private, city, state } = req.body;
        const user = req.user;

    const { groupId } = req.params;
    const group = await Group.findByPk(groupId)

//? Confirm the requested Group exists
    if(!group) {
        return res.status(404).json({
            "message": "Group couldn't be found"
        })
    }

//? Confirm current user is Organizer:
    if(user.id === group.organizerId) {
        const update = await group.update({ name, about, type, private, city, state })
        res.json(update)

    } else {
        return res.status(403).json({
            "error": "Authorization required",
            "message": "Only group organizer is authorized to do that"
        })
    }

});


//* DELETE A GROUP
router.delete('/:groupId', requireAuth, async (req, res, next) => {
    const user = req.user;
    const { groupId } = req.params;
    const group = await Group.findByPk(groupId)

//? Confirm the requested Group exists
    if(!group) {
        return res.status(404).json({
            "message": "Group couldn't be found"
        })
    }

//? Confirm current user is Organizer:
    if(user.id === group.organizerId) {
        await group.destroy()
        res.json({
            "message": "Successfully deleted"
        })

    } else {
        return res.status(403).json({
            "error": "Authorization required",
            "message": "Only group organizer is authorized to do that"
        })
    }
})



//* GET ALL VENUES FOR A GROUP BY ID
router.get('/:groupId/venues', requireAuth, async (req, res, next) => {
    const user = req.user;
    const { groupId } = req.params;
    const group = await Group.findByPk(groupId)

//? Confirm the requested Group exists
    if(!group) {
        return res.status(404).json({
            "message": "Group couldn't be found"
        })
    }

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
        const venues = await Venue.findAll({
            where: {
                groupId: group.id
            },
            attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng']
        })
        res.json({
            "Venues": venues
        })
    } else {
        return res.status(403).json({
            "error": "Authorization required",
            "message": "Only group organizer (or co-host) is authorized to do that"
        })
    }
});



//* GET ALL EVENTS OF GROUP BY ID
router.get('/:groupId/events', async (req, res, next) => {
    const { groupId } = req.params;
    const getGroup = await Group.findByPk(groupId);

//? Confirm the requested Group exists
    if(!getGroup) {
        return res.status(404).json({
            "message": "Group couldn't be found"
        })
    ;}


    const getEvents = await Event.findAll({
        where: {
            groupId: groupId
        },
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
    

    res.json({"Events": event})
});






//* GET GROUP DETAILS FROM ID
//! could use a refactor, could probably get it all in one query 
router.get('/:groupId', requireAuth, async (req, res, next) => {
  const { groupId } = req.params;
  const getGroup =  await Group.findByPk(groupId);
  
  if(!getGroup) {
      return res.status(404).json({
          "message": "Group couldn't be found"
        })
    } else {
    const groups = getGroup.toJSON();
        

//? Creates numMembers key:

  const getMembers = await Membership.findAll();
  const members = getMembers.map((member) => {
      const arr = member.toJSON();
      return arr
  //* Array of Memberships objects
  });
        const confirmedMembers = [];                
        const id = groups.id;
        members.forEach(member => {
            if(member.groupId === id) {
                if(member.status === 'co-host' || member.status === 'member') {
                    confirmedMembers.push(member)
                }   
            }
        });
        groups.numMembers = confirmedMembers.length
        //* Creates numMembers key: 'and value'


//? Creates GroupImages key:

        const groupImg = await GroupImage.findAll({
            where: {
                groupId: groupId
            },
            attributes: ['id', 'url', 'preview']
        });
        const confirmPreview = groupImg.map((ele) => {
            const arr = ele.toJSON();
            return arr
        //* Array on GroupImages objects 
        });
        groups.GroupImages = confirmPreview;

//? Creates Organizer key:

        const getOrganizer = await User.findAll({
            where: {
                id: groups.organizerId
            },
            attributes: ['id', 'firstName', 'lastName']
        });
        const organizer = getOrganizer.map(ele => {
            const arr = ele.toJSON();
            return arr
        });
        groups.Organizer = organizer[0];

//? Creates Venues key:

        const getVenues = await Venue.findAll({
            where: {
                groupId: groups.id
            },
            attributes:['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng']
        });
        const venues = getVenues.map(ele => {
            const arr = ele.toJSON();
            return arr;
        })
        groups.Venues = venues;

  res.json(groups)
    }
});


module.exports = router;