## To-Do

- `function getDeals()` aktif değil.
  Ürün içerisindeki `deal` objelerini arayıp, tabloda tüm ürünleri döndürdükten `SONRA` bu objeleri döndürmeli.
  currency ve margin katsayıları var.

---

## Uyarılar

- Ürünlerin kendi içerisindeki currency ile `config.json` içerisindeki "genel" currency çarpanı karışmasın. tüm ürünleri USD çevirip USD olarak toplayıp en son ayrıca config currency'ye bölerek istediğimiz para birimine çeviriyoruz. Fakat pariteleri ortak kullanıyorlar, bunda sorun yok.
#   m o x - p r i c e  
 