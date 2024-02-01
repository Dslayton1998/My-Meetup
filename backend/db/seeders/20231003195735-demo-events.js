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
      description: "Got some intel that some big stuff going down at the docks. I promise this won't be the same as last time, I brought some snacks for afterwards.",
      type: 'In person',
      capacity: 20,
      price: 25,
      startDate: "06-05-2023 12:59:00",
      endDate:  "06-06-2023 07:34:00"
    },
    {
      venueId: 2,
      groupId: 2,
      name: 'Crime Time',
      description: `This city gets better, when we fight crime together! -edit: Some of you keep telling me this description is, "cringe". After googling cringe I think that YOU are in fact "cringe". `,
      type: 'In person',
      capacity: 40,
      price: 0,
      startDate: "08-12-2023 08:30:00" ,
      endDate:  "08-12-2023 12:00:00"
    },
    {
      venueId: 3,
      groupId: 3,
      name: 'Bird Watching!',
      description: "Just us birds watching the city!, It's gonna be a cold one so don't forget to wear something warm. edit: SO, some people thought I meant actual bird watching. To clarify, I mean knock the snot out of people. edit-edit: 'bad guys', not people.",
      type: 'In person',
      capacity: 20,
      price: 15,
      startDate: "01-14-2023 18:30:00 " ,
      endDate:  "01-15-2023 05:00:00"
    },
    {
      venueId: 4,
      groupId: 4,
      name: 'Poker Night :)',
      description: "Still at the bats place this time. Bring $50 for the pot, and PLEASE stop breaking things and attempting to find the Bat Cave. If you piss 'him' off we'll have to go to Bary's place, and no offense Bary, but your place sucks. also BYOB.",
      type: 'In person',
      capacity: 15,
      price: 50,
      startDate: "09-12-2023 16:30:00" ,
      endDate:  "09-13-2023 04:00:00"
    },
    {
      venueId: 5,
      groupId: 5,
      name: 'Meet-up',
      description: "I require Intel, please be present and punctual.",
      type: 'In person',
      capacity: 35,
      price: 10,
      startDate: "08-21-2023 01:00:00" ,
      endDate:  "08-22-2023 23:00:00"
    },
    {
      venueId: 6,
      groupId: 6,
      name: 'Spa-Day',
      description: "It's Island time ladies! bring money for the gift shop! Do be warned it will take us some time to reach the island, we ask that you bring a carry-on with everything you need.",
      type: 'In person',
      capacity: 40,
      price: 40,
      startDate: "01-12-2020 07:00:00" ,
      endDate:  "01-22-2020 08:00:00"
    },
    //************************************************* */
    {
      venueId: 1,
      groupId: 1,
      name: 'Big Oof',
      description: "All of that intel was wrong, please help me repair the dock. I will not be bringing snacks this time. However I hope you feel obligated to help me, you know who you are.",
      type: 'In person',
      capacity: 2,
      price: 25,
      startDate: "12-05-2023 12:05:00",
      endDate:  "12-06-2023 12:05:00"
    },
    {
      venueId: 2,
      groupId: 2,
      name: '"Cringe" Discussion',
      description: "I just don't get how you could think it was cringe, I think it's a perfectly fitting description. I WILL die on this hill, if you disagree stop by and argue with me. ",
      type: 'Online',
      capacity: 40,
      price: 0,
      startDate: "12-12-2023 01:00:00" ,
      endDate:  "12-13-2023 23:00:00"
    },
    {
      venueId: 3,
      groupId: 3,
      name: '"Bird Watching!"',
      description: "PLEASE, read the previous event description. Someone, who wishes to remain anonymous, said they will be providing snacks.",
      type: 'In person',
      capacity: 20,
      price: 15,
      startDate: "12-14-2023 18:30:00 " ,
      endDate:  "12-15-2023 05:00:00"
    },
    {
      venueId: 4,
      groupId: 4,
      name: 'Poker Night >:(',
      description: "You blew it dudes. You had one job. We're still on for poker, but whoever took a dumb on in the Bat Cave. I would move away, far away. Not joking bro, that was really dumb.",
      type: 'In person',
      capacity: 14,
      price: 50,
      startDate: "12-12-2023 16:30:00" ,
      endDate:  "12-13-2023 04:00:00"
    },
    {
      venueId: 5,
      groupId: 5,
      name: 'Meet-up again',
      description: "I require Intel. Again, please be present and punctual. Again.",
      type: 'In person',
      capacity: 25,
      price: 10,
      startDate: "12-21-2023" ,
      endDate:  "12-22-2023"
    },
    {
      venueId: 6,
      groupId: 6,
      name: 'It is Over!',
      description: "Sorry about keeping you all here for so long. We did not expect a global pandemic, as I'm sure you did not expect one either.",
      type: 'In person',
      capacity: 40,
      price: 40,
      startDate: "12-12-2023 07:00:00" ,
      endDate:  "12-22-2023 08:00:00"
    },
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
      groupId: { [Op.in]: [1,2,3,4,5,6] }
    }, {});
  }
};
