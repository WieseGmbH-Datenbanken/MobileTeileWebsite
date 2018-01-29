module.exports = (function (sequelize, Sequelize) {
    return sequelize.define('Kundenbestellung', {
        auftrag_ID: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, field: 'Auftrag_ID'},
        datum: {type: Sequelize.DATE, field: 'Auftragsdatum'},
        status: {type: Sequelize.BOOLEAN, field: 'Status'},
        kunde_ID: {type: Sequelize.INTEGER, references: {model: 'Kunde', key: 'Kunde_ID'}, field: 'Kunde_ID'}
    });
});