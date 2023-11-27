'use strict';

/** @type {import('sequelize-cli').Migration} */

const { EventImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') { //! FOR EVERY SEED
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await EventImage.bulkCreate([
    {
      eventId: 1,
      url: 'https://cdn.europosters.eu/image/750/posters/batman-comic-stalker-i21386.jpg',
      preview: true
    },
    {
      eventId: 1,
      url: 'https://i.ebayimg.com/images/g/FbEAAOSw9FlfvMZf/s-l1600.jpg',
      preview: false
    },
    {
      eventId: 2,
      url: 'https://insidethemagic.net/wp-content/uploads/2022/12/Superman-c-3-e1672800031905.jpg',
      preview: true
    },
    {
      eventId: 2,
      url: 'https://i.ebayimg.com/images/g/FbEAAOSw9FlfvMZf/s-l1600.jpg',
      preview: false
    },
    {
      eventId: 3,
      url: 'https://www.writeups.org/wp-content/uploads/Black-Canary-DC-Comics-Batman-alley-crime-h1.jpg',
      preview: true
    },
    {
      eventId: 3,
      url: 'https://i.ebayimg.com/images/g/FbEAAOSw9FlfvMZf/s-l1600.jpg',
      preview: false
    },
    {
      eventId: 4,
      url: 'https://i.pinimg.com/736x/7a/ba/f9/7abaf9267db022a5fc61b159692dbedd.jpg',
      preview: true
    },
    {
      eventId: 4,
      url: 'https://i.ebayimg.com/images/g/FbEAAOSw9FlfvMZf/s-l1600.jpg',
      preview: false
    },
    {
      eventId: 5,
      url: 'https://comicvine.gamespot.com/a/uploads/original/11126/111264841/5156426-3714132043-2013N.jpg',
      preview: true
    },
    {
      eventId: 5,
      url: 'https://i.ebayimg.com/images/g/FbEAAOSw9FlfvMZf/s-l1600.jpg',
      preview: false
    },
    {
      eventId: 6,
      url: 'https://cdn.vox-cdn.com/thumbor/xQoIiH5KarTUigwef_xLtNoNHoU=/1400x788/filters:format(png)/cdn.vox-cdn.com/uploads/chorus_asset/file/22948654/Screenshot_2021_10_22_at_5.09.54_PM.png',
      preview: true
    },
    {
      eventId: 6,
      url: 'https://i.ebayimg.com/images/g/FbEAAOSw9FlfvMZf/s-l1600.jpg',
      preview: false
    },
   ], options, {validate: true})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'EventImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      eventId: { [Op.in]: [1,2,3,4,5,6] }
    }, {});
  }
};
