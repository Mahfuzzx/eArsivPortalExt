function updateNote() {
    // "rel" attribute'u "odenecekTutar" olan td elementini bul
    var odenecekTutarElement = $('td[rel="odenecekTutar"] input');

    if (odenecekTutarElement.length) {
        var tutar = odenecekTutarElement.val();
        var num = Math.abs(Number(tutar.replaceAll(".", "").replace(",", ".")));
        var txtRes = num2TextPart(num, "TL ") + num2TextPart(((num * 100) % 100).toFixed(), "Kr", true);

        // "rel" attribute'u "not" olan div elementini bul
        var notElement = $('div[rel="not"] textarea');

        if (notElement.length) {
            var not = notElement.val();
            var yaziStart = not.indexOf("Yalnız ");
            if (yaziStart == -1) not += "Yalnız " + txtRes.trim() + "'dir.";
            else {
                var yaziEnd = not.indexOf("'dir.", yaziStart) + 5;
                not = not.substring(0, yaziStart) + "Yalnız " + txtRes.trim() + "'dir." + not.substring(yaziEnd);
            }

            var cmdEditNoteBtn = $("#cmdEditNote");
            if (cmdEditNoteBtn.length == 0) {
                notElement.before(`<button style="margin-bottom: 8px;" type="button" id="cmdEditNote" class="csc-button">Notu Düzenle</button>`);
                cmdEditNoteBtn = $("#cmdEditNote");
            }
            cmdEditNoteBtn.off("click").on("click", editUserNote);

            var userIDElement = $('div[rel="userID"] p');

            if (userIDElement.length) {
                const userID = userIDElement.text();
                loadUserNote(userID).then((userNote) => {
                    const userNoteText = userNote.text;
                    const userNoteTitle = userNote.title;
                    if (userNoteText != "" && not.indexOf(userNoteTitle + ":") == -1) not += "\n\n" + userNoteTitle + ":\n" + userNoteText;
                    notElement.val(not);
                });
            }
        }
    }
}

function loadUserNote(userID) {
    return new Promise((resolve) => {
        chrome.storage.local.get(["userNotes"], function (data) {
            const userNotes = data.userNotes || {};
            const userNote = userNotes[userID] || { title: '', text: '' };
            resolve(userNote);
        });
    });
}

function saveUserNote() {
    const userIDElement = $('div[rel="userID"] p');
    if (userIDElement.length) {
        const userID = userIDElement.text();
        const userNoteText = $("#userNoteText").val() ?? '';
        const userNoteTitle = $("#userNoteTitle").val() ?? '';

        chrome.storage.local.get(["userNotes"], function (data) {
            const userNotes = data.userNotes || {};
            userNotes[userID] = { title: userNoteTitle, text: userNoteText };

            chrome.storage.local.set({ userNotes }, function () {
                alert("Not başarıyla kaydedildi.");
                $('#dlgEditNote').fadeOut();
            });
        });
    }
}

function editUserNote() {
    const userIDElement = $('div[rel="userID"] p');
    if (userIDElement.length) {
        const userID = userIDElement.text();

        loadUserNote(userID).then((userNote) => {
            const userNoteText = userNote.text;
            const userNoteTitle = userNote.title;

            let editNoteDialog = $("#dlgEditNote");
            if (editNoteDialog.length == 0) {
                $(document.body).prepend(`
                    <div id="dlgEditNote" style="display: none;z-index: 2000; background-color: rgba(0, 0, 0, 0.5); position: fixed; inset: 0px;">
                        <div
                            style="background-color: #ffffff;position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);border: 1px solid #999;">
                            <div style="width: 100%;padding: 8px;background-color: #999;">
                                <span style="font-weight: bold;">Notu Düzenle</span>
                            </div>
                            <div style="padding: 16px;width: 286px;height: 194px;">
                                <table style="width: 100%;">
                                    <tbody>
                                        <tr>
                                            <td><label for="userNoteTitle">Başlık:</label></td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <input type="text" id="userNoteTitle"
                                                    style="width: 250px;margin-bottom: 8px;margin-top: 4px;">
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><label for="userNoteText">Not:</label></td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <textarea id="userNoteText" style="width: 250px;height: 100px;margin-top: 4px;"></textarea>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div
                                style="width: 100%;padding: 16px;background-color: lightgray;border-top: 1px solid #999;display: flex;flex-flow: row-reverse;">
                                <button onclick="$('#dlgEditNote').fadeOut()" style="padding: 8px 16px;margin-left: 16px;">İptal</button>
                                <button id="cmdSaveUserNote" style="padding: 8px 16px;">Kaydet</button>
                            </div>
                        </div>
                    </div>
                `);
                $("#cmdSaveUserNote").off("click").on("click", saveUserNote);
                editNoteDialog = $("#dlgEditNote");
            }

            $("#userNoteTitle").val(userNoteTitle);
            $("#userNoteText").val(userNoteText);
            editNoteDialog.fadeIn();
        });
    }
}

function num2TextPart(srcnum = 0, symb = "", returnEmpty = false) {
    if (srcnum == 0)
        if (returnEmpty) return "";
        else return "Sıfır" + symb;
    var num = Math.floor(srcnum);
    var txtRes = "";
    var birler = ["", "Bir", "İki", "Üç", "Dört", "Beş", "Altı", "Yedi", "Sekiz", "Dokuz"];
    var onlar = ["", "On", "Yirmi", "Otuz", "Kırk", "Elli", "Altmış", "Yetmiş", "Seksen", "Doksan"];
    var gruplar = ["", "Bin", "Milyon", "Milyar", "Trilyon"];
    var yüz = "Yüz";
    gruplar.forEach(grup => {
        var grupNum = num % 1000;
        var basamakBir = grupNum % 10;
        var basamakOn = Math.floor(grupNum / 10) % 10;
        var basamakYüz = Math.floor(grupNum / 100) % 10;
        txtRes = (basamakYüz > 1 ? birler[basamakYüz] : "")
            + (basamakYüz > 0 ? yüz : "")
            + onlar[basamakOn]
            + ((grup == "Bin" && grupNum == 1) ? "" : birler[basamakBir])
            + (grupNum > 0 ? grup : "") + txtRes;
        num = Math.floor(num / 1000);
    });
    return txtRes + (txtRes != "" ? symb : "");
}

