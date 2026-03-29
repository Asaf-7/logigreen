# 🚛 LogiGreen - Yeşil Lojistik ve Rota Optimizasyon Sistemi

**LogiGreen**, tedarik zinciri ve lojistik operasyonlarında **Saf Lojistik Maliyeti** ile **Karbon Emisyonu Bedeli (Karbon Vergisi)** arasındaki dengeyi kuran dinamik bir Karar Destek Sistemidir (Decision Support System).

Avrupa Birliği Sınırda Karbon Düzenleme Mekanizması (CBAM) ve Kapsam 3 emisyon hedefleri doğrultusunda şirketlerin stratejik kararlar almasına yardımcı olmak için geliştirilmiştir.

🚀 **Canlı Uygulama:** [https://logigreen.vercel.app/]

## ✨ Temel Özellikler

- **Çok Kriterli Optimizasyon:** Kullanıcının belirlediği "Karbon Vergisi" senaryosuna göre anlık olarak en uygun taşıma modunu (Ağır Tır, Elektrikli Tren, Gemi) seçer.
- **Dinamik Rota Görselleştirme:** "Soyut Düğüm Haritası" (Abstract Node Map) tasarımı ile algoritmanın seçtiği optimum aracı harita üzerinde animasyonlu olarak gösterir.
- **Senaryo Analizi:** Karbon vergisi arttıkça veya yük tonajı değiştikçe kırılma noktalarını (trade-off) hesaplar ve anında bar grafiklere (Recharts) yansıtır.
- **Kurumsal Dashboard:** "Glassmorphism" UI prensipleriyle tasarlanmış, yönetici özetine (Executive Summary) uygun temiz arayüz.

## 🧪 Matematiksel Model ve Algoritma

Sistem, karar mekanizması olarak aşağıdaki **Amaç Fonksiyonunu (Objective Function)** kullanarak toplam maliyeti minimize eder:

$Z = \text{Toplam Lojistik Maliyeti} + (\text{Toplam } CO_2 \text{ Emisyonu} \times \text{Karbon Vergisi})$

**Araç Parametreleri (Ödünleşim / Trade-off Modeli):**
- **Ağır Tır:** Düşük taşıma maliyeti (10 TL/km) | Yüksek emisyon (150 g CO2/ton.km)
- **Elektrikli Tren:** Ortalama taşıma maliyeti (25 TL/km) | Düşük emisyon (40 g CO2/ton.km)
- **Gemi:** Yüksek taşıma maliyeti (45 TL/km - Liman masrafları dahil) | Minimum emisyon (20 g CO2/ton.km)

*Not: Vergi 0 TL iken sistem en ucuz olan Tır'ı seçerken, vergi yükü arttıkça optimum rota Tren veya Gemiye kaymaktadır.*

## 🛠️ Teknoloji Yığını

- **Frontend:** React.js, TypeScript, Vite
- **Stil & Tasarım:** Tailwind CSS
- **Veri Görselleştirme:** Recharts
- **İkonografi:** Lucide React
- **Dağıtım (Deployment):** Vercel

## 🚀 Kurulum (Lokal Ortam)

Projeyi bilgisayarınızda çalıştırmak için:

1. Depoyu klonlayın: `git clone https://github.com/Asaf-7/logigreen.git`
2. Klasöre gidin: `cd logigreen`
3. Bağımlılıkları yükleyin: `npm install`
4. Geliştirici sunucusunu başlatın: `npm run dev`

---
*Bu proje, disiplinlerarası (Kimya ve Matematik Mühendisliği) bir optimizasyon yaklaşımıyla Yıldız Teknik Üniversitesi öğrencisi Asaf Rüştü tarafından geliştirilmiştir.*