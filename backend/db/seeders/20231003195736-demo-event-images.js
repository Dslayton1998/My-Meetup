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
      url: 'SuchAFakeUrl.com',
      preview: true
    },
    {
      eventId: 1,
      url: 'anotherFakeUrl.com',
      preview: false
    },
    {
      eventId: 2,
      url: 'anotherFakeUrl.com',
      preview: false
    },
    {
      eventId: 2,
      url: 'anotherFakeUrl.com',
      preview: true
    },
    {
      eventId: 3,
      url: 'anotherFakeUrl.com',
      preview: false
    },
    {
      eventId: 3,
      url: 'anotherFakeUrl.com',
      preview: true
    },
    {
      eventId: 4,
      url: 'anotherFakeUrl.com',
      preview: false
    },
    {
      eventId: 4,
      url: 'anotherFakeUrl.com',
      preview: true
    },
    {
      eventId: 5,
      url: 'anotherFakeUrl.com',
      preview: false
    },
    {
      eventId: 5,
      url: 'anotherFakeUrl.com',
      preview: true
    },
    {
      eventId: 6,
      url: 'anotherFakeUrl.com',
      preview: false
    },
    {
      eventId: 6,
      url: 'anotherFakeUrl.com',
      preview: true
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
