const
    userControlButtons = `
<div class="margin-bottom-32">
    <div class="margin-bottom-8">
        <button style="background-color: #4CAF50;" class="btn waves-effect waves-light" id="saveUserButton">Kullanıcıyı Kaydet</button>
        <button style="margin-left: 16px; background-color: #2196F3;" class="btn waves-effect waves-light" id="editUserButton">Kullanıcıyı Düzenle</button>
        <button style="margin-left: 16px; background-color: #f44336;" class="btn waves-effect waves-light" id="deleteUserButton">Kullanıcıyı Sil</button>
    </div>
    <div>
        <button style="background-color: #4CAF50;" class="btn waves-effect waves-light" id="exportDataButton">Verileri Dışa Aktar</button>
        <button style="margin-left: 8px; background-color: #2196F3;" class="btn waves-effect waves-light" id="importDataButton">Verileri İçe Aktar</button>
        <button style="margin-left: 8px; background-color: #f44336;" class="btn waves-effect waves-light" id="clearDataButton">Tümünü Sil</button>
    </div>
</div>
`,
    customersButton = `<button type="button" id="cmdCustomers" class="margin-left-8 csc-button">Müşteriler...</button>`,
    dialogCustomerList = `
<div id="dlgCustomerList" class="dialog modal-layer">
    <div class="dialog-frame">
        <div class="dialog-header padding-8">
            <span>Müşteri Seç/Kaydet</span>
        </div>
        <div class="flex">
            <div class="padding-16 width-min">
                <label for="lstCustomers">Müşteriler:</label>
                <select class="margin-top-4" style="width: 200px;height: 401px;" size="2" id="lstCustomers">
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
                                    <input class="margin-bottom-8 margin-top-4 padding-4" type="text" id="txtLastName" style="width: 15em;">
                                </td>
                            </tr>
                            <tr>
                                <td><label for="txtTitle">Ünvanı:</label></td>
                            </tr>
                            <tr>
                                <td>
                                    <input class="margin-bottom-8 margin-top-4 padding-4" type="text" id="txtTitle" style="width: 100%;">
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div>
                        <label>Adresler:</label>
                        <div class="editlist">
                            <div class="empty row">
                                <input class="chk" tabindex="-1" type="checkbox">
                                <input class="txt" type="text" class="padding-4">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="padding-top-8" style="display: flex;">
                    <button class="padding-4-8 margin-right-8" id="cmdNewCustomer">Yeni</button>
                    <button class="padding-4-8 margin-right-8" id="cmdSaveCustomer">Kaydet</button>
                    <button class="padding-4-8" id="cmdDeleteCustomer">Sil</button>
                </div>
            </div>
        </div>
        <div class="dialog-footer padding-8-16">
            <button class="margin-left-16 padding-8-16" onclick="$('#dlgCustomerList').fadeOut()">Kapat</button>
            <button class="padding-8-16" id="cmdSelectCustomer">Seç</button>
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
                            <input class="margin-bottom-8 margin-top-4 padding-4" type="text" id="txtUserNoteTitle" style="width: 100%;">
                        </td>
                    </tr>
                    <tr>
                        <td><label for="txtUserNoteText">Not:</label></td>
                    </tr>
                    <tr>
                        <td>
                            <textarea id="txtUserNoteText" class="margin-top-4 padding-4" style="width: 350px;height: 152px;resize: none;"></textarea>
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
`,
    dialogProductList = `
<div id="dlgProductList" class="dialog modal-layer">
    <div class="dialog-frame">
        <div class="dialog-header padding-8">
            <span>Ürün Seç/Kaydet</span>
        </div>
        <div class="flex">
            <div class="padding-16 width-min">
                <label for="lstProducts">Ürünler:</label>
                <select class="margin-top-4" style="width: 220px; height: 321px;" size="2" id="lstProducts"></select>
            </div>
            <div class="padding-16-32" style="width: 340px;">
                <div class="padding-8 border">
                    <table style="width: 100%;">
                        <tbody>
                            <tr>
                                <td><label for="txtProductName">Ürün Adı:</label></td>
                            </tr>
                            <tr>
                                <td>
                                    <input class="margin-bottom-8 margin-top-4 padding-4" type="text" id="txtProductName" style="width: 100%;">
                                </td>
                            </tr>
                            <tr>
                                <td><label for="selProductUnit">Birim:</label></td>
                            </tr>
                            <tr>
                                <td>
                                    <select class="margin-bottom-8 margin-top-4 padding-4" id="selProductUnit" style="width: 100%;">
                                        <option value="">-----</option>
                                        <option value="DAY">Gün</option>
                                        <option value="MON">Ay</option>
                                        <option value="ANN">Yıl</option>
                                        <option value="HUR">Saat</option>
                                        <option value="D61">Dakika</option>
                                        <option value="D62">Saniye</option>
                                        <option value="C62">Adet</option>
                                        <option value="PA">Paket</option>
                                        <option value="BX">Kutu</option>
                                        <option value="MGM">mg</option>
                                        <option value="GRM">g</option>
                                        <option value="KGM">kg</option>
                                        <option value="LTR">lt</option>
                                        <option value="TNE">ton</option>
                                        <option value="NT">Net Ton</option>
                                        <option value="GT">Gross ton</option>
                                        <option value="MMT">mm</option>
                                        <option value="CMT">cm</option>
                                        <option value="MTR">m</option>
                                        <option value="KTM">km</option>
                                        <option value="MLT">ml</option>
                                        <option value="MMQ">mm3</option>
                                        <option value="CMK">cm2</option>
                                        <option value="CMQ">cm3</option>
                                        <option value="MTK">m2</option>
                                        <option value="MTQ">m3</option>
                                        <option value="KJO">kJ</option>
                                        <option value="CLT">cl</option>
                                        <option value="CT">KARAT</option>
                                        <option value="KWH">KWH</option>
                                        <option value="MWH">MWH</option>
                                        <option value="CCT">Ton baş.taşıma kap.</option>
                                        <option value="D30">Brüt kalori</option>
                                        <option value="D40">1000 lt</option>
                                        <option value="LPA">Saf alkol lt</option>
                                        <option value="B32">kg.m2</option>
                                        <option value="NCL">Hücre adet</option>
                                        <option value="PR">Çift</option>
                                        <option value="R9">1000 m3</option>
                                        <option value="SET">Set</option>
                                        <option value="T3">1000 adet</option>
                                        <option value="Q37">SCM</option>
                                        <option value="Q39">NCM</option>
                                        <option value="J39">mmBTU</option>
                                        <option value="G52">CM³</option>
                                        <option value="DZN">Düzine</option>
                                        <option value="DMK">dm2</option>
                                        <option value="DMT">dm</option>
                                        <option value="HAR">ha</option>
                                        <option value="LM">Metretül (LM)</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td><label for="txtProductUnitPrice">Birim Fiyat:</label></td>
                            </tr>
                            <tr>
                                <td>
                                    <input class="margin-bottom-8 margin-top-4 padding-4" type="text" id="txtProductUnitPrice" placeholder="0" style="width: 100%;">
                                </td>
                            </tr>
                            <tr>
                                <td><label for="txtProductDiscount">İskonto Oranı (%):</label></td>
                            </tr>
                            <tr>
                                <td>
                                    <input class="margin-bottom-8 margin-top-4 padding-4" type="text" id="txtProductDiscount" value="0" style="width: 100%;">
                                </td>
                            </tr>
                            <tr>
                                <td><label for="selProductKDV">KDV Oranı:</label></td>
                            </tr>
                            <tr>
                                <td>
                                    <select class="margin-bottom-8 margin-top-4 padding-4" id="selProductKDV" style="width: 100%;">
                                        <option value="0"></option>
                                        <option value="1">1</option>
                                        <option value="8">8</option>
                                        <option value="10">10</option>
                                        <option value="18">18</option>
                                        <option value="20">20</option>
                                    </select>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="padding-top-8" style="display: flex;">
                    <button class="padding-4-8 margin-right-8" id="cmdNewProduct">Yeni</button>
                    <button class="padding-4-8 margin-right-8" id="cmdSaveProduct">Kaydet</button>
                    <button class="padding-4-8" id="cmdDeleteProduct">Sil</button>
                </div>
            </div>
        </div>
        <div class="dialog-footer padding-8-16">
            <button class="margin-left-16 padding-8-16" onclick="$('#dlgProductList').fadeOut()">Kapat</button>
            <button class="padding-8-16" id="cmdSelectProduct">Seç</button>
        </div>
    </div>
</div>
`;