function updateFaturaPage() {
    updateYaziTutar();
    updateNoteUI();
    updateMusteriUI();
}

// DOM yüklendiğinde çalıştır
$(document).ready(function () {
    if (document.location.href == "https://earsivportal.efatura.gov.tr/") document.location.href = "https://earsivportal.efatura.gov.tr/intragiris.html";
    if (document.location.href.indexOf("intragiris.html") > -1) {
        loadUserList();

        $('#userid').after(userControlButtons);

        $('#saveUserButton').on('click', saveUser);
        $('#editUserButton').on('click', editUser);
        $('#deleteUserButton').on('click', deleteUser);
    }
    else setInterval(updateFaturaPage, 500);
});
