function updateNote() {
    // "rel" attribute'u "odenecekTutar" olan td elementini bul
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

            let cmdEditNoteBtn = $("#cmdEditNote");
            if (cmdEditNoteBtn.length == 0) {
                notElement.before(`<button type="button" id="cmdEditNote" class="margin-bottom-8 csc-button">Notu Düzenle</button>`);
                cmdEditNoteBtn = $("#cmdEditNote");
            }
            cmdEditNoteBtn.off("click").on("click", editUserNote);

            const userIDElement = $('div[rel="userID"] p');

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
    let editNoteDialog = $("#dlgEditNote");
    if (editNoteDialog.length == 0) {
        $(document.body).prepend(`
            <div id="dlgEditNote">
                <div class="dialog-frame">
                    <div class="dialog-header padding-8">
                        <span>Notu Düzenle</span>
                    </div>
                    <div class="padding-16">
                        <table style="width: 100%;">
                            <tbody>
                                <tr>
                                    <td><label for="userNoteTitle">Başlık:</label></td>
                                </tr>
                                <tr>
                                    <td>
                                        <input class="margin-bottom-8 margin-top-4 padding-4" type="text" id="userNoteTitle"
                                            style="width: 100%;">
                                    </td>
                                </tr>
                                <tr>
                                    <td><label for="userNoteText">Not:</label></td>
                                </tr>
                                <tr>
                                    <td>
                                        <textarea id="userNoteText" class="margin-top-4 padding-4"
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
        `);
        $("#cmdSaveUserNote").off("click").on("click", saveUserNote);
        editNoteDialog = $("#dlgEditNote");
    }

    const userIDElement = $('div[rel="userID"] p');
    if (userIDElement.length) {
        loadUserNote(userIDElement.text()).then((userNote) => {
            $("#userNoteTitle").val(userNote.title);
            $("#userNoteText").val(userNote.text);
            editNoteDialog.fadeIn();
        });
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

        let listHTML = '<select id="userSelect" class="margin-bottom-32" style="display: block; border-bottom: 1px solid;"><option value="">Kullanıcı Seç</option>';
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
                $("#formdiv").find("label").addClass("active");
            }
        });
    });
}

// Kullanıcı kaydet
function saveUser() {
    const username = $('#userid').val().trim();
    const password = $('#password').val().trim();
    const identifier = (prompt("Lütfen bu kullanıcı için bir tanımlayıcı girin:") ?? "").trim();

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

        const newUsername = (prompt("Yeni kullanıcı adını girin:", userToEdit.username) ?? "").trim();
        const newPassword = (prompt("Yeni parolayı girin:", userToEdit.password) ?? "").trim();
        const newIdentifier = (prompt("Yeni tanımlayıcı girin:", userToEdit.identifier) ?? "").trim();

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
    if (document.location.href == "https://earsivportal.efatura.gov.tr/") document.location.href = "https://earsivportal.efatura.gov.tr/intragiris.html";
    if (document.location.href.indexOf("intragiris.html") > -1) {
        loadUserList();

        $('#userid').after(`
            <div class="margin-bottom-32">
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
