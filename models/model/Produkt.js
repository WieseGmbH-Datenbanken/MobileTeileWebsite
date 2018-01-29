module.exports = (function (sequelize, Sequelize) {
    return sequelize.define('Produkt', {
        produkt_id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, field: 'Produkt_ID'},
        name: {type: Sequelize.STRING(255), field: 'Name'},
        einkaufspreis: {type: Sequelize.FLOAT, field: 'Einkaufspreis'},
        lagerbestand: {type: Sequelize.INTEGER, field: 'Lagerbestand'},
        mindestbestand: {type: Sequelize.INTEGER, field: 'Mindestbestand'},
        kategorie_id: {type: Sequelize.INTEGER, references: {model: 'Produktkategorie', key: 'Kategorie_ID'}, field: 'Kategorie_ID'},
        lieferant_id: {type: Sequelize.INTEGER, references: {model: 'Lieferant', key: 'Lieferant_ID'}, field: 'Lieferant_ID'}
    });
});