'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Messages', 'attachment', 'attachmentId');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Messages', 'attachmentId', 'attachment');
  }
};
