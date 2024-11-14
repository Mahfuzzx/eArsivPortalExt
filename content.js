function updateNote() {
    // "rel" attribute'u "odenecekTutar" olan td elementini bul
    let odenecekTutarElement = document.querySelector('td[rel="odenecekTutar"] input');

    if (odenecekTutarElement) {
        let valueToCopy = odenecekTutarElement.value;
        var num = Math.abs(Number(valueToCopy.replaceAll(".", "").replace(",", ".")));
        var txtRes = num2TextPart(num, "TL ") + num2TextPart(((num * 100) % 100).toFixed(), "Kr", true);

        // "rel" attribute'u "not" olan div elementini bul
        let notElement = document.querySelector('div[rel="not"] textarea');

        if (notElement) {
            var openBracket = notElement.value.indexOf("Yalnız ");
            if (openBracket == -1) notElement.value += "Yalnız " + txtRes.trim() + "'dir.";
            else {
                var closeBracket = notElement.value.indexOf("'dir.", openBracket) + 5;
                notElement.value = notElement.value.substring(0, openBracket) +
                    "Yalnız " + txtRes.trim() + "'dir." +
                    notElement.value.substring(closeBracket);
            }
            loadUserNote(notElement);
        }
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
            alert("Henüz kayıtlı kullanıcı yok.");
            return;
        }

        let listHTML = '<select id="userSelect" style="display: block; margin-bottom: 16px; border-bottom: 1px solid;"><option value="">Kullanıcı Seç</option>';
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
            <button class="btn waves-effect waves-light" id="saveUserButton">Kullanıcıyı Kaydet</button>
            <button style="margin-left: 16px;" class="btn waves-effect waves-light" id="editUserButton">Kullanıcıyı Düzenle</button>
            <button style="margin-left: 16px;" class="btn waves-effect waves-light" id="deleteUserButton">Kullanıcıyı Sil</button>
        `);

        $('#saveUserButton').on('click', saveUser);
        $('#editUserButton').on('click', editUser);
        $('#deleteUserButton').on('click', deleteUser);
    }
    else setInterval(updateNote, 500);
});

function loadUserNote(notElement) {
    let documentBody = $(document.body);
    let cmdEditNoteBtn = documentBody.find("#cmdEditNote");
    if (cmdEditNoteBtn.length == 0) {
        $(notElement).before(`<button type="button" id="cmdEditNote" class="csc-button">Notu Düzenle</button>`);
        cmdEditNoteBtn = documentBody.find("#lstNotes");
    }

    let userIDElement = document.querySelector('div[rel="userID"] p');

    if (userIDElement) var userID = userIDElement.innerText;

    // rest of the code...
}