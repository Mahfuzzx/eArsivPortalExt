// ── Yardımcı: input'a değer atayıp change/input event'i tetikle ──────────────
function setInputValue(input, value) {
    if (!input || !input.length) return;
    input.val(value);
    input[0].dispatchEvent(new Event("change", { bubbles: true }));
    input[0].dispatchEvent(new Event("input", { bubbles: true }));
}

// ── Storage işlemleri ─────────────────────────────────────────────────────────
function getProductList(callback) {
    const userVKN = getUserVKN();
    if (!userVKN) {
        console.warn("[getProductList] userVKN boş, varsayılan liste döndürülüyor.");
        callback([]);
        return;
    }
    chrome.storage.local.get("productList", function (data) {
        let productList = data.productList;
        if (!productList || Array.isArray(productList) || typeof productList !== 'object') {
            console.warn("[getProductList] productList geçersiz, boş liste döndürülüyor.");
            productList = {};
        }
        const usersProductList = productList[userVKN] || [];
        usersProductList.sort((a, b) => a.productName.localeCompare(b.productName, 'tr'));
        callback(usersProductList);
    });
}

function updateProductList(newProductList) {
    const userVKN = getUserVKN();
    if (!userVKN) {
        alert("Hata: Kullanıcı VKN alınamadı. Lütfen sayfayı yenileyiniz.");
        console.error("[updateProductList] userVKN boş");
        return;
    }
    chrome.storage.local.get("productList", function (data) {
        let allProductLists = data.productList;
        if (!allProductLists || Array.isArray(allProductLists) || typeof allProductLists !== 'object') {
            allProductLists = {};
        }
        allProductLists[userVKN] = newProductList;
        chrome.storage.local.set({ productList: allProductLists }, function () {
            console.log("[updateProductList] Ürün listesi kaydedildi.", newProductList);
            loadProductList();
        });
    });
}

// ── UI Güncelleme: her satıra "Ürünler..." butonu ekle ───────────────────────
function updateProductUI() {
    const table = $("table[rel='malHizmetTable']");
    if (!table.length) return;

    table.find("tbody tr[rowid]").each(function () {
        const row = $(this);
        const rowID = row.attr("rowid");
        // Buton zaten eklenmiş mi?
        if (row.find(".cmd-products-btn").length) return;

        // 4. td: malHizmet input
        const malHizmetTd = row.find("td").eq(3);
        if (!malHizmetTd.length) return;

        const btn = $(`<button type="button" class="margin-left-8 csc-button cmd-products-btn">Ürünler...</button>`);
        malHizmetTd.append(btn);
        btn.css({
            "height": malHizmetTd.find("input").css("height"),
            "vertical-align": "top"
        });
        btn.on("click", function () {
            loadProductListDialog(row);
        });
    });
}

// ── Dialog Aç ────────────────────────────────────────────────────────────────
function loadProductListDialog(targetRow) {
    let dlg = $("#dlgProductList");
    if (dlg.length === 0) {
        $(document.body).prepend(dialogProductList);
        dlg = $("#dlgProductList");

        $("#cmdNewProduct").off("click").on("click", emptyProductFields);
        $("#cmdSaveProduct").off("click").on("click", saveProduct);
        $("#cmdDeleteProduct").off("click").on("click", deleteProduct);
        $("#cmdSelectProduct").off("click").on("click", function () {
            selectProduct(targetRow);
        });

        $("#lstProducts").off("change").on("change", function () {
            getProductList(productList => {
                const selected = productList.find(p => p.productName === this.value);
                if (selected) fillProductFields(selected);
            });
        });
    } else {
        // Dialog zaten var; select butonunu güncel satıra bağla
        $("#cmdSelectProduct").off("click").on("click", function () {
            selectProduct(targetRow);
        });
    }

    emptyProductFields();
    loadProductList();
    dlg.fadeIn();
}

// ── Liste yükle ───────────────────────────────────────────────────────────────
function loadProductList() {
    const lst = $("#lstProducts");
    if (!lst.length) return;
    lst.empty();
    getProductList(productList => {
        if (!productList.length) return;
        productList.forEach(p => {
            lst.append(`<option value="${escapeHtml(p.productName)}">${escapeHtml(p.productName)}</option>`);
        });
    });
}

// ── Alan doldur / temizle ─────────────────────────────────────────────────────
function fillProductFields(product) {
    $("#txtProductName").val(product.productName || '');
    $("#selProductUnit").val(product.productUnit || '');
    $("#txtProductUnitPrice").val(product.productUnitPrice || '');
    $("#txtProductDiscount").val(product.productDiscountRate || '0');
    $("#selProductKDV").val(product.productKDV || '0');
}

function emptyProductFields() {
    $("#lstProducts").val('');
    $("#txtProductName").val('');
    $("#selProductUnit").val('');
    $("#txtProductUnitPrice").val('');
    $("#txtProductDiscount").val('0');
    $("#selProductKDV").val('0');
}

// ── Kaydet ────────────────────────────────────────────────────────────────────
function saveProduct() {
    try {
        const productName = $("#txtProductName").val().trim();
        const productUnit = $("#selProductUnit").val();
        const productUnitPrice = $("#txtProductUnitPrice").val().trim();
        const productDiscountRate = $("#txtProductDiscount").val().trim();
        const productKDV = $("#selProductKDV").val();

        if (!productName) throw new Error("Ürün adı boş bırakılamaz.");
        if (!productUnit) throw new Error("Birim seçilmelidir.");
        if (productUnitPrice === '') throw new Error("Birim fiyat boş bırakılamaz.");

        const productData = { productName, productUnit, productUnitPrice, productDiscountRate, productKDV };

        getProductList(productList => {
            const idx = productList.findIndex(p => p.productName === productName);
            if (idx !== -1) {
                productList[idx] = productData;
                console.log("[saveProduct] Ürün güncellendi:", productData);
            } else {
                productList.push(productData);
                console.log("[saveProduct] Yeni ürün eklendi:", productData);
            }
            updateProductList(productList);
            alert("Ürün başarıyla kaydedildi.");
        });
    } catch (error) {
        console.error("[saveProduct] Hata:", error);
        alert(error.message);
    }
}

// ── Sil ───────────────────────────────────────────────────────────────────────
function deleteProduct() {
    const selectedOption = $("#lstProducts option:selected");
    if (!selectedOption.length || !selectedOption.val()) {
        alert("Lütfen silmek için bir ürün seçin.");
        return;
    }
    const productName = selectedOption.val();
    if (!confirm(`"${productName}" ürününü silmek istediğinizden emin misiniz?`)) return;

    getProductList(productList => {
        const updated = productList.filter(p => p.productName !== productName);
        if (updated.length === productList.length) {
            alert("Silinmek istenen ürün bulunamadı.");
            return;
        }
        updateProductList(updated);
        emptyProductFields();
    });
}

// ── Seç: ilgili fatura satırına bilgileri doldur ──────────────────────────────
function selectProduct(row) {
    try {
        const productName = $("#txtProductName").val().trim();
        const productUnit = $("#selProductUnit").val();
        const productUnitPrice = $("#txtProductUnitPrice").val().trim();
        const productDiscountRate = $("#txtProductDiscount").val().trim();
        const productKDV = $("#selProductKDV").val();

        if (!productName) throw new Error("Ürün adı boş. Lütfen listeden bir ürün seçin veya yeni ürün girin.");
        if (!productUnit) throw new Error("Birim seçilmelidir.");

        const tds = row.find("td");

        // td[3]: Mal/Hizmet adı
        setInputValue(tds.eq(3).find("input[type='text']").first(), productName);

        // td[5]: Birim (select)
        const birimSelect = tds.eq(5).find("select");
        birimSelect.val(productUnit);
        birimSelect[0].dispatchEvent(new Event("change", { bubbles: true }));

        // td[6]: Birim Fiyat
        setInputValue(tds.eq(6).find("input"), productUnitPrice);

        // td[7]: İskonto Oranı
        setInputValue(tds.eq(7).find("input"), productDiscountRate || '0');

        // td[10]: KDV Oranı (select)
        const kdvSelect = tds.eq(10).find("select");
        kdvSelect.val(productKDV);
        kdvSelect[0].dispatchEvent(new Event("change", { bubbles: true }));

        console.log("[selectProduct] Ürün satıra eklendi. Satır rowid:", row.attr("rowid"), productName);

        $("#dlgProductList").fadeOut();
    } catch (error) {
        console.error("[selectProduct] Hata:", error);
        alert(error.message);
    }
}

// ── HTML escape yardımcısı ────────────────────────────────────────────────────
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}