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
      name: "Night-Watchers" ,
      about: "We're pretty much only active at night. Anyone who loves to stalk through the city at night, to bust a baddie jaw or two. This is the group for you!",
      type: "In person",
      private: true,
      city: "Gotham",
      state: "New Jersey",
    },
    {
      organizerId: 2,
      name: "Day-Watchers",
      about: "If you don't care what time of day it is, and probably have god like powers, therefor no real reason to sleep. This is the group for you!",
      type: "Online",
      private: false,
      city: "Metropolis",
      state: "New York",
    },
    {
      organizerId: 10,
      name: "Bird Club!",
      about: "If you dig the whole, bird astetic, like; watching birds, feeding birds, screaming like a bird, or just dressing up a bird. This is your group. ",
      type: "Online",
      private: true,
      city: "Star City",
      state: "San Francisco",
    },
    {
      organizerId: 8,
      name: "Saturdays",
      about: "YOU already KNOW what it isss, oh wait? what is 'it' you ask? ITS FOR THE BOIISSSS. Usually at the Bat's place, unless something else gets broken.",
      type: "In person",
      private: true,
      city: "Gotham",
      state: "New Jersey",
    },
    {
      organizerId: 4,
      name: "Out of this World",
      about: "It will be a strategical benefit if my allies with the ability to traverse through space would join this group, Sharing information is essential.",
      type: "In person",
      private: false,
      city: "Outer",
      state: "Space",
    },
    {
      organizerId: 3,
      name: "Strong & Independent",
      about: "Come relax and get away from the worries of the world ladies, We host at my home island. Sorry fellas, No guys aloud in Themysirca.",
      type: "In person",
      private: true,
      city: "Themyscira",
      state: "The Ocean",
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
      organizerId: { [Op.in]: [1, 2, 10, 8, 4, 3] }
    }, {});
  }
};
