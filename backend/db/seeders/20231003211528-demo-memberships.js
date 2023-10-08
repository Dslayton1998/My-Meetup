'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Membership } = require('../models');


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
   await Membership.bulkCreate([
//* BATMAN
    {
      userId: 1,
      groupId: 3,
      status: 'member'
    },
    {
      userId: 1,
      groupId: 4,
      status: 'co-host'
    },
//* SUPERMAN
    {
      userId: 2,
      groupId: 4,
      status: 'member'
    },
    {
      userId: 2,
      groupId: 5,
      status: 'co-host'
    }, 
    {
      userId: 2,
      groupId: 1,
      status: "pending"
    },
//* WONDER-WOMAN
    {
      userId: 3,
      groupId: 2,
      status: "member"
    },
//* MARTIAN-MANHUNTER
    {
      userId: 4,
      groupId: 4,
      status: "pending"
    },
//* HAWKGIRL
    {
      userId: 5,
      groupId: 2,
      status: "member"
    },
    {
      userId: 5,
      groupId: 3,
      status: "member"
    },
    {
      userId: 5,
      groupId: 6,
      status: "member"
    },
//* FLASH
    {
      userId: 6,
      groupId: 2,
      status: "member"
    },
    {
      userId: 6,
      groupId: 4,
      status: "member"
    },
//* GREEN-LANTERN
    {
      userId: 7,
      groupId: 1,
      status: "member"
    },
    {
      userId: 7,
      groupId: 4,
      status: "member"
    },
    {
      userId: 7,
      groupId: 5,
      status: "member"
    },
//* PLASTIC-MAN
    {
      userId: 8,
      groupId: 3,
      status: "pending"
    },
    {
      userId: 8,
      groupId: 4,
      status: "co-host"
    },
    {
      userId: 8,
      groupId: 6,
      status: "pending"
    },
//* AQUAMAN
    {
      userId: 9,
      groupId: 1,
      status: "pending"
    },
    {
      userId: 9,
      groupId: 2,
      status: "pending"
    },
    {
      userId: 9,
      groupId: 4,
      status: "pending"
    },
//* BLACK-CANARY
    {
      userId: 10,
      groupId: 1,
      status: "member"
    },
    {
      userId: 10,
      groupId: 6,
      status: "member"
    }
   ], options, {validate: true})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Memberships';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1,2] }
    }, {});
  }
};
