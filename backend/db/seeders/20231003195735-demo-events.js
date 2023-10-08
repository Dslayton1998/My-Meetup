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
      name: 'Dock-of-the-Bay Beat-down',
      description: "Got some intel that some big stuff going down at the docks. Who's in?",
      type: 'In Person',
      capacity: 20,
      price: 0,
      startDate: "06-05-2023",
      endDate:  "06-06-2023"
    },
    {
      venueId: 2,
      groupId: 2,
      name: 'Crime Time',
      description: "This city gets better, when we fight crime together!",
      type: 'In Person',
      capacity: 40,
      price: 0,
      startDate: "08-12-2023" ,
      endDate:  "08-12-2023"
    },
    {
      venueId: 3,
      groupId: 3,
      name: 'Bird Watching!',
      description: "Just us birds watching the city!",
      type: 'In Person',
      capacity: 20,
      price: 0,
      startDate: "08-14-2023" ,
      endDate:  "08-15-2023"
    },
    {
      venueId: 4,
      groupId: 4,
      name: 'Poker Night',
      description: "Still at the bats place this time, bring $50 for the pot, BYOB.",
      type: 'In Person',
      capacity: 40,
      price: 50,
      startDate: "09-12-2023" ,
      endDate:  "09-13-2023"
    },
    {
      venueId: 5,
      groupId: 5,
      name: 'Meet-up',
      description: "I require Intel, please be present and punctual.",
      type: 'In Person',
      capacity: 35,
      price: 0,
      startDate: "08-21-2023" ,
      endDate:  "08-22-2023"
    },
    {
      venueId: 6,
      groupId: 6,
      name: 'Spa-Day',
      description: "It's Island time ladies! bring money for the gift shop!",
      type: 'In Person',
      capacity: 40,
      price: 40,
      startDate: "10-12-2023" ,
      endDate:  "10-12-2023"
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
