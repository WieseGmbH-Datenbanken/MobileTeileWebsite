module.exports = function Warenkorb(session_wagen) {
    this.items = session_wagen.items || [];
    this.gesamtMenge = session_wagen.gesamtMenge || 0;
    this.gesamtPreis = session_wagen.gesamtPreis || 0;

    this.add = function (artikel_id, menge, preis) {
        let added = false;
        for (let id = 0; id < this.items.length; id++)
            if (this.items[id].artikel_id === artikel_id) {
                this.items[id].menge += menge;
                added = true;
                break;
            }
        if (!added)
            this.items.push({"artikel_id": artikel_id, "menge": menge, "preis": preis});
        this.gesamtMenge += menge;
        this.gesamtPreis += menge * preis;
    };

    this.remove = function (id) {
        this.gesamtMenge -= this.items[id].menge;
        this.gesamtPreis -= this.items[id].menge * this.items[id].preis;
        delete this.items[id];
    };

    this.getItems = function () {
        let arr = [];
        for (let id = 0; id < this.items.length; id++)
            arr.push(this.items[id]);
        return arr;
    };

    this.clear = function () {
        while(this.items.length > 0)
            this.items.pop();
        this.gesamtMenge = 0;
        this.gesamtPreis = 0;
    };
};