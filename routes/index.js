const sequelize = require('sequelize');
const express = require('express');
const router = express.Router();
const Warenkorb = require('../lib/warenkorb');

/* GET home page. */
router.get('/', function (req, res, next) {
    req.models.Produktkategorie.findAll({
        includeIgnoreAttributes: false,
        group: ['kategorie_id', 'name', 'beschreibung'],
        attributes: ['name', 'beschreibung', [sequelize.fn('COUNT', 'artikel.artikel_id'), 'count']],
        include: [{
            model: req.models.Produkt,
            include: [{
                model: req.models.Artikel,
                required: true
            }]
        }]
    }).then(function (results) {
        res.render('index', {
            warenkorb: new Warenkorb(req.session.warenkorb ? req.session.warenkorb : {}),
            kategorien: results
        });
    });
});

router.post('/add', function (req, res, next) {
    let warenkorb = new Warenkorb(req.session.warenkorb ? req.session.warenkorb : {});
    warenkorb.add(parseInt(req.body.id), parseInt(req.body.menge), parseFloat(req.body.preis));
    req.session.warenkorb = warenkorb;
    return res.redirect('back');
});


router.get('/:category', function (req, res, next) {
    if ("category" in req.params && req.params.category) {
        req.models.Artikel.findAll({
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
            let artikelList = [];
            for (let i = 0; i < results.length; i++) {
                let artikelObject = {
                    "artikel_id": results[i].artikel_id,
                    "name": results[i].name,
                    "beschreibung": results[i].beschreibung,
                    "preis": results[i].verkaufspreis,
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
                if (add)
                    artikelList.push(artikelObject);
            }

            res.render('artikel', {
                warenkorb: new Warenkorb(req.session.warenkorb ? req.session.warenkorb : {}),
                artikel: artikelList
            });
        });
    } else
        next({status: 400, message: "Diese Produkt-Kategorie konnte nicht gefunden werden."});
});

module.exports = router;
