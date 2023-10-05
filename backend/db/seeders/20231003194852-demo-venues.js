'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Venue } = require('../models');


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
   await Venue.bulkCreate([
    {
      groupId: 1,
      address: "First Fake Street",
      city: "Not real",
      state: "Missouri",
      lat: 24.25,
      lng: 89.98
    },
    {
      groupId: 2,
      address: "Another fake Street",
      city: "Pretend Land",
      state: 'Texas',
      lat: 23.32,
      lng: 67.76
    }
   ], options, {validate: true}) //! add this too!
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Venues';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1,2] }
    }, {});
  }
};
