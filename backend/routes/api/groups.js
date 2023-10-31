const express = require('express')
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { Group, Membership, GroupImage, User, Venue, Event } = require('../../db/models');

//? Validating Group Request Body (& middleware)
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth.js');
const validateGroups = [ //* https://express-validator.github.io/docs/api/validation-chain/
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
 
//! GET's START
//* GET ALL GROUPS (DRY, - n+1 query's)
router.get('/', requireAuth, async (req,res,next) => {
    const returnObj = {Groups:[]};
    const getGroups = await Group.findAll();  
    const getMembers = await Membership.findAll();
    const groupImg = await GroupImage.findAll();

    for(let i = 0; i < getGroups.length; i++) {
        let group = getGroups[i];
        const confirmedMembers = [];
        const id = group.id;

        getMembers.forEach(member => {
            if(member.groupId === id) {
                    if(member.status === 'co-host' || member.status === 'member') {
                        confirmedMembers.push(member)
                    }   
                }
            });
        group.dataValues.numMembers = confirmedMembers.length  

        for(let i = 0; i < groupImg.length; i++) {
            if(groupImg[i].groupId === group.id) {
                if(groupImg[i].preview === true) {
                    group.dataValues.previewImage = groupImg[i].url
                }
            }
        };
        returnObj.Groups.push(group)
    };

    return res.json(returnObj)
});



//* GET ALL GROUPS OF CURRENT USER
router.get('/current', requireAuth, async (req, res, next) => {
    const user = req.user;

//? Getting all joined or organized groups/getting information for response:
    const resObj = {Groups:[]};
    const groupImg = await GroupImage.findAll();
    const getMembers = await Membership.findAll({
        where: {
            userId: user.id
        }
    });
    const organizerOf = await Group.findAll({
        where: {
            organizerId: user.id
        },
    });
    const memberOf = await Group.findAll({
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


//? Setting up the response Object
    for(let i = 0; i < memberOf.length; i++) {
        const confirmedMembers = [];
        let organizedGroup = organizerOf[i];
        let group = memberOf[i];
        const id = group.id;


//? Finding the number of members for each group
        getMembers.forEach(member => {
            if(member.groupId === id) {
                    if(member.status === 'co-host' || member.status === 'member') {
                        confirmedMembers.push(member)
                    }   
                }
            });


//? Adding numMembers to each group object
    //* ORGANIZER CHECK
        if(organizedGroup !== undefined) {
            organizedGroup.dataValues.numMembers = confirmedMembers.length
        };

        group.dataValues.numMembers = confirmedMembers.length  


//? Adding previewImage: IF preview status is true
        for(let i = 0; i < groupImg.length; i++) {
            if(groupImg[i].groupId === group.id) {
                if(groupImg[i].preview === true) {
                    group.dataValues.previewImage = groupImg[i].url

                //* ORGANIZER CHECK
                    if(organizedGroup !== undefined) {
                        organizedGroup.dataValues.previewImage = groupImg[i].url
                    };

                }
            }
        };

        resObj.Groups.push(group)
    };

//? Check to see if the organizer group exists
        if(organizerOf) {
            organizerOf.forEach(group => {
                resObj.Groups.push(group)
            })
        };
    
    return res.json(resObj)

});


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
    });
    console.log(currUserMemberStatus)

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
router.get('/:groupId', requireAuth, async (req, res, next) => {
  const groupId = req.params.groupId;
  const getGroup =  await Group.findByPk(groupId);
  
  if(!getGroup) {
      return res.status(404).json({
          "message": "Group couldn't be found"
        })
    };
    
    
//? Creates numMembers key:
    const getMembers = await Membership.findAll();
    
        const confirmedMembers = [];                
        const id = getGroup.dataValues.id;
        getMembers.forEach(member => {
            if(member.groupId === id) {
                if(member.status === 'co-host' || member.status === 'member') {
                    confirmedMembers.push(member)
                }   
            }
        });
        getGroup.dataValues.numMembers = confirmedMembers.length
        //* Creates numMembers key: 'and value'


//? Creates GroupImages key:

        const groupImg = await GroupImage.findAll({
            where: {
                groupId: groupId
            },
            attributes: ['id', 'url', 'preview']
        });
        getGroup.dataValues.GroupImages = groupImg;


//? Creates Organizer key:

        const getOrganizer = await User.findAll({
            where: {
                id: getGroup.dataValues.organizerId
            },
            attributes: ['id', 'firstName', 'lastName']
        });
        getGroup.dataValues.Organizer = getOrganizer[0];


//? Creates Venues key:

        const getVenues = await Venue.findAll({
            where: {
                groupId: id
            },
            attributes:['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng']
        });
        getGroup.dataValues.Venues = getVenues;


  return res.json(getGroup)
});





//! POST's START
//* CREATE A GROUP
router.post('/', requireAuth, validateGroups, async (req, res, next) => {
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
    return res.status(201).json(NewGroup)
});


//* ADD IMAGE TO GROUP BASED ON GROUP ID
router.post('/:groupId/images', requireAuth, async (req, res, next) => {
    const user = req.user
    const groupId = req.params.groupId;
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
            preview
        });
            
            const details = await GroupImage.findAll({
                where: {
                    groupId: groupId,
                    id: newImage.id
                },
                attributes: ["id", "url", "preview"]
            })
            
           return  res.json(details[0])
        } else {
            return res.status(403).json({
                "error": "Authorization required",
                "message": "Only group organizer is authorized to do that"
            })
        }
    });
    
    
