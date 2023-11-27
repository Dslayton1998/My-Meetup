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
      address: "1st Fake Street",
      city: "Gotham",
      state: "New Jersey",
      lat: 24.25,
      lng: 89.98
    },
    {
      groupId: 2,
      address: "2nd Fake Street",
      city: "Metropolis",
      state: 'New York',
      lat: 23.32,
      lng: 67.76
    },
    {
      groupId: 3,
      address: "3rd Fake Street",
      city: "Star City",
      state: 'San Francisco',
      lat: 23.32,
      lng: 67.76
    },
    {
      groupId: 4,
      address: "The bats place",
      city: "Gotham",
      state: 'New Jersey',
      lat: 23.32,
      lng: 67.76
    },
    {
      groupId: 5,
      address: "The Moon",
      city: "Outer",
      state: 'Space',
      lat: 23.32,
      lng: 67.76
    },
    {
      groupId: 6,
      address: '"Paradise island"',
      city: "the Island",
      state: 'Themyscira',
      lat: 23.32,
      lng: 67.76
    },
    // {
    //   groupId: 4,
    //   address: "Bary's Place",
    //   city: 'SomeCity',
    //   state: 'SomeState',
    //   lat: 24.42,
    //   lng: 52.25
    // }

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
      groupId: { [Op.in]: [1,2,3,4,5,6] }
    }, {});
  }
};
