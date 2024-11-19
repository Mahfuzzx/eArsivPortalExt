const
    userControlButtons = `
<div class="margin-bottom-32">
    <button class="btn waves-effect waves-light" id="saveUserButton">Kullanıcıyı Kaydet</button>
    <button style="margin-left: 16px;" class="btn waves-effect waves-light" id="editUserButton">Kullanıcıyı Düzenle</button>
    <button style="margin-left: 16px;" class="btn waves-effect waves-light" id="deleteUserButton">Kullanıcıyı Sil</button>
</div>
`,
    musterilerButton = `<button type="button" id="cmdMusteriler" class="margin-left-8 csc-button">Müşteriler...</button>`,
    dialogMusteriListesi = `
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
                <div class="padding-top-8" style="display: flex;">
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
`,
    userListHTML = `<select id="userSelect" class="margin-bottom-32" style="display: block; border-bottom: 1px solid;"><option value="">Kullanıcı Seç</option>`,
    editNoteButton = `<button type="button" id="cmdEditNote" class="margin-bottom-8 csc-button">Notu Düzenle</button>`,
    dialogEditNote = `
<div id="dlgEditNote" class="dialog modal-layer">
    <div class="dialog-frame">
        <div class="dialog-header padding-8">
            <span>Notu Düzenle</span>
        </div>
        <div class="padding-16">
            <table style="width: 100%;">
                <tbody>
                    <tr>
                        <td><label for="txtUserNoteTitle">Başlık:</label></td>
                    </tr>
                    <tr>
                        <td>
                            <input class="margin-bottom-8 margin-top-4 padding-4" type="text" id="txtUserNoteTitle"
                                style="width: 100%;">
                        </td>
                    </tr>
                    <tr>
                        <td><label for="txtUserNoteText">Not:</label></td>
                    </tr>
                    <tr>
                        <td>
                            <textarea id="txtUserNoteText" class="margin-top-4 padding-4"
                                style="width: 350px;height: 152px;resize: none;"></textarea>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="dialog-footer padding-8-16">
            <button class="margin-left-16 padding-8-16" onclick="$('#dlgEditNote').fadeOut()">İptal</button>
            <button class="padding-8-16" id="cmdSaveUserNote">Kaydet</button>
        </div>
    </div>
</div>
`