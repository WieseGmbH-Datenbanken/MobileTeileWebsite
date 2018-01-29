const sequelize = require('sequelize');
const express = require('express');
const router = express.Router();
const Warenkorb = require('../lib/warenkorb');

router.get('/', function (req, res, next) {
    let warenkorb = new Warenkorb(req.session.warenkorb ? req.session.warenkorb : {});
    let warenkorbList = warenkorb.getItems();
    let warenkorbIDs = [];
    for (let i = 0; i < warenkorbList.length; i++)
        warenkorbIDs.push(warenkorbList[i].artikel_id);
    req.models.Artikel.findAll({
        where: {
            artikel_id: warenkorbIDs
        },
        attributes: ['artikel_id', 'name', 'beschreibung', 'verkaufspreis'],
        include: [
            {
                model: req.models.Produkt,
                attributes: ['name', 'lagerbestand'],
                include: [
                    {model: req.models.Lieferant, attributes: ['name']},
                    {model: req.models.Produktkategorie, attributes: ['name']}
                ]
            }
        ]
    }).then(function (results) {
        let artikelList = Array(warenkorbList.length);
        for (let i = 0; i < results.length; i++) {
            let warenkorbID = warenkorbIDs.indexOf(parseInt(results[i].artikel_id));
            let artikelObject = {
                "artikel_id": results[i].artikel_id,
                "name": results[i].name,
                "beschreibung": results[i].beschreibung,
                "preis": results[i].verkaufspreis,
                "menge": warenkorbList[warenkorbID].menge,
                "lager": -1,
                "produkte": []
            };
            let add = false;
            for (let j = 0; j < results[i].Produkts.length; j++) {
                if (results[i].Produkts[j].Produktkategorie.name === req.params.category)
                    add = true;
                if (!artikelObject.lieferant)
                    artikelObject.lieferant = results[i].Produkts[j].Lieferant.name;
                else
                    artikelObject.lieferant += "&" + results[i].Produkts[j].Lieferant.name;
                artikelObject.produkte.push(results[i].Produkts[j].name);
                if (artikelObject.lager === -1)
                    artikelObject.lager = results[i].Produkts[j].lagerbestand;
                else
                    artikelObject.lager = Math.min(artikelObject.lager, results[i].Produkts[j].lagerbestand);
            }
            artikelList[warenkorbID] = artikelObject;
        }
        res.render('warenkorb', {
            warenkorb: warenkorb,
            artikel: artikelList
        });
    });
});

router.post('/checkout', function (req, res, next) {
    let warenkorb = new Warenkorb(req.session.warenkorb ? req.session.warenkorb : {});
    let warenkorbIDs = [];
    for (let i = 0; i < warenkorb.getItems().length; i++)
        warenkorbIDs.push(warenkorb.getItems()[i].artikel_id);

    let order = {};
    order.datum = new Date().toString();
    order.status = false;
    order.kunde_ID = 11;

    req.models.Kundenbestellung.create(order).then(function (kundenbestellung) {
        req.models.Artikel.findAll({
            where: {
                artikel_id: warenkorbIDs
            }
        }).then(function (results) {
            kundenbestellung.setArtikels(results);
            warenkorb.clear();
            req.session.warenkorb = warenkorb;
            return res.redirect('back');
        });
    });
});

module.exports = router;
