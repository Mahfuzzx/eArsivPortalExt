# e-Arşiv Portal Geliştirmeleri — Chrome Eklentisi

e-Arşiv Portal'a ([earsivportal.efatura.gov.tr](https://earsivportal.efatura.gov.tr)) ekstra kolaylıklar katan bir Chrome eklentisidir. Kullanıcı bilgileri, müşteri kayıtları, ürün kayıtları ve fatura notları gibi tekrar eden verileri tarayıcıda saklayarak fatura kesme sürecini hızlandırır.

[![Available in the Chrome Web Store](https://storage.googleapis.com/web-dev-uploads/image/WlD8wC6g8khYWPJUsQceQkhXSlv1/YT2Grfi9vEBa2wAPzhWa.png)](https://chromewebstore.google.com/detail/e-ar%C5%9Fiv-portal-geli%C5%9Ftirme/fekmelafdlaekeghjkghemfljbokndom?hl=tr)

---

## İçindekiler

- [Kurulum](#kurulum)
- [Özellikler](#özellikler)
  - [Kullanıcı Yönetimi](#1-kullanıcı-yönetimi)
  - [Müşteri Yönetimi](#2-müşteri-yönetimi)
  - [Ürün Yönetimi](#3-ürün-yönetimi)
  - [Fatura Notu](#4-fatura-notu)
  - [Yazı ile Tutar](#5-yazı-ile-tutar)
  - [Veri Yedekleme](#6-veri-yedekleme)
- [Dosya Yapısı](#dosya-yapısı)
- [Veri Saklama](#veri-saklama)
- [Sürüm Geçmişi](#sürüm-geçmişi)

---

## Kurulum

### Chrome Web Store (Önerilen)

[Chrome Web Store sayfasına](https://chromewebstore.google.com/detail/e-ar%C5%9Fiv-portal-geli%C5%9Ftirme/fekmelafdlaekeghjkghemfljbokndom?hl=tr) gidip **Chrome'a Ekle** butonuna tıklayın.

### Manuel Kurulum (Geliştirici Modu)

1. Bu repoyu indirin veya ZIP olarak çıkartın.
2. Chrome'da `chrome://extensions` adresine gidin.
3. Sağ üstten **Geliştirici modu**nu etkinleştirin.
4. **Paketlenmemiş öğe yükle** butonuna tıklayın.
5. İndirdiğiniz klasörü seçin.

> Eklenti yalnızca `https://earsivportal.efatura.gov.tr/*` adreslerinde çalışır.

![Kurulum ekran görüntüsü](images/kurulum.png)

---

## Özellikler

### 1. Kullanıcı Yönetimi

Giriş ekranında kullanıcı adı ve parola bilgilerini kaydedip tek tıkla doldurabilirsiniz.

**Nasıl kullanılır:**
1. Kullanıcı adı ve parola alanlarını doldurun.
2. **Kullanıcıyı Kaydet** butonuna tıklayın; bu kullanıcı için bir tanımlayıcı ad girin (örn. `Firma A`).
3. Sonraki girişlerde açılır listeden ilgili kullanıcıyı seçin; alanlar otomatik dolar.
4. Kaydedilmiş bir kullanıcıyı **Kullanıcıyı Düzenle** veya **Kullanıcıyı Sil** butonlarıyla güncelleyebilirsiniz.

![Kullanıcı yönetimi ekran görüntüsü](images/kullanici-yonetimi.png)

---

### 2. Müşteri Yönetimi

Fatura düzenleme ekranında alıcı bilgilerini kayıtlı müşterilerden tek tıkla doldurun.

**Nasıl kullanılır:**
1. VKN/TCKN alanının yanındaki **Müşteriler...** butonuna tıklayın.
2. Açılan pencerede sol listeden mevcut bir müşteriyi seçin ya da alanları doldurup **Kaydet** butonuyla yeni müşteri ekleyin.
3. Birden fazla adres girebilirsiniz; faturaya aktarılacak adresi checkboxla işaretleyin.
4. İstediğiniz müşteriyi seçip **Seç** butonuna bastığınızda alıcı bilgileri otomatik dolar.

| Buton | İşlev |
|---|---|
| Yeni | Alanları temizler, sıfırdan giriş yapmanızı sağlar |
| Kaydet | Alandaki bilgileri kaydeder / günceller |
| Sil | Seçili müşteriyi listeden kaldırır |
| Seç | Müşteriyi faturaya aktarır ve pencereyi kapatır |

> Müşteri listesi kullanıcı VKN'sine göre ayrı tutulur; farklı kullanıcıların müşteri listeleri birbirine karışmaz.

![Müşteri yönetimi ekran görüntüsü](images/musteri-yonetimi.png)

---

### 3. Ürün Yönetimi

Fatura ürün satırlarına kayıtlı ürünleri tek tıkla ekleyin.

**Nasıl kullanılır:**
1. Fatura düzenleme ekranında ürün tablosunun **Mal/Hizmet** sütunundaki **Ürünler...** butonuna tıklayın.
2. Açılan pencerede sol listeden mevcut bir ürünü seçin ya da bilgileri doldurup **Kaydet** butonuyla yeni ürün ekleyin.
3. **Seç** butonuna bastığınızda o satıra aşağıdaki alanlar otomatik dolar:

| Fatura Alanı | Kaydedilen Bilgi |
|---|---|
| Mal/Hizmet | Ürün Adı |
| Birim | Birim (Adet, kg, lt…) |
| Birim Fiyat | Birim Fiyat |
| İskonto Oranı | İskonto Oranı (%) |
| KDV Oranı | KDV Oranı |

> Her satırın kendi **Ürünler...** butonu vardır; aynı faturada farklı ürünleri farklı satırlara ekleyebilirsiniz.

> Ürün listesi kullanıcı VKN'sine göre ayrı tutulur.

![Ürün yönetimi ekran görüntüsü](images/urun-yonetimi.png)

---

### 4. Fatura Notu

Her kullanıcı için kalıcı bir fatura notu kaydedebilirsiniz. Kayıtlı not, fatura düzenleme ekranı açıldığında **Not** alanına otomatik eklenir.

**Nasıl kullanılır:**
1. Fatura düzenleme ekranındaki **Notu Düzenle** butonuna tıklayın.
2. Açılan pencerede başlık ve not metnini girin.
3. **Kaydet** butonuyla notu saklayın.

> Not metni her fatura açılışında mevcut nota eklenir; daha önce eklenmiş olan başlık varsa üzerine yazılmaz, tekrar eklenmez.

![Fatura notu ekran görüntüsü](images/fatura-notu.png)

---

### 5. Yazı ile Tutar

Faturanın ödenecek tutarı **Not** alanına Türkçe yazıyla otomatik eklenir.

Örnek: `Yalnız BinBeşYüzTL OtuzKr'dir.`

Bu alan tutar değiştikçe anlık olarak güncellenir; başka bir işlem yapmanıza gerek yoktur.

---

### 6. Veri Yedekleme

Tüm kayıtlı veriler (kullanıcılar, müşteriler, ürünler, notlar) tek bir JSON dosyasına aktarılabilir ve geri yüklenebilir.

**Nasıl kullanılır:**

| Buton | İşlev |
|---|---|
| Verileri Dışa Aktar | Tüm verileri `.json` dosyası olarak indirir |
| Verileri İçe Aktar | Daha önce alınan yedeği geri yükler (mevcut veriler üzerine yazar) |
| Tümünü Sil | Tüm kayıtlı verileri kalıcı olarak siler |

> İçe aktarma işleminde onay ekranında yedek tarihi ve içindeki kayıt sayıları gösterilir.

![Veri yedekleme ekran görüntüsü](images/veri-yedekleme.png)

---

## Dosya Yapısı

```
├── manifest.json             # Eklenti tanım dosyası
├── jquery.min.js             # jQuery bağımlılığı
├── content.js                # Ana giriş noktası, interval döngüsü
├── elements.js               # HTML şablonları (butonlar, dialoglar)
├── userfunctions.js          # Kullanıcı kaydetme/yükleme/silme
├── musterilerfunctions.js    # Müşteri CRUD ve faturaya aktarma
├── productfunctions.js       # Ürün CRUD ve satıra aktarma
├── usernotefunctions.js      # Kullanıcı notu kaydetme/yükleme
├── yaziile.js                # Tutarı Türkçe yazıya çevirme
├── exportimportfunctions.js  # JSON yedekleme ve geri yükleme
├── style.css                 # Eklenti dialog stilleri
└── icon.png                  # Eklenti simgesi
```

---

## Veri Saklama

Tüm veriler `chrome.storage.local` üzerinde tutulur; sunucuya herhangi bir veri gönderilmez.

| Anahtar | Tür | Açıklama |
|---|---|---|
| `userList` | `Array` | Kayıtlı kullanıcılar |
| `customerList` | `Object` | Kullanıcı VKN'sine göre indeksli müşteri listeleri |
| `productList` | `Object` | Kullanıcı VKN'sine göre indeksli ürün listeleri |
| `userNotes` | `Object` | Kullanıcı ID'sine göre indeksli fatura notları |

---

## Sürüm Geçmişi

| Sürüm | Değişiklikler |
|---|---|
| 1.4 | Ürün yönetimi eklendi; export/import'a `productList` desteği |
| 1.3 | Veri dışa/içe aktarma ve tümünü silme özellikleri eklendi |
| 1.2 | Müşteri yönetimi listesi kullanıcı VKN'sine göre ayrıştırıldı |
| 1.1 | Müşteri yönetimi ve fatura notu özellikleri eklendi |
| 1.0 | İlk sürüm: kullanıcı yönetimi ve yazı ile tutar |