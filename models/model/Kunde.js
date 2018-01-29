module.exports = (function (sequelize, Sequelize) {
    return sequelize.define('Kunde', {
        kunde_ID: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, field: 'Kunde_ID'},
        anrede: {type: Sequelize.STRING(255), field: 'Anrede'},
        name: {type: Sequelize.STRING(255), field: 'Name'},
        vorname: {type: Sequelize.STRING(255), field: 'Vorname'},
        telefon: {type: Sequelize.STRING(255), field: 'Telefon'},
        email: {type: Sequelize.STRING(255), field: 'Email'},
        zahlungsart: {type: Sequelize.STRING(255), field: 'Zahlungsart'},
        adresse_ID: {type: Sequelize.INTEGER, references: {model: 'Adresse', key: 'Adresse_ID'}, field: 'Adresse_ID'},
    });
});