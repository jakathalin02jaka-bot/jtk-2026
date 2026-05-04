# Joki Tugas Kilat — 2026 Edition

Website joki tugas statis dengan desain mobile-first 2026: glassmorphism, neon glow, dark mode default, dan integrasi WhatsApp langsung. Dibangun dengan Next.js 14 + TypeScript + Tailwind CSS.

## ✨ Fitur

- **5 Halaman**: Landing, Booking (3-step wizard), Track Status, My Bookings, Admin
- **Mobile-first**: Bottom nav, touch target 56px+, optimized untuk Android 4GB
- **Dark mode 2026**: Glassmorphism 3.0, neumorphism, neon glow (purple/cyan/pink)
- **Animasi 60fps**: CSS animations native (tanpa Framer Motion — lebih ringan)
- **Kalkulator interaktif**: Slider qty + speedometer urgensi dengan animasi count-up
- **WhatsApp integration**: Auto-format pesan booking ke admin (081295991378)
- **Admin panel**: Dashboard, manajemen booking, edit catalog, export CSV
- **Data localStorage**: Tanpa backend, deploy langsung ke Vercel

## 🚀 Cara Deploy

### Local Development

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

### Production Build

```bash
npm run build
npm run start
```

### Deploy ke Vercel

1. Push ke GitHub
2. Import project di [vercel.com](https://vercel.com)
3. Klik **Deploy** — selesai (zero-config)

## 🔑 Admin

- **URL**: `/admin`
- **Password**: `admin2026`
- Ubah password di `app/admin/page.tsx` (cari `ADMIN_PASSWORD`)

## 📱 WhatsApp Admin

Nomor admin diset di `lib/whatsapp.ts`:
```ts
const ADMIN_WA = '081295991378';
```
Ganti sesuai kebutuhan.

## 🏗️ Tech Stack

- Next.js 14.2 (App Router)
- TypeScript strict
- Tailwind CSS 3.4
- Lucide React (icons)
- Canvas 2D (confetti)
- localStorage (data)

## 📁 Struktur

```
app/             # Next.js App Router pages
  ├── page.tsx          # Landing
  ├── booking/          # Wizard 3 langkah
  ├── track/            # Tracker status
  ├── my-bookings/      # History per WA
  └── admin/            # Admin panel
components/
  ├── layout/           # Navbar, BottomNav, FAB, GlassCard
  ├── ui/               # Button, Input, Badge, Orb, Sheet
  ├── effects/          # Mesh, Tilt, Confetti, Reveal, CountUp
  └── sections/         # Hero, Services, Calculator, dll
lib/
  ├── types.ts          # TypeScript types
  ├── storage.ts        # localStorage CRUD
  ├── whatsapp.ts       # Message templates
  └── utils.ts          # Helpers (formatRupiah, haptic, dll)
```

## 🎨 Customization

- **Warna neon**: `tailwind.config.ts` (purple/cyan/pink + .glow variants)
- **Catalog default**: `lib/storage.ts` — `DEFAULT_CATALOG`
- **Multiplier urgensi**: `lib/utils.ts` — `URGENCY_MULTIPLIER`
- **Font**: `app/layout.tsx` (default Poppins via next/font)

## ⚡ Performa

- Tidak pakai Framer Motion — semua animasi pakai CSS native + Web Animations API
- Lazy IntersectionObserver untuk scroll reveals
- requestAnimationFrame throttle untuk tilt 3D
- `prefers-reduced-motion` di-respect

## 📝 Catatan

- Semua data disimpan di `localStorage` browser (per device)
- Untuk multi-device sync, perlu tambah backend (Supabase/Firebase)
- Admin password di-hardcode — untuk production, pertimbangkan auth proper

---

Built with ❤️ for Indonesian students.