//*CREATE NEW VENUE FOR A GROUP BY ID
router.post('/:groupId/venues', requireAuth, validateVenue, async (req, res, next) => {
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
    



//! PUT's START
//* CHANGE MEMBERSHIP STATUS FOR GROUP
router.put('/:groupId/membership', requireAuth, async(req, res, next) =>{
    const { memberId, status } = req.body
    if(status === 'pending') {
        return res.status(400).json({
            "message": "Validations Error",
            "errors": {
              "status" : "Cannot change a membership status to pending"
            }
          })
    }
    const { groupId } = req.params;
    const user = req.user;
    const getGroup = await Group.findByPk(groupId);
    if(!getGroup) {
        return res.status(404).json({
            "message": "Group couldn't be found"
        })
    };
    const group = getGroup.toJSON()
    console.log(group);
    console.log(user.id)
    const getMembers = await Membership.findAll({
        where: {
            groupId: groupId,
            userId: user.id,
            status: "co-host"
        }
    });


    if(getMembers) {
        const members = getMembers.map(ele => {
            const arr = ele.toJSON();
            return arr
        });

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
    console.log(findUser)
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

    if(!getMembers || group.organizerId !== user.id){
        return res.status(403).json({
            "error": "Authorization required",
            "message": "Not Authorized to make that change."
        })
    }



    const resObj = {};
    if(group.organizerId === user.id) { // IF TRUE THEY ARE THE OWNER
        const update = await updateMember[0].update({status});
        resObj.id = update.id
        resObj.groupId = update.groupId
        resObj.memberId = update.userId
        resObj.status = update.status
       return res.json(resObj)
    }


        if(currUser.status === "co-host") { //* IF THEY ARE ONLY CO-HOST
            if(status === "co-host") {
               return res.status(403).json({
                    "error": "Authorization required",
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
                "error": "Authorization required",
                "message": "Only group organizer, or co-host, are allowed to make changes"
            })
        }
    }
    return res.status(404).json({
        "message": "Membership between the user and the group does not exist"
      })
})


//* EDIT A GROUP
router.put('/:groupId', requireAuth, validateGroups, async (req, res, next) => {
    let { name, about, type, private, city, state } = req.body;
    const user = req.user;

    const { groupId } = req.params;
    const group = await Group.findByPk(groupId)

    const createObj = {};

    if(name) {
        createObj.name = name
    } 

    if(about) {
        createObj.about = about
    } 

    if(type) {
        createObj.type = type
    } 

    if(private) {
        createObj.private = private
    } 

    if(city) {
        createObj.city = city
    } 

    if(state) {
        createObj.state = state
    } 

//? Confirm the requested Group exists
    if(!group) {
        return res.status(404).json({
            "message": "Group couldn't be found"
        })
    }

//? Confirm current user is Organizer:
    if(user.id === group.organizerId) {
        const update = await group.update(createObj)
        return res.json(update)

    } else {
        return res.status(403).json({
            "error": "Authorization required",
            "message": "Only group organizer is authorized to do that"
        })
    }

});





//! DELETE's START
//* DELETE A MEMBERSHIP
router.delete('/:groupId/membership', requireAuth, async (req, res, next) => {
    const user = req.user;
    const { memberId } = req.body;
    const getUser = await User.findByPk(memberId);
    if(!getUser) {
        return res.status(404).json({
            "message": "User with the specified Id doesn't exist."
        })
    }
    const { groupId } = req.params;
    const group = await Group.findByPk(groupId);
    //? Confirm the requested Group exists
        if(!group) {
            return res.status(404).json({
                "message": "Group couldn't be found"
            })
        }


    const destroyMember = await Membership.findAll({
        where: {
            userId: memberId,
            groupId: groupId
        }
    });
    if(!destroyMember.length) {
        return res.status(404).json({
            "message": "Membership does not exist for this User"
        })
    }
    const checkUserMem = await Membership.findAll({
        where: {
            userId: user.id,
            groupId: groupId
        }
    })
    if(!checkUserMem.length) {
        return res.status(404).json({
            "error": "Authorization required",
            "message": "Only members with status of, co-host, or organizer may delete an image"
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
    // console.log(destroyMember)
    const checkUser = await User.findByPk(memberId)


    if(!checkUser) {
        return res.status(400).json({
            "message": "Validation Error",
            "errors": {
              "memberId": "User couldn't be found"
            }
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


//* DELETE A GROUP
router.delete('/:groupId', requireAuth, async (req, res, next) => {
    const user = req.user;
    const groupId = req.params.groupId;
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



module.exports = router;