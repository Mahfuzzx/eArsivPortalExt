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
            cmdMusterilerBtn.off("click").on("click", musterilerList);
        }
    }
}

function musterilerList() {
    let musteriListesiDialog = $("#dlgMusteriListesi");
    if (musteriListesiDialog.length == 0) {
        $(document.body).prepend(`
                <div id="dlgMusteriListesi" class="dialog modal-layer">
                    <div class="dialog-frame">
                        <div class="dialog-header padding-8">
                            <span>Müşteri Seç/Kaydet</span>
                        </div>
                        <div class="flex">
                            <div class="padding-16 width-min">
                                <label for="lstMusteriler">Müşteriler:</label>
                                <select class="margin-top-4" style="width: 200px;height: 401px;" size="2" id="lstMusteriler">
                                </select>
                            </div>
                            <div class="padding-16-32" style="width: 400px;">
                                <div class="padding-8 border">
                                    <table style="width: 100%;">
                                        <tbody>
                                            <tr>
                                                <td><label for="txtVKN">VKN/TCKN:</label></td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <input class="margin-bottom-8 margin-top-4 padding-4" maxlength="11" type="text" id="txtVKN" style="width: 15em;">
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><label for="txtName">Adı:</label></td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <input class="margin-bottom-8 margin-top-4 padding-4" type="text" id="txtName" style="width: 15em;">
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><label for="txtLastName">Soyadı:</label></td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <input class="margin-bottom-8 margin-top-4 padding-4" type="text" id="txtLastName"
                                                        style="width: 15em;">
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><label for="txtTitle">Ünvanı:</label></td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <input class="margin-bottom-8 margin-top-4 padding-4" type="text" id="txtTitle"
                                                        style="width: 100%;">
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div>
                                        <label>Adresler:</label>
                                        <div class="editlist">
                                            <div class="empty row">
                                                <input class="chk" type="checkbox">
                                                <input class="txt" type="text" class="padding-4">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="padding-top-16" style="display: flex;">
                                    <button class="padding-4-8 margin-right-8">Kaydet</button>
                                    <button class="padding-4-8">Sil</button>
                                </div>
                            </div>
                        </div>
                        <div class="dialog-footer padding-8-16">
                            <button class="margin-left-16 padding-8-16" onclick="$('#dlgMusteriListesi').fadeOut()">Kapat</button>
                            <button class="padding-8-16" id="cmdSelectMusteri">Seç</button>
                        </div>
                    </div>
                </div>
            `);
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