function updateNoteUI() {
    const notElement = $('div[rel="not"] textarea');

    if (notElement.length) {
        let not = notElement.val();

        let cmdEditNoteBtn = $("#cmdEditNote");
        if (cmdEditNoteBtn.length == 0) {
            notElement.before(editNoteButton);
            cmdEditNoteBtn = $("#cmdEditNote");
            cmdEditNoteBtn.off("click").on("click", editUserNote);
        }
        

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
        const userNoteText = $("#txtUserNoteText").val() ?? '';
        const userNoteTitle = $("#txtUserNoteTitle").val() ?? '';

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
        $(document.body).prepend(dialogEditNote);
        $("#cmdSaveUserNote").off("click").on("click", saveUserNote);
        editNoteDialog = $("#dlgEditNote");
    }

    const userIDElement = $('div[rel="userID"] p');
    if (userIDElement.length) {
        loadUserNote(userIDElement.text()).then((userNote) => {
            $("#txtUserNoteTitle").val(userNote.title);
            $("#txtUserNoteText").val(userNote.text);
            editNoteDialog.fadeIn();
        });
    }
}
