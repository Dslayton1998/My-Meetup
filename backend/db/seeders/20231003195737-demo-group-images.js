'use strict';

/** @type {import('sequelize-cli').Migration} */

const { GroupImage } = require('../models');
const bcrypt = require("bcryptjs");

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
   await GroupImage.bulkCreate([
    {
      groupId: 1,
      url: 'SuchAFakeUrl.com',
      preview: true
    },
    {
      groupId: 1,
      url: 'anotherFakeUrl.com',
      preview: false
    },
    {
      groupId: 2,
      url: 'anotherFakeUrl.com',
      preview: false
    },
    {
      groupId: 2,
      url: 'anotherFakeUrl.com',
      preview: true
    },
    {
      groupId: 3,
      url: 'anotherFakeUrl.com',
      preview: false
    },
    {
      groupId: 3,
      url: 'anotherFakeUrl.com',
      preview: true
    },
    {
      groupId: 4,
      url: 'anotherFakeUrl.com',
      preview: false
    },
    {
      groupId: 4,
      url: 'anotherFakeUrl.com',
      preview: true
    },
    {
      groupId: 5,
      url: 'anotherFakeUrl.com',
      preview: false
    },
    {
      groupId: 5,
      url: 'anotherFakeUrl.com',
      preview: true
    },
    {
      groupId: 6,
      url: 'anotherFakeUrl.com',
      preview: false
    },
    {
      groupId: 6,
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
    options.tableName = 'GroupImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1,2] }
    }, {});
  }
};
