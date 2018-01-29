module.exports = (function (sequelize, Sequelize) {
    return sequelize.define('Adresse', {
        adresse_ID: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, field: 'Adresse_ID'},
        strasse: {type: Sequelize.STRING(255), field: 'Strasse'},
        plz: {type: Sequelize.STRING(255), field: 'PLZ'},
        ort: {type: Sequelize.STRING(255), field: 'Ort'}
    });
});