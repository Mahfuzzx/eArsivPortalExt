function updateNoteUI() {
    const notElement = $('div[rel="not"] textarea');

    if (notElement.length) {
        let not = notElement.val();

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
