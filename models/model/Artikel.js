module.exports = (function (sequelize, Sequelize) {
    return sequelize.define('Artikel', {
        artikel_id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, field: 'Artikel_ID'},
        name: {type: Sequelize.STRING(255), field: 'Name'},
        beschreibung: {type: Sequelize.STRING(255), field: 'Beschreibung'},
        verkaufspreis: {type: Sequelize.FLOAT, field: 'Verkaufspreis'}
    });
});