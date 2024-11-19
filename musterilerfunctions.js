function updateMusteriUI() {
    const musteriVKNElement = $('td[rel="vknTckn"] input');
    if (musteriVKNElement.length) {
        let cmdMusterilerBtn = $("#cmdMusteriler");
        if (cmdMusterilerBtn.length == 0) {
            musteriVKNElement.after(`<button type="button" id="cmdMusteriler" class="margin-left-8 csc-button">Müşteriler...</button>`);
            cmdMusterilerBtn = $("#cmdMusteriler");
            cmdMusterilerBtn.css({
                "height": musteriVKNElement.css("height"),
                "vertical-align": "top"
            });
        }
        cmdMusterilerBtn.off("click").on("click", musterilerList);
    }
}

function musterilerList() {

}