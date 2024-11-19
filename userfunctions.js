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

        let listHTML = userListHTML;
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