// Kullanıcı listesini storage'den al ve alfabetik sırayla sırala
function getUserList(callback) {
    chrome.storage.local.get("userList", function (data) {
        const userList = data.userList || [];
        userList.sort((a, b) => a.identifier.localeCompare(b.identifier));
        callback(userList);
    });
}

// Güncellenmiş kullanıcı listesini kaydet ve listeyi yenile
function updateUserList(userList) {
    chrome.storage.local.set({ userList }, function () {
        alert("Kullanıcı listesi güncellendi.");
        $('#userSelect').remove();
        loadUserList();
    });
}

// Listeyi DOM'da oluştur
function loadUserList() {
    getUserList(userList => {
        if (userList.length === 0) {
            return;
        }

        var listHTML = '<select id="userSelect" style="display: block; margin-bottom: 32px; border-bottom: 1px solid;"><option value="">Kullanıcı Seç</option>';
        userList.forEach(user => {
            listHTML += `<option value="${user.username}">${user.identifier}</option>`;
        });
        listHTML += '</select>';

        $('#userid').parents('.input-field').before(listHTML);

        $('#userSelect').on('change', function () {
            const selectedUser = userList.find(user => user.username === this.value);
            if (selectedUser) {
                $('#userid').val(selectedUser.username);
                $('#password').val(selectedUser.password);
            } else {
                alert("Kullanıcı bilgisi bulunamadı.");
            }
        });
    });
}

// Kullanıcı kaydet
function saveUser() {
    const username = $('#userid').val().trim();
    const password = $('#password').val().trim();
    const identifier = prompt("Lütfen bu kullanıcı için bir tanımlayıcı girin:").trim();

    if (!username || !password || !identifier) {
        alert("Kullanıcı adı, parola ve tanımlayıcı alanları boş bırakılamaz.");
        return;
    }

    getUserList(userList => {
        const existingUserIndex = userList.findIndex(user => user.username === username);
        const identifierExists = userList.some(user => user.identifier === identifier && user.username !== username);

        if (identifierExists) {
            alert("Bu tanımlayıcı başka bir kullanıcı için kullanılıyor. Farklı bir tanımlayıcı girin.");
            return;
        }

        if (existingUserIndex !== -1) {
            userList[existingUserIndex].identifier = identifier;
        } else {
            userList.push({ username, password, identifier });
        }

        updateUserList(userList);
    });
}

// Kullanıcıyı düzenle
function editUser() {
    const selectedUsername = $('#userSelect').val();
    if (!selectedUsername) {
        alert("Lütfen düzenlemek için bir kullanıcı seçin.");
        return;
    }

    getUserList(userList => {
        const userToEdit = userList.find(user => user.username === selectedUsername);

        if (!userToEdit) {
            alert("Seçilen kullanıcı bilgisi bulunamadı.");
            return;
        }

        const newUsername = prompt("Yeni kullanıcı adını girin:", userToEdit.username).trim();
        const newPassword = prompt("Yeni parolayı girin:", userToEdit.password).trim();
        const newIdentifier = prompt("Yeni tanımlayıcı girin:", userToEdit.identifier).trim();

        if (!newUsername || !newPassword || !newIdentifier) {
            alert("Tüm bilgileri girmeniz gerekiyor.");
            return;
        }

        const identifierExists = userList.some(user => user.identifier === newIdentifier && user.username !== selectedUsername);

        if (identifierExists) {
            alert("Bu tanımlayıcı başka bir kullanıcı için kullanılıyor. Farklı bir tanımlayıcı girin.");
            return;
        }

        const updatedList = userList.filter(user => user.username !== selectedUsername);
        updatedList.push({ username: newUsername, password: newPassword, identifier: newIdentifier });
        updateUserList(updatedList);
    });
}

// Kullanıcıyı sil
function deleteUser() {
    const selectedUsername = $('#userSelect').val();
    if (!selectedUsername) {
        alert("Lütfen silmek için bir kullanıcı seçin.");
        return;
    }

    if (!confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) {
        return;
    }

    getUserList(userList => {
        const updatedList = userList.filter(user => user.username !== selectedUsername);
        if (updatedList.length === userList.length) {
            alert("Silinmek istenen kullanıcı bulunamadı.");
            return;
        }
        updateUserList(updatedList);
    });
}

// DOM yüklendiğinde çalıştır
$(document).ready(function () {
    if (document.location.href.indexOf("intragiris.html") > -1) {
        loadUserList();

        $('#userid').after(`
            <div style="margin-bottom: 32px">
            <button class="btn waves-effect waves-light" id="saveUserButton">Kullanıcıyı Kaydet</button>
            <button style="margin-left: 16px;" class="btn waves-effect waves-light" id="editUserButton">Kullanıcıyı Düzenle</button>
            <button style="margin-left: 16px;" class="btn waves-effect waves-light" id="deleteUserButton">Kullanıcıyı Sil</button>
            </div>
        `);

        $('#saveUserButton').on('click', saveUser);
        $('#editUserButton').on('click', editUser);
        $('#deleteUserButton').on('click', deleteUser);
    }
    else setInterval(updateNote, 500);
});
