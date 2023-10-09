const express = require('express')
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { GroupImage, Group, Membership } = require('../../db/models');


const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth.js');
const router = express.Router();

// CODE GOES HERE

//* DELETE AN IMAGE FROM A GROUP
router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const { imageId } = req.params;
    const user = req.user;
    const getGroupImage = await GroupImage.findByPk(imageId);
    if(!getGroupImage) {
        return res.status(404).json({
            "message": "Group Image couldn't be found"
          })
    }

    const getGroup = await Group.findByPk(getGroupImage.groupId);
    const group = getGroup.toJSON();

    const getMemberships = await Membership.findAll({
        where: {
            groupId: group.id,
            userId: user.id,
            status: 'co-host'
        }
    });


    if(user.id === getGroup.organizerId || getMemberships.length ) {
        await getGroupImage.destroy();

        return res.json({
            "message": "Successfully deleted"
          });
    } else {
        return res.status(403).json({
            "message": "Only members with status of, co-host, or organizer may delete an image" 
          })
    }
})


module.exports = router;