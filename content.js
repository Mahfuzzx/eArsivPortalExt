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
    else setInterval(updateFaturaPage, 500);
});
