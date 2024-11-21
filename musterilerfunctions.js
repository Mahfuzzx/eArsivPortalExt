function getUserVKN() {
    const userIDElement = $('div[rel="userID"] p');
    if (userIDElement.length) return userIDElement.text();
    else return '';
}

function updateCustomerUI() {
    const customerVKNElement = $('td[rel="vknTckn"] input');
    if (customerVKNElement.length) {
        let cmdCustomersBtn = $("#cmdCustomers");
        if (cmdCustomersBtn.length == 0) {
            customerVKNElement.after(customersButton);
            cmdCustomersBtn = $("#cmdCustomers");
            cmdCustomersBtn.css({
                "height": customerVKNElement.css("height"),
                "vertical-align": "top"
            });
            cmdCustomersBtn.off("click").on("click", loadCustomerListDialog);
        }
    }
}

function addAddressRow(address = '') {
    const emptyRow = $("#dlgCustomerList .editlist .empty");
    emptyRow.find(".chk")[0].checked = false;
    const cloneRow = emptyRow.clone();
    emptyRow.before(cloneRow);
    cloneRow.toggleClass("empty tofill");
    const txt = cloneRow.find(".txt");
    txt.off("blur").on("blur", function (e) {
        const txtElement = $(this);
        const parentRow = txtElement.parents(".row");
        if (txtElement.val().trim() == '') {
            txtElement.off("blur");
            parentRow.remove();
        }
    });
    txt.val(address);
    return txt;
}

function loadCustomerListDialog() {
    let customerListDialog = $("#dlgCustomerList");
    if (customerListDialog.length == 0) {
        $(document.body).prepend(dialogCustomerList);
        customerListDialog = $("#dlgCustomerList");
        $("#dlgCustomerList .editlist .empty .txt").off("focus").on("focus", function (e) {
            addAddressRow().trigger("focus");
        });
        $("#cmdSaveCustomer").off("click").on("click", saveCustomer);
        $("#cmdDeleteCustomer").off("click").on("click", deleteCustomer);
        $("#cmdNewCustomer").off("click").on("click", emptyFields);
        $("#cmdSelectCustomer").off("click").on("click", selectCustomer);
        $("#lstCustomers").off("change").on("change", function () {
            getCustomerList(customerList => {
                const selectedCustomer = customerList.find(customer => customer.customerVKN === this.value);
                if (selectedCustomer) {
                    $("#txtVKN").val(selectedCustomer.customerVKN);
                    $("#txtName").val(selectedCustomer.customerName);
                    $("#txtLastName").val(selectedCustomer.customerLastName);
                    $("#txtTitle").val(selectedCustomer.customerTitle);
                    $("#dlgCustomerList .row.tofill").remove();
                    selectedCustomer.customerAddresses.forEach(address => {
                        addAddressRow(address);
                    });
                }
            });
        });
    }
    emptyFields();
    loadCustomerList();
    customerListDialog.fadeIn();
}

function selectCustomer() {
    try {
        const customerVKN = $('#txtVKN').val().trim();
        const customerName = $('#txtName').val().trim();
        const customerLastName = $('#txtLastName').val().trim();
        const customerTitle = $('#txtTitle').val().trim();

        var customerAddresses = [];
        $("#dlgCustomerList .editlist .row.tofill .chk").each(function () {
            if (this.checked) {
                const rowVal = $(this).next().val().trim();
                if (rowVal != '') customerAddresses.push(rowVal);
            }
        });

        if (customerVKN.length < 10 || customerVKN.length > 11) throw new Error("Kimlik numarası en az 10, en çok 11 haneli olmalıdır.");
        if (!customerAddresses.length) throw new Error("En az bir adres seçilmelidir.");

        const customerVKNElement = $('td[rel="vknTckn"] input');
        if (customerVKNElement.length) {
            const inputs = [
                { element: $('td[rel="aliciUnvan"] input'), value: customerTitle, change: 0 },
                { element: $('td[rel="aliciAdi"] input'), value: customerName, change: 0 },
                { element: $('td[rel="aliciSoyadi"] input'), value: customerLastName, change: 0 }
            ];

            const enforceValue = ({ input, interval }) => {
                if (input.element.val() !== input.value) {
                    input.element.val(input.value);
                    input.change++;
                }
                if (input.change == 3) clearInterval(interval);
            };
            inputs.forEach(input => {
                input.element.val(input.value);
                const interval = setInterval(() => enforceValue({ input, interval }), 100);
            });

            customerVKNElement.val(customerVKN);
            customerVKNElement[0].dispatchEvent(new Event("change"));
            const customerAddressElement = $('td[rel="bulvarcaddesokak"] textarea');
            const customerCountryElement = $('td[rel="ulke"] select');
            customerCountryElement.val("Türkiye"); // <--------------------------- ülke seçimi?
            customerAddressElement.val(customerAddresses.join("\n"));
        }
        $('#dlgCustomerList').fadeOut();
    }
    catch (error) {
        alert(error.message);
    }
}

function deleteCustomer() {
    const selectedOption = $("#dlgCustomerList").find("option:selected");
    if (selectedOption.length) {
        const customerTitle = selectedOption.text();
        const customerVKN = selectedOption.val();
        if (!confirm(customerTitle + " isimli müşteriyi silmek istediğinizden emin misiniz?")) return;
        getCustomerList(customerList => {
            const updatedList = customerList.filter(customer => customer.customerVKN !== customerVKN);
            if (updatedList.length === customerList.length) {
                alert("Silinmek istenen müşteri bulunamadı.");
                return;
            }
            updateCustomerList(updatedList);
            emptyFields();
        });
    }
}

function saveCustomer() {
    try {
        const customerVKN = $('#txtVKN').val().trim();
        const customerName = $('#txtName').val().trim();
        const customerLastName = $('#txtLastName').val().trim();
        const customerTitle = $('#txtTitle').val().trim();
        const fullName = (customerName + " " + customerLastName + " " + customerTitle).trim();
        var customerAddresses = [];
        $("#dlgCustomerList .editlist .row.tofill .txt").each(function () {
            const rowVal = $(this).val().trim();
            if (rowVal != '') customerAddresses.push(rowVal);
        });

        if (customerVKN.length < 10 || customerVKN.length > 11) throw new Error("Kimlik numarası en az 10, en çok 11 haneli olmalıdır.");
        if (customerVKN.length == 11 && (!customerName || !customerLastName)) throw new Error("Ad ve soyad alanları dolu olmalıdır.");
        if (customerVKN.length == 10 && !customerTitle) throw new Error("Ünvan alanı dolu olmalıdır.");
        if (customerVKN.length == 10 && (customerName || customerLastName)) throw new Error("Şirketler için ad soyad alanları boş bırakılmalıdır.");
        if (!customerAddresses.length) throw new Error("En az bir adres girilmelidir.");

        const customerData = { customerVKN, customerName, customerLastName, customerTitle, fullName, customerAddresses };

        getCustomerList(customerList => {
            const existingCustomerIndex = customerList.findIndex(customer => customer.customerVKN === customerVKN);

            if (existingCustomerIndex !== -1) {
                customerList[existingCustomerIndex] = customerData;
            } else {
                customerList.push(customerData);
            }

            updateCustomerList(customerList);
            alert("Başarıyla kaydedildi.");
        });

    }
    catch (error) {
        alert(error.message);
    }
}

function emptyFields() {
    $("#lstCustomers").val("");
    $("#dlgCustomerList input").val("");
    $("#dlgCustomerList .row.tofill").remove();
    $("#dlgCustomerList .chk")[0].checked = false;
}

function loadCustomerList() {
    getCustomerList(customerList => {
        if (customerList.length === 0) {
            return;
        }

        const lstCustomers = $("#lstCustomers");
        lstCustomers.empty();
        let listHTML = "";
        customerList.forEach(customer => {
            listHTML += `<option value="${customer.customerVKN}">${customer.fullName}</option>`;
        });
        lstCustomers.append(listHTML);
    });
}

function updateCustomerList(newCustomerList) {
    const userVKN = getUserVKN();
    chrome.storage.local.get("customerList", function (data) {
        const customerList = data.customerList || {};
        customerList[userVKN] = newCustomerList;
        chrome.storage.local.set({ customerList }, function () {
            loadCustomerList();
        });
    });

}

function getCustomerList(callback) {
    const userVKN = getUserVKN();
    chrome.storage.local.get("customerList", function (data) {
        const customerList = data.customerList || {};
        const usersCustomerList = customerList[userVKN] || [];
        usersCustomerList.sort((a, b) => a.fullName.localeCompare(b.fullName));
        callback(usersCustomerList);
    });
}
