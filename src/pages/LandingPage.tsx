import { Calendar, Clock, MapPin, User, ArrowRight, Instagram, CheckCircle2, ShieldCheck, CloudDownload, ExternalLink, Star } from "lucide-react";
import React, { useState, useEffect } from "react";
import { cn } from "@/src/lib/utils";

export default function LandingPage() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [igFollowed, setIgFollowed] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState<{name: string; job: string; address: string; phone: string; email: string} | null>(null);

  // Countdown to Rabu, 27 Mei 2026 08:30 JST
  useEffect(() => {
    const targetDate = new Date("2026-05-27T08:30:00+09:00");
    
    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("nama") as HTMLInputElement).value,
      job: (form.elements.namedItem("pekerjaan") as HTMLInputElement).value,
      address: (form.elements.namedItem("alamat") as HTMLTextAreaElement).value,
      phone: (form.elements.namedItem("whatsapp") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
    };

    // Cek duplikat email atau nomor
    const existing = JSON.parse(localStorage.getItem("im3gunma_registrations") || "[]");
    const dupEmail = existing.find((p: any) => p.email === data.email);
    const dupPhone = existing.find((p: any) => p.phone === data.phone);

    if (dupEmail) {
      alert("Email ini sudah terdaftar. Silakan gunakan email lain.");
      return;
    }
    if (dupPhone) {
      alert("Nomor WhatsApp ini sudah terdaftar. Silakan gunakan nomor lain.");
      return;
    }

    setFormData(data);
    setShowConfirm(true);
  };

  const confirmRegistration = () => {
    if (!formData) return;
    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem("im3gunma_registrations") || "[]");
    const newEntry = {
      id: `REG-${String(existing.length + 1).padStart(5, "0")}`,
      ...formData,
      location: formData.address,
      time: new Date().toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      hadir: false,
    };
    existing.push(newEntry);
    localStorage.setItem("im3gunma_registrations", JSON.stringify(existing));
    setShowConfirm(false);
    setShowSuccess(true);
    setFormData(null);
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative bg-primary overflow-hidden pt-20 pb-32">
        {/* Siluet masjid di pojok kanan bawah */}
        <div className="absolute bottom-0 right-0 opacity-[0.08] pointer-events-none">
          <svg width="400" height="350" viewBox="0 0 400 350" fill="white" xmlns="http://www.w3.org/2000/svg">
            {/* Kubah utama */}
            <path d="M200 40 C200 40 240 80 240 120 L240 350 L160 350 L160 120 C160 80 200 40 200 40Z" />
            {/* Menara kiri */}
            <rect x="100" y="140" width="30" height="210" />
            <path d="M115 100 C115 100 130 120 130 140 L100 140 C100 120 115 100 115 100Z" />
            <rect x="108" y="85" width="14" height="20" />
            {/* Menara kanan */}
            <rect x="270" y="140" width="30" height="210" />
            <path d="M285 100 C285 100 300 120 300 140 L270 140 C270 120 285 100 285 100Z" />
            <rect x="278" y="85" width="14" height="20" />
            {/* Kubah kecil kiri */}
            <path d="M155 160 C155 160 170 140 185 160 L185 350 L155 350Z" />
            {/* Kubah kecil kanan */}
            <path d="M215 160 C215 160 230 140 245 160 L245 350 L215 350Z" />
            {/* Bulan sabit di atas kubah utama */}
            <circle cx="200" cy="30" r="8" />
            <circle cx="203" cy="28" r="6" fill="#004532" />
            {/* Badan masjid */}
            <rect x="130" y="200" width="140" height="150" />
            {/* Pintu */}
            <path d="M185 280 C185 260 215 260 215 280 L215 350 L185 350Z" fill="#004532" />
          </svg>
        </div>
        
        {/* Subtle radial glow */}
        <div className="absolute inset-0 pointer-events-none"
             style={{
               background: 'radial-gradient(ellipse at center top, rgba(212,175,55,0.06) 0%, transparent 50%)'
             }} />
        
        <div className="max-w-7xl mx-auto px-4 md:px-12 relative z-10 flex flex-col items-center text-center">
          <div className="mb-8 animate-fade-in">
            <img src="/images/hero-logo.png" alt="IM3 Gunma" className="h-28 md:h-36 w-auto mx-auto" />
          </div>

          <div className="mb-8 inline-flex items-center gap-2 bg-on-primary-fixed/20 text-on-primary-container px-5 py-1.5 rounded-full border border-white/10 backdrop-blur-sm animate-fade-in">
            <Star size={16} className="text-secondary-container" />
            <span className="font-sans text-xs font-semibold tracking-widest uppercase">EID AL-ADHA 1447 H</span>
          </div>
          
          <h1 className="font-serif text-5xl md:text-7xl text-on-primary-container max-w-4xl mb-2 tracking-tight font-bold animate-fade-in">
            Sholat Idul Adha 1447 H
          </h1>
          <p className="font-serif text-3xl md:text-4xl text-on-primary-container/70 mb-6">
            with IM3 Gunma
          </p>
          
          <p className="font-sans text-lg text-on-primary-container/70 mb-16 tracking-widest font-light uppercase">
            IKATAN MAJELIS MUSLIMIN MUSLIMAH GUNMA
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full max-w-3xl mb-16">
            {[
              { val: timeLeft.days, label: "Days" },
              { val: timeLeft.hours, label: "Hours" },
              { val: timeLeft.minutes, label: "Minutes" },
              { val: timeLeft.seconds, label: "Seconds" },
            ].map((t, i) => (
              <div 
                key={t.label}
                className="flex flex-col items-center group animate-fade-in"
              >
                <div className="font-serif text-5xl md:text-6xl text-on-primary-container mb-2 group-hover:scale-105 transition-transform duration-500">
                  {String(t.val).padStart(2, '0')}{i === 0 && <span className="text-2xl text-secondary-container">+</span>}
                </div>
                <div className="h-px w-8 bg-secondary-container/30 mb-2" />
                <div className="font-sans text-[10px] uppercase tracking-[0.2em] text-on-primary-container/50">{t.label}</div>
              </div>
            ))}
          </div>

          <a 
            href="#registration"
            className="group bg-secondary-container text-on-secondary-container px-12 py-4 rounded-full font-bold text-sm shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 animate-fade-in"
          >
            <span>DAFTAR SEKARANG</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
        
        {/* Curvy bottom separator */}
        <div className="absolute -bottom-16 left-1/2 -translateX-1/2 w-[140%] h-64 bg-background-sage rounded-[100%] border-t border-neutral-100/10 pointer-events-none" 
             style={{ transform: 'translateX(-50%)' }} />
      </section>

      {/* Info Boxes Bento Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-12 -mt-16 relative z-20 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Info Card */}
          <div className="md:col-span-2 bg-white p-8 rounded-2xl shadow-xl border-t-4 border-accent-gold">
            <div className="flex flex-col md:flex-row justify-between gap-8 h-full">
              <div className="space-y-8 flex-1">
                <h2 className="font-serif text-3xl text-primary flex items-center gap-3 font-bold">
                  <Calendar size={28} className="text-secondary" />
                  Detail Pelaksanaan
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400 uppercase tracking-widest mb-1">Tanggal</p>
                      <p className="text-lg font-bold text-neutral-800">Rabu, 27 Mei 2026</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400 uppercase tracking-widest mb-1">Waktu</p>
                      <p className="text-lg font-bold text-neutral-800">08:30 - Selesai</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400 uppercase tracking-widest mb-1">Imam & Khotib</p>
                      <p className="text-lg font-bold text-neutral-800">Ustadz Supian</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/3 aspect-video md:aspect-auto rounded-xl overflow-hidden shadow-lg">
                <img 
                  src="/images/ishihara-park.jpg" 
                  alt="Ishihara Ryokuchi Park" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Location Card */}
          <div className="bg-neutral-100 p-8 rounded-2xl border border-neutral-200 flex flex-col justify-between">
            <div>
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-secondary shadow-sm mb-6">
                <MapPin size={32} />
              </div>
              <h3 className="font-serif text-2xl text-primary mb-2 font-bold">Lokasi Utama</h3>
              <p className="text-neutral-600 mb-8 leading-relaxed">Ishihara Ryokuchi Park, Gunma Prefecture, Japan.</p>
            </div>
            <a 
              href="https://maps.google.com" 
              target="_blank" 
              className="w-full bg-white border-2 border-secondary text-secondary py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/50 transition-colors shadow-sm"
            >
              Lihat Lokasi Maps
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="flex items-center gap-4 mb-12">
          <div className="flex-1 h-px bg-accent-gold/30" />
          <Star size={24} className="text-accent-gold fill-accent-gold" />
          <div className="flex-1 h-px bg-accent-gold/30" />
        </div>
        <blockquote className="font-serif text-3xl md:text-4xl text-primary italic leading-relaxed font-semibold">
          "Semoga setiap langkah menuju sholat Idul Adha menjadi amal kebaikan dan keberkahan."
        </blockquote>
        <div className="flex items-center gap-4 mt-12">
          <div className="flex-1 h-px bg-accent-gold/30" />
          <Star size={24} className="text-accent-gold fill-accent-gold" />
          <div className="flex-1 h-px bg-accent-gold/30" />
        </div>
      </section>

      {/* Main Registration & Social Section */}
      <section id="registration" className="max-w-7xl mx-auto px-4 md:px-12 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Social Box */}
          <div className="lg:col-span-2 space-y-12">
            <div className="bg-primary p-10 rounded-2xl text-on-primary shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <Instagram size={120} />
               </div>
               <h3 className="font-serif text-3xl mb-6 font-bold text-white">Prasyarat Daftar</h3>
               <p className="text-white leading-relaxed mb-10">
                 Mohon ikuti akun Instagram resmi kami untuk mendapatkan info kegiatan IM3 dan update proyek Masjid Istiqomah Gunma.
               </p>
               
               <a 
                 href="https://instagram.com/im3_gunma" 
                 target="_blank"
                 className="flex items-center justify-center gap-3 w-full bg-white text-primary py-4 rounded-xl font-bold hover:bg-white/90 transition-colors shadow-lg mb-8"
               >
                 <Instagram size={20} />
                 Follow @im3_gunma
               </a>
               
               <div className="bg-primary-container/30 p-6 rounded-xl border border-white/10 flex items-center gap-4">
                 <input 
                   type="checkbox" 
                   id="ig-check"
                   checked={igFollowed}
                   onChange={(e) => setIgFollowed(e.target.checked)}
                   className="w-6 h-6 rounded border-white/20 bg-transparent text-accent-gold focus:ring-accent-gold cursor-pointer"
                 />
                 <label htmlFor="ig-check" className="text-white text-sm font-medium cursor-pointer flex-1">
                   ✅ Saya sudah follow Instagram IM3 Gunma
                 </label>
               </div>
            </div>
            
            <div className="hidden lg:block h-64 rounded-2xl overflow-hidden">
               <img 
                src="/images/masjid-istiqomah.webp" 
                alt="Masjid Istiqomah Gunma" 
                className="w-full h-full object-cover"
                loading="lazy"
               />
            </div>
          </div>

          {/* Form Box */}
          <div className="lg:col-span-3 bg-white p-10 md:p-14 rounded-2xl shadow-xl border border-neutral-100">
            <div className="mb-12">
              <h2 className="font-serif text-4xl text-primary mb-4 font-bold">Formulir Pendaftaran</h2>
              <p className="text-neutral-500">Isi data diri Anda dengan benar untuk pendataan jamaah.</p>
            </div>
            
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-400 tracking-widest uppercase px-1">Nama Lengkap</label>
                  <input 
                    required
                    name="nama"
                    type="text" 
                    placeholder="Masukkan nama"
                    className="w-full px-5 py-4 rounded-xl border border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-400 tracking-widest uppercase px-1">Pekerjaan</label>
                  <input 
                    required
                    name="pekerjaan"
                    type="text" 
                    placeholder="Masukkan pekerjaan"
                    className="w-full px-5 py-4 rounded-xl border border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-400 tracking-widest uppercase px-1">Alamat di Jepang</label>
                <textarea 
                  required
                  name="alamat"
                  placeholder="Contoh: Takasaki, Gunma" 
                  className="w-full px-5 py-4 rounded-xl border border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-400 tracking-widest uppercase px-1">WhatsApp</label>
                  <input 
                    required
                    name="whatsapp"
                    type="tel" 
                    placeholder="080-XXXX-XXXX"
                    className="w-full px-5 py-4 rounded-xl border border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-400 tracking-widest uppercase px-1">Email</label>
                  <input 
                    required
                    name="email"
                    type="email" 
                    placeholder="nama@email.com"
                    className="w-full px-5 py-4 rounded-xl border border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={!igFollowed}
                className={cn(
                  "w-full py-5 rounded-xl font-serif text-2xl shadow-xl transition-all flex items-center justify-center gap-3",
                  igFollowed 
                    ? "bg-primary text-white hover:bg-primary-container active:scale-95" 
                    : "bg-neutral-200 text-neutral-400 cursor-not-allowed shadow-none"
                )}
              >
                Daftar Sekarang
              </button>
              
              {!igFollowed && (
                <p className="text-center text-xs text-neutral-400 italic">
                  Pastikan Anda sudah mencentang konfirmasi Instagram di samping dan sudah follow kami ya. Jazakumullahu khairan — semoga Allah membalas kebaikan Anda 🤲
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white max-w-sm w-full rounded-3xl shadow-2xl p-8 text-center animate-fade-in">
            <div className="w-16 h-16 bg-secondary-container/20 text-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <Instagram size={36} />
            </div>
            <h2 className="font-serif text-2xl text-primary mb-3 font-bold">Konfirmasi</h2>
            <p className="text-neutral-600 mb-8">Apakah kamu beneran sudah follow Instagram <strong>@im3_gunma</strong>?</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3.5 rounded-xl border-2 border-neutral-200 text-neutral-500 font-bold hover:bg-neutral-50 transition-colors"
              >
                Belum
              </button>
              <button 
                onClick={confirmRegistration}
                className="flex-1 py-3.5 rounded-xl bg-primary text-white font-bold hover:bg-primary-container transition-colors shadow-lg"
              >
                Iya, Sudah
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl p-10 text-center border-t-8 border-primary animate-fade-in">
            <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 size={56} />
            </div>
            <h2 className="font-serif text-3xl text-primary mb-4 font-bold">Alhamdulillah</h2>
            <p className="text-neutral-600 mb-10 text-lg">Terima kasih sudah mendaftar! Semoga Allah menerima amal ibadah kita semua. Sampai jumpa di hari H 🤲</p>
            <button 
              onClick={() => { setShowSuccess(false); window.location.reload(); }}
              className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-container transition-colors shadow-lg"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
