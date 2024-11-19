function updateMusteriUI() {
    const musteriVKNElement = $('td[rel="vknTckn"] input');
    if (musteriVKNElement.length) {
        let cmdMusterilerBtn = $("#cmdMusteriler");
        if (cmdMusterilerBtn.length == 0) {
            musteriVKNElement.after(musterilerButton);
            cmdMusterilerBtn = $("#cmdMusteriler");
            cmdMusterilerBtn.css({
                "height": musteriVKNElement.css("height"),
                "vertical-align": "top"
            });
            cmdMusterilerBtn.off("click").on("click", musterilerList);
        }
    }
}

function musterilerList() {
    let musteriListesiDialog = $("#dlgMusteriListesi");
    if (musteriListesiDialog.length == 0) {
        $(document.body).prepend(dialogMusteriListesi);
        musteriListesiDialog = $("#dlgMusteriListesi");
        $("#dlgMusteriListesi .editlist .empty .txt").off("focus").on("focus", function (e) {
            const emptyRow = $(this).parents(".row");
            emptyRow.find(".chk")[0].checked = false;
            const cloneRow = emptyRow.clone();
            emptyRow.before(cloneRow);
            cloneRow.toggleClass("empty tofill");
            cloneRow.find(".txt").on("blur", function (e) {
                const txtElement = $(this);
                const parentRow = txtElement.parents(".row");
                if (txtElement.val().trim() == '') {
                    txtElement.off("blur");
                    parentRow.remove();
                }
            }).trigger("focus");
        });
    }
    $("#dlgMusteriListesi input").val("");
    $("#dlgMusteriListesi option").remove();
    $("#dlgMusteriListesi .row.tofill").remove();
    $("#dlgMusteriListesi .chk")[0].checked = false;
    musteriListesiDialog.fadeIn();
}