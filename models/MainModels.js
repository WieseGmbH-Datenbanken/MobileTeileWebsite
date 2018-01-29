function bindbi(hasmany, belongs, key) {
    hasmany.hasMany(belongs, {foreignKey: key});
    belongs.belongsTo(hasmany, {foreignKey: key});
}

function zwischenTabelle(left, right, through, leftKey, rightKey){
    left.belongsToMany(right, { through: through, foreignKey: leftKey, otherKey: rightKey });
    right.belongsToMany(left, { through: through, foreignKey: rightKey, otherKey: leftKey });
}

var exports = module.exports = function (sequelize, Sequelize) {
    var temp = {};
    // model definitionen
    temp.Adresse = require("./model/Adresse.js")(sequelize, Sequelize);
    temp.Lieferant = require("./model/Lieferant.js")(sequelize, Sequelize);
    temp.Kunde = require("./model/Kunde.js")(sequelize, Sequelize);
    temp.Produktkategorie = require("./model/Produktkategorie.js")(sequelize, Sequelize);
    temp.Produkt = require("./model/Produkt.js")(sequelize, Sequelize);
    temp.Artikel = require("./model/Artikel.js")(sequelize, Sequelize);
    temp.Kundenbestellung = require("./model/Kundenbestellung.js")(sequelize, Sequelize);

    // Relationen
    bindbi(temp.Adresse, temp.Kunde, 'adresse_ID');
    bindbi(temp.Produktkategorie, temp.Produkt, 'kategorie_id');
    bindbi(temp.Lieferant, temp.Produkt, 'lieferant_id');
    bindbi(temp.Kunde, temp.Kundenbestellung, 'kunde_ID');

    zwischenTabelle(temp.Produkt, temp.Artikel, 'produkt_artikel', 'Produkt_ID', 'Artikel_ID');
    zwischenTabelle(temp.Artikel, temp.Kundenbestellung, 'artikel_kundenbestellung', 'Artikel_ID', 'Auftrag_ID');

    return temp;
};