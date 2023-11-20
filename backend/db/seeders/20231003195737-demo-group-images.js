'use strict';

/** @type {import('sequelize-cli').Migration} */

const { GroupImage } = require('../models');

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
      url: 'https://i.pinimg.com/736x/a0/6a/cf/a06acf64e4346ec3e512ad5946ecdc91.jpg',
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
      url: 'https://images.thedirect.com/media/photos/A8D168A5-A091-4A86-9FC2-2A07C570A56D.jpg',
      preview: true
    },
    {
      groupId: 3,
      url: 'anotherFakeUrl.com',
      preview: false
    },
    {
      groupId: 3,
      url: 'https://e7.pngegg.com/pngimages/624/641/png-clipart-black-canary-green-arrow-hawkman-hawkgirl-starfire-raven-animals-fictional-characters.png',
      preview: true
    },
    {
      groupId: 4,
      url: 'anotherFakeUrl.com',
      preview: false
    },
    {
      groupId: 4,
      url: 'https://media.niftygateway.com/image/upload/fl_keep_dar,q_auto:good,w_500/v1612205000/A/JoseDelbo/Heroes_Playing_Poker_-_Classic_yjaus5.webp',
      preview: true
    },
    {
      groupId: 5,
      url: 'anotherFakeUrl.com',
      preview: false
    },
    {
      groupId: 5,
      url: 'https://photos1.blogger.com/x/blogger/5426/3062/1600/264154/MARTIAN%20MANHUNTER%20%2336.jpg',
      preview: true
    },
    {
      groupId: 6,
      url: 'anotherFakeUrl.com',
      preview: false
    },
    {
      groupId: 6,
      url: 'https://screenrant.com/wp-content/uploads/2017/05/Paradise-Island-Wonder-Woman-comics.jpg',
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
      groupId: { [Op.in]: [1,2,3,4,5,6] }
    }, {});
  }
};
