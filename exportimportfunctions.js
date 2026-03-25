// Tüm kaydedilmiş verileri dışa aktar
function exportData() {
    chrome.storage.local.get(["userList", "customerList", "userNotes"], function (data) {
        const exportData = {
            userList: data.userList || [],
            customerList: data.customerList || {}, // customerList object'tir (userVKN'ye göre indexed)
            userNotes: data.userNotes || {},
            exportDate: new Date().toISOString(),
            version: "1.0"
        };

        // Debug bilgisi
        console.log("[exportData] Dışa aktarılacak veriler:", exportData);
        
        // Müşteri sayısını hesapla
        let totalCustomers = 0;
        Object.values(exportData.customerList).forEach(userCustomers => {
            if (Array.isArray(userCustomers)) {
                totalCustomers += userCustomers.length;
            }
        });

        // JSON dosyası oluştur ve indir
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `earsiv-portal-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        const message = `Veriler başarıyla dışa aktarıldı!\n\n` +
            `- Kaydedilmiş Kullanıcılar: ${exportData.userList.length}\n` +
            `- Kaydedilmiş Müşteriler: ${totalCustomers}\n` +
            `- Kaydedilmiş Notlar: ${Object.keys(exportData.userNotes).length}`;
        
        alert(message);
    });
}

// Verileri içe aktar
function importData() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    
    input.onchange = function (e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (event) {
            try {
                const importedData = JSON.parse(event.target.result);

                console.log("[importData] İçe aktarılan veriler:", importedData);

                // Veri geçerliliğini kontrol et
                if (!importedData.userList && !importedData.customerList && !importedData.userNotes) {
                    alert("Hata: Geçersiz yedek dosyası. İçe aktarılacak veri bulunamadı.");
                    return;
                }

                // Müşteri sayısını hesapla
                let totalCustomers = 0;
                if (importedData.customerList && typeof importedData.customerList === 'object') {
                    Object.values(importedData.customerList).forEach(userCustomers => {
                        if (Array.isArray(userCustomers)) {
                            totalCustomers += userCustomers.length;
                        }
                    });
                }

                // Kullanıcıdan onay al
                const confirmMessage = `Yedek Bilgileri:\n\n` +
                    `- Kaydedilmiş Kullanıcılar: ${importedData.userList ? importedData.userList.length : 0}\n` +
                    `- Kaydedilmiş Müşteriler: ${totalCustomers}\n` +
                    `- Kaydedilmiş Notlar: ${importedData.userNotes ? Object.keys(importedData.userNotes).length : 0}\n\n` +
                    (importedData.exportDate ? `Yedek Tarihi: ${new Date(importedData.exportDate).toLocaleString('tr-TR')}\n\n` : '') +
                    `UYARI: Mevcut veriler üzerine yazılacak. Devam etmek istiyor musunuz?`;

                if (!confirm(confirmMessage)) {
                    alert("İçe aktarma iptal edildi.");
                    document.body.removeChild(input);
                    return;
                }

                // Verileri kaydet
                const dataToSave = {
                    userList: importedData.userList || [],
                    customerList: importedData.customerList || {},
                    userNotes: importedData.userNotes || {}
                };

                console.log("[importData] Storage'a kaydedilecek veriler:", dataToSave);

                chrome.storage.local.set(dataToSave, function () {
                    alert("Veriler başarıyla içe aktarıldı! Sayfayı yenileyiniz.");
                    document.body.removeChild(input);
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                });

            } catch (error) {
                console.error("[importData] Hata:", error);
                alert("Hata: Dosya okunurken bir sorun oluştu. Lütfen geçerli bir JSON dosyası seçiniz.\n\n" + error.message);
                document.body.removeChild(input);
            }
        };

        reader.onerror = function () {
            alert("Hata: Dosya okunamadı.");
            document.body.removeChild(input);
        };

        reader.readAsText(file);
    };

    document.body.appendChild(input);
    input.click();
}

// Verileri tamamen sil (sıfırla)
function clearAllData() {
    const confirmMessage = `UYARI: Tüm kaydedilmiş veriler silinecek!\n\n` +
        `- Tüm Kullanıcılar\n` +
        `- Tüm Müşteriler\n` +
        `- Tüm Notlar\n\n` +
        `Bu işlem geri alınamaz. Devam etmek istiyor musunuz?`;

    if (!confirm(confirmMessage)) {
        alert("İşlem iptal edildi.");
        return;
    }

    if (!confirm("Emin misiniz? Bu işlem geri alınamaz!")) {
        alert("İşlem iptal edildi.");
        return;
    }

    chrome.storage.local.clear(function () {
        alert("Tüm veriler başarıyla silindi. Sayfayı yenileyiniz.");
        window.location.reload();
    });
}
