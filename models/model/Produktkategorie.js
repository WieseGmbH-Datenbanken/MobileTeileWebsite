module.exports = (function (sequelize, Sequelize) {
    return sequelize.define('Produktkategorie', {
        kategorie_id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, field: 'Kategorie_ID'},
        name: {type: Sequelize.STRING(255), field: 'Kategorie'},
        beschreibung: {type: Sequelize.STRING(255), field: 'Beschreibung'}
    });
});