const express = require('express')
// const { Op } = require('sequelize');
// const bcrypt = require('bcryptjs');
const { EventImage, Group, Event, Membership } = require('../../db/models');


// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth.js');
const router = express.Router();

//* DELETE AN IMAGE FROM A Event
router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const imageId = req.params.imageId;
    const user = req.user;
    const getEventImage = await EventImage.findByPk(imageId);
    if(!getEventImage) {
        return res.status(404).json({
            "message": "Event Image couldn't be found"
          })
    };
    // console.log(getEventImage)
    const getEvent = await Event.findByPk(getEventImage.eventId);
    // console.log(getEvent)
    const getGroup = await Group.findByPk(getEvent.groupId);
    // console.log(getGroup)

    const getMemberships = await Membership.findAll({
        where: {
            groupId: getGroup.id,
            userId: user.id,
            status: 'co-host'
        }
    });


    if(user.id === getGroup.organizerId || getMemberships.length ) {
        await getEventImage.destroy();

        return res.json({
            "message": "Successfully deleted"
          });
    } else {
        return res.status(403).json({
            "error": "Authorization required",
            "message": "Only members with status of, co-host, or organizer may delete an image" 
          })
    }
})


module.exports = router;