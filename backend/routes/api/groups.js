const express = require('express')
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { Group, Membership, GroupImage, User, Venue, Event } = require('../../db/models');

//? Validating Group Request Body (& middleware)
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth.js');
const { group, error } = require('console');//!?????! WHAT IS THIS???
const event = require('../../db/models/event');//?????????????
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
      .withMessage("Type must be Online or In person"), 
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

const validateEvents = [
        check('venueId')
            .custom(async val => {
                if(val === null) return true

                const venue = await Venue.findByPk(val)
                if(!venue)  throw new Error("Venue does not exist")
                    
               return true
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
            .withMessage("Type must be Online or In person"), 
        check('capacity')
            .exists({ checkFalsy: true })
            .withMessage('Please specify a capacity')
            .isInt()
            .withMessage("Capacity must be an integer"),
        check('price')
            .exists()
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
    return res.json(NewGroup)
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
        const groupImg = await GroupImage.findAll();
        const confirmPreview = groupImg.map((ele) => {
            const arr = ele.toJSON();
            return arr
        //* Array on GroupImages objects 
        });
        
    
        for(let i = 0; i < confirmPreview.length; i++) {
            if(confirmPreview[i].groupId === group.id) {
                if(confirmPreview[i].preview === true) {
                    group.previewImage = confirmPreview[i].url
                }
            }
    };
    // console.log(members)
    // console.log(groups)


    //* Provide the url if the preview status is true
    }

    return res.json({Groups:groups})
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
    return res.json({Groups:groups})
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

            return res.json(resObj);
        } else {
            return res.status(403).json({
                "error": "Authorization required",
                "message": "Only group organizer is authorized to do that"
            })
        }
    });



//* CREATE AN EVENT FOR GROUP BY ID
router.post('/:groupId/events', requireAuth, validateEvents, async (req, res, next) => {
    const { venueId, name, type, capacity, price, description, startDate, endDate }= req.body
    const { groupId } = req.params;
    const group = await Group.findByPk(groupId)
    const user = req.user;
    //? Confirm the requested Group exists
        if(!group) {
            return res.status(404).json({
                "message": "Group couldn't be found"
            })
        }

    const getVenues = await Venue.findByPk(venueId);
    if(!getVenues) {
        return res.status(404).json({
            "message": "Venue couldn't be found"  
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
        const newEvent = await Event.create({ groupId: groupId, venueId, name, type, capacity, price, description, startDate, endDate})
        const resObj = {}; //! Probs a better way to do this (don't want updatedAt OR createdAt)
        resObj.id = newEvent.id
        resObj.groupId = group.id
        resObj.venueId = newEvent.venueId
        resObj.name = newEvent.name
        resObj.type = newEvent.type
        resObj.capacity = newEvent.capacity
        resObj.price = newEvent.price
        resObj.description = newEvent.description
        resObj.startDate = newEvent.startDate
        resObj.endDate = newEvent.endDate
       return res.json(resObj)
    } else {
        return res.status(403).json({
            "error": "Authorization required",
            "message": "Only group organizer, or co-host, is authorized to do that"
        })
    }
});


//* REQUEST MEMBERSHIP FOR GROUP
router.post('/:groupId/membership', requireAuth, async (req, res, next) => {
    const { groupId } = req.params;
    const user = req.user;
    const getGroup = await Group.findByPk(groupId);

    if(!getGroup) {
       return res.status(404).json({
            "message": "Group couldn't be found"
        })
    };
    const group = getGroup.toJSON()
    if(group.organizerId === user.id) {
        return res.status(400).json({
            "message": "User is already a owner of the group"
        })
    }

    const getMembers = await Membership.findAll({
        where: {
            groupId: groupId,
            userId: user.id
        }
    });

    if(getMembers.length) {
        const members = getMembers.map(ele => {
            const arr = ele.toJSON();
            return arr
        });

        const currUser = members[0];
        if(currUser.status === "pending") {
           return  res.status(400).json({
                "message": "Membership has already been requested"
            })
        }

        if(currUser.status === "co-host" || currUser.status === "member") {
            return res.status(400).json({
                "message": "User is already a member of the group"
            })
        }
    }

    const newMember = await Membership.create({
        userId: user.id,
        groupId: groupId,
        status: "pending"
    });

    const newMemberArr = newMember.toJSON();
    const resObj = {
        memberId: newMemberArr.userId,
        status: newMemberArr.status
    }

   return res.json(resObj)
})
    

//* CHANGE MEMBERSHIP STATUS FOR GROUP
router.put('/:groupId/membership', requireAuth, async(req, res, next) =>{
    const { memberId, status } = req.body
    const { groupId } = req.params;
    const user = req.user;
    const getGroup = await Group.findByPk(groupId);
    if(!memberId) {
       return res.status(400).json({
            "message": "Validation Error",
            "errors": {
              "memberId": "User couldn't be found"
            }
          })
    }

    const updateMember = await Membership.findAll({
        where: {
            userId: memberId,
            groupId: groupId,
        }
    });
   
    const findUser = await User.findAll({
        where: {
            id: memberId
        }
    });


    if(!findUser.length) {
        return res.status(400).json({
            "message": "Validation Error",
            "errors": {
              "memberId": "User couldn't be found"
            }
          })
    }

    if(!updateMember.length) {
        return res.status(404).json({
            "message": "Membership between the user and the group does not exist"
          })
    }

    if(!getGroup) {
        return res.status(404).json({
            "message": "Group couldn't be found"
        })
    };

    if(status === 'pending') {
        return res.status(400).json({
            "message": "Validations Error",
            "errors": {
              "status" : "Cannot change a membership status to pending"
            }
          })
    }
    const resObj = {};
    const group = getGroup.toJSON()
    if(group.organizerId === user.id) { // IF TRUE THEY ARE THE OWNER
        const update = await updateMember[0].update({status});
        resObj.id = update.id
        resObj.groupId = update.groupId
        resObj.memberId = update.userId
        resObj.status = update.status
       return res.json(resObj)
    }

    const getMembers = await Membership.findAll({
        where: {
            groupId: groupId,
            userId: user.id
        }
    });

    if(getMembers.length) {
        const members = getMembers.map(ele => {
            const arr = ele.toJSON();
            return arr
        });

        const currUser = members[0];
        if(currUser.status === "co-host") { //* IF THEY ARE ONLY CO-HOST
            if(status === "co-host") {
               return res.status(403).json({
                    "message": "Only group organizer can promote member to co-host."
                })
            };
            const update = await updateMember[0].update({status});
            resObj.id = update.id
            resObj.groupId = update.groupId
            resObj.memberId = update.userId
            resObj.status = update.status
            res.json(resObj)
        } else {
           return res.status(403).json({
                "message": "Only group organizer, or co-host, are allowed to make changes"
            })
        }
    }
    return res.status(404).json({
        "message": "Membership between the user and the group does not exist"
      })
})



//! SHOULD BE THE LAST FOR PUT'S
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
        return res.json(update)

    } else {
        return res.status(403).json({
            "error": "Authorization required",
            "message": "Only group organizer is authorized to do that"
        })
    }

});


//* DELETE A MEMBERSHIP
router.delete('/:groupId/membership', requireAuth, async (req, res, next) => {
    const user = req.user;
    const { memberId } = req.body;
    const { groupId } = req.params;
    const group = await Group.findByPk(groupId);
    //? Confirm the requested Group exists
        if(!group) {
            return res.status(404).json({
                "message": "Group couldn't be found"
            })
        }

    if(!memberId) {
        return res.status(404).json({
            "message": "Validation Error",
            "errors": {
              "memberId": "Please specify a memberId"
            }
          })
    }
    const currUser = await Membership.findAll({
        where: {
            userId: user.id,
            groupId: group.id
        }
    });
    const destroyMember = await Membership.findAll({
        where: {
            userId: memberId,
            groupId: group.id
        }
    });
    console.log(destroyMember)
    const checkUser = await User.findByPk(memberId)


    if(!checkUser) {
        return res.status(400).json({
            "message": "Validation Error",
            "errors": {
              "memberId": "User couldn't be found"
            }
          })
    }

    if(!destroyMember.length) {
        return res.status(404).json({
            "message": "Membership does not exist for this User"
        })
    }


//? Confirm current user is Organizer:
if(user.id === group.organizerId) {
    await destroyMember[0].destroy();
    return res.json({
        "message": "Successfully deleted membership from group"
      })
} 

    if(currUser[0].userId === memberId) {
        await destroyMember[0].destroy();
       return  res.json({
            "message": "Successfully deleted membership from group"
          })
    }
        
    
   return  res.status(403).json({
            "error": "Authorization required",
            "message": "Only group organizer, or authorized member, is authorized to do that"
        })

})






//! LAST FOR DELETE'S
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
        return res.json({
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
       return  res.json({
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
            exclude: ["createdAt", "updatedAt", "description", "capacity", "price"]
        }
    });
    if(!getEvents.length) {
        return res.status(404).json({
            "message": "This group currently has no scheduled events."
        })
    }

    const event = getEvents.map((event) => {
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

        event[i].numAttending = attendees.length;
        if(image.length) {
            event[i].previewImage = image[0].url
        } else {event[i].previewImage = null}
    }
    

    return res.json({"Events": event})
});


//* GET ALL MEMBERS OF GROUP BY ID
router.get('/:groupId/members', async (req, res, next) => {
    const { groupId } = req.params
    const user = req.user;
    const group = await Group.findByPk(groupId);
    if(!group){
        return res.status(404).json({
            "message": "Group couldn't be found"
        })
    }
    const members = await group.getMemberships();

    const resObj = {
        Members : []
    }


    const authorizedMember = await group.getMemberships({
        where: {
            status:{
                [Op.in]:['co-host','member']
            }
        }
    });

    const currUserMemberStatus = await group.getMemberships({
        where: {
            userId: user.id,
            status: 'co-host'
        }
    })

    if(user.id === group.organizerId || currUserMemberStatus.length ){
    for (let i = 0; i < members.length; i++){
        const member = members[i]
        const user = await User.findByPk(member.userId)

        const userObj = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            Membership: {
                status: members[i].status
            }
        }
        resObj.Members.push(userObj)
    }
}  else {

    for (let i = 0; i < authorizedMember.length; i++){
        const user = await User.findByPk(authorizedMember[i].userId)

        const userObj = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            Membership: {
                status: authorizedMember[i].status
            }
        };
        
        resObj.Members.push(userObj)
    }
}

   return res.json(resObj)

    
})



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

  return res.json(groups)
    }
});


module.exports = router;