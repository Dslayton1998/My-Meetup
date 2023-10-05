'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Event } = require('../models');

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
   await Event.bulkCreate([
    {
      venueId: 1,
      groupId: 1,
      name: 'Fake Event',
      description: "We are a group who gets together and acts nice EVEN if you actually hate them.",
      type: 'In Person',
      capacity: 20,
      price: 15,
      startDate: "06-05-2023",
      endDate:  "06-06-2023"
    },
    {
      venueId: 2,
      groupId: 2,
      name: 'Even Faker Event',
      description: "We actually just pretend to be rocks and don't talk to each other.",
      type: 'Online',
      capacity: 40,
      price: 100,
      startDate: "08-12-2023" ,
      endDate:  "08-12-2023"
    }
   ], options, {validator: true})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1,2] }
    }, {});
  }
};
