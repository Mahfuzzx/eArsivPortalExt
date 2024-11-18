function updateYaziTutar() {
    const odenecekTutarElement = $('td[rel="odenecekTutar"] input');

    if (odenecekTutarElement.length) {
        const tutar = odenecekTutarElement.val();
        const num = Math.abs(Number(tutar.replaceAll(".", "").replace(",", ".")));
        const txtRes = num2TextPart(num, "TL ") + num2TextPart(((num * 100) % 100).toFixed(), "Kr", true);

        // "rel" attribute'u "not" olan div elementini bul
        const notElement = $('div[rel="not"] textarea');

        if (notElement.length) {
            let not = notElement.val();

            const yaziStart = not.indexOf("Yalnız ");
            if (yaziStart == -1) not += "Yalnız " + txtRes.trim() + "'dir.";
            else {
                const yaziEnd = not.indexOf("'dir.", yaziStart) + 5;
                not = not.substring(0, yaziStart) + "Yalnız " + txtRes.trim() + "'dir." + not.substring(yaziEnd);
            }
            notElement.val(not);
        }
    }
}

function num2TextPart(srcnum = 0, symb = "", returnEmpty = false) {
    if (srcnum == 0)
        if (returnEmpty) return "";
        else return "Sıfır" + symb;
    const birler = ["", "Bir", "İki", "Üç", "Dört", "Beş", "Altı", "Yedi", "Sekiz", "Dokuz"];
    const onlar = ["", "On", "Yirmi", "Otuz", "Kırk", "Elli", "Altmış", "Yetmiş", "Seksen", "Doksan"];
    const gruplar = ["", "Bin", "Milyon", "Milyar", "Trilyon"];
    let num = Math.floor(srcnum);
    let txtRes = "";
    gruplar.forEach(grup => {
        const grupNum = num % 1000;
        const basamakBir = grupNum % 10;
        const basamakOn = Math.floor(grupNum / 10) % 10;
        const basamakYüz = Math.floor(grupNum / 100) % 10;
        txtRes = (basamakYüz > 1 ? birler[basamakYüz] : "")
            + (basamakYüz > 0 ? "Yüz" : "")
            + onlar[basamakOn]
            + ((grup == "Bin" && grupNum == 1) ? "" : birler[basamakBir])
            + (grupNum > 0 ? grup : "") + txtRes;
        num = Math.floor(num / 1000);
    });
    return txtRes + (txtRes != "" ? symb : "");
}
