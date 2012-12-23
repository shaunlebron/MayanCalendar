///////////
// Glyphs

Mayan.glyphSources = {
    // numerals
    "0": "img/0.gif",
    "1": "img/1.gif",
    "2": "img/2.gif",
    "3": "img/3.gif",
    "4": "img/4.gif",
    "5": "img/5.gif",
    "6": "img/6.gif",
    "7": "img/7.gif",
    "8": "img/8.gif",
    "9": "img/9.gif",
    "10": "img/10.gif",
    "11": "img/11.gif",
    "12": "img/12.gif",
    "13": "img/13.gif",
    "14": "img/14.gif",
    "15": "img/15.gif",
    "16": "img/16.gif",
    "17": "img/17.gif",
    "18": "img/18.gif",
    "19": "img/19.gif",

    // long count
    "baktun": "img/baktun.gif",
    "katun": "img/katun.gif",
    "tun": "img/tun.gif",
    "winal": "img/winal.gif",
    "kin": "img/kin.gif",

    // tzolkin
    "ajaw": "img/tzolkin/ajaw.gif",
    "akbal": "img/tzolkin/akbal.gif",
    "ben": "img/tzolkin/ben.gif",
    "chikchan": "img/tzolkin/chikchan.gif",
    "chuwen": "img/tzolkin/chuwen.gif",
    "eb": "img/tzolkin/eb.gif",
    "etznab": "img/tzolkin/etznab.gif",
    "ik": "img/tzolkin/ik.gif",
    "imix": "img/tzolkin/imix.gif",
    "ix": "img/tzolkin/ix.gif",
    "kaban": "img/tzolkin/kaban.gif",
    "kan": "img/tzolkin/kan.gif",
    "kawak": "img/tzolkin/kawak.gif",
    "kib": "img/tzolkin/kib.gif",
    "kimi": "img/tzolkin/kimi.gif",
    "lamat": "img/tzolkin/lamat.gif",
    "manik": "img/tzolkin/manik.gif",
    "men": "img/tzolkin/men.gif",
    "muluk": "img/tzolkin/muluk.gif",
    "ok": "img/tzolkin/ok.gif",

    // haab
    "chen": "img/haab/chen.gif",
    "kankin": "img/haab/kankin.gif",
    "kayab": "img/haab/kayab.gif",
    "keh": "img/haab/keh.gif",
    "kumku": "img/haab/kumku.gif",
    "mak": "img/haab/mak.gif",
    "mol": "img/haab/mol.gif",
    "muwan": "img/haab/muwan.gif",
    "pax": "img/haab/pax.gif",
    "pop": "img/haab/pop.gif",
    "sak": "img/haab/sak.gif",
    "sek": "img/haab/sek.gif",
    "sip": "img/haab/sip.gif",
    "sotz": "img/haab/sotz.gif",
    "wayeb": "img/haab/wayeb.gif",
    "wo": "img/haab/wo.gif",
    "xul": "img/haab/xul.gif",
    "yax": "img/haab/yax.gif",
    "yaxkin": "img/haab/yaxkin.gif",

    // lords of the night
    "g1": "img/g1.gif",
    "g2": "img/g2.gif",
    "g3": "img/g3.gif",
    "g4": "img/g4.gif",
    "g5": "img/g5.gif",
    "g6": "img/g6.gif",
    "g7": "img/g7.gif",
    "g8": "img/g8.gif",
    "g9": "img/g9.gif",
};

Mayan.glyphImages = {};

Mayan.loadGlyphs = function() {
    var sources = Mayan.glyphSources;
    for (name in sources) {
        if (sources.hasOwnProperty(name)) {
            var img = new Image();
            img.src = sources[name];
            Mayan.glyphImages[name] = img;
        }
    }
};
