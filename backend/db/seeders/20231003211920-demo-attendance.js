'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Attendance } = require('../models');

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
   await Attendance.bulkCreate([
//* EVENT 1
    {
      eventId: 1,
      userId: 1,
      status: 'attending'
    },
    {
      eventId: 1,
      userId: 10,
      status: 'attending'
    },
    {
      eventId: 1,
      userId: 7,
      status: 'waitlist'
    },
//* EVENT 2
    {
      eventId: 2,
      userId: 2,
      status: "attending"
    },
    {
      eventId: 2,
      userId: 3,
      status: 'attending'
    },
    {
      eventId: 2,
      userId: 5,
      status: 'pending'
    },
    {
      eventId: 2,
      userId: 6,
      status: 'waitlist'
    },
//* EVENT 3
    {
      eventId: 3,
      userId: 1,
      status: 'pending'
    },
    {
      eventId: 3,
      userId: 10,
      status: 'attending'
    },
    {
      eventId: 3,
      userId: 5,
      status: 'attending'
    },
//* EVENT 4
    {
      eventId: 4,
      userId: 1,
      status: 'attending'
    },
    {
      eventId: 4,
      userId: 2,
      status: 'attending'
    },
    {
      eventId: 4,
      userId: 4,
      status: 'attending'
    },
    {
      eventId: 4,
      userId: 6,
      status: 'attending'
    },
    {
      eventId: 4,
      userId: 7,
      status: 'attending'
    },
    {
      eventId: 4,
      userId: 8,
      status: 'attending'
    },
//* EVENT 5
    {
      eventId: 5,
      userId: 4,
      status: 'attending'
    },
    {
      eventId: 5,
      userId: 2,
      status: 'attending'
    },
    {
      eventId: 5,
      userId: 7,
      status: 'pending'
    },
//* EVENT 6
    {
      eventId: 6,
      userId: 2,
      status: 'attending'
    },
    {
      eventId: 6,
      userId: 5,
      status: 'attending'
    },
    {
      eventId: 6,
      userId: 10,
      status: 'attending'
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
    options.tableName = 'Attendances';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1,2,3,4,5,6,7,8,9,10] }
    }, {});
  }
};
