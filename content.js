function updateFaturaPage() {
    updateYaziTutar();
    updateNoteUI();
    updateCustomerUI();
}

// DOM yüklendiğinde çalıştır
$(document).ready(function () {
    /*const customerList = []; // reset
    chrome.storage.local.set({ customerList });*/
    if (document.location.href == "https://earsivportal.efatura.gov.tr/") document.location.href = "https://earsivportal.efatura.gov.tr/intragiris.html";
    if (document.location.href.indexOf("intragiris.html") > -1) {
        loadUserList();

        $('#userid').after(userControlButtons);

        $('#saveUserButton').on('click', saveUser);
        $('#editUserButton').on('click', editUser);
        $('#deleteUserButton').on('click', deleteUser);
        $('#exportDataButton').on('click', exportData);
        $('#importDataButton').on('click', importData);
        $('#clearDataButton').on('click', clearAllData);
    }
    else setInterval(updateFaturaPage, 500);
});
