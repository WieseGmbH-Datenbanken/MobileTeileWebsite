module.exports = (function (sequelize, Sequelize) {
    return sequelize.define('Lieferant', {
        lieferant_id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, field: 'Lieferant_ID'},
        name: {type: Sequelize.STRING(255), field: 'Name'},
        telefon: {type: Sequelize.STRING(255), field: 'Telefon'},
        email: {type: Sequelize.STRING(255), field: 'Email'},
        steuernummer: {type: Sequelize.INTEGER, field: 'Steuernummer'}
    });
});