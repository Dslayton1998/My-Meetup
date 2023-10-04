'use strict';


/** @type {import('sequelize-cli').Migration} */

const { Group } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
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
    await Group.bulkCreate([
    {
      organizerId: 1,
      name: "Testing Group 1" ,
      about: 'A group so I can test some stuff out ya know?',
      type: "Online",
      private: false,
      city: "Faketown",
      state: "Faklanta",
    },
    {
      organizerId: 2,
      name: "Testing Group 2",
      about: "We are a group all about our love for run on sentences, boy aren't they just the most wonderful, fantastic, super duper fun way of speaking to another human, my grandpappy taught me how to talk for four days straight, but I eventually got that up to a whopping six days ",
      type: "In Person",
      private: true,
      city: "Not-realville",
      state: "not here",
    },

  ], options, { validate: true })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      organizerId: { [Op.in]: [1, 2] }
    }, {});
  }
};
