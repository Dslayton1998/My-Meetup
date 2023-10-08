'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        email: 'user1@email.com',
        username: 'Batman',
        firstName: 'Bruce',
        lastName: 'Wayne',
        hashedPassword: bcrypt.hashSync('password1')
      },
      {
        email: 'user2@email.com',
        username: 'Superman',
        firstName: 'Clark',
        lastName: 'Kent',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        email: 'user3@user.io',
        username: 'Wonder-Woman',
        firstName: 'Diana',
        lastName: 'Prince',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        email: 'user4@email.com',
        username: 'Martian-Manhunter',
        firstName: "J'onn",
        lastName: "J'onzz",
        hashedPassword: bcrypt.hashSync('password4')
      },
      {
        email: 'user5@email.com',
        username: 'Hawkgirl',
        firstName: 'Shiera',
        lastName: 'Hall',
        hashedPassword: bcrypt.hashSync('password5')
      },
      {
        email: 'user6@email.com',
        username: 'THE-Flash',
        firstName: 'Barry',
        lastName: 'Allen',
        hashedPassword: bcrypt.hashSync('password6')
      },
      {
        email: 'user7@email.com',
        username: 'Green-Lantern',
        firstName: 'Harold "Hal"',
        lastName: 'Jordan',
        hashedPassword: bcrypt.hashSync('password7')
      },
      {
        email: 'user8@email.com',
        username: 'Plastic-Man',
        firstName: 'Patrick "Eel"',
        lastName: "O'Brien",
        hashedPassword: bcrypt.hashSync('password8')
      },
      {
        email: 'user9@email.com',
        username: 'Aquaman',
        firstName: 'Arthur',
        lastName: 'Curry',
        hashedPassword: bcrypt.hashSync('password9')
      },
      {
        email: 'user10@email.com',
        username: 'Black-Canary',
        firstName: 'Dinah',
        lastName: 'Drake',
        hashedPassword: bcrypt.hashSync('password10')
      },
    ], options, { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};

//HXEsKcAk-IHUM-PY9-laXaswNiHS8VMPKNDQ