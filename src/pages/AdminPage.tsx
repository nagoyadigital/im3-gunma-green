import React, { useState, useEffect } from "react";
import { ShieldCheck, User, Users, Search, Download, Plus, ChevronRight, ChevronLeft, Phone, Mail, LogOut, CheckCircle2, Circle, UserCheck, Trash2 } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { getAllParticipants, updateHadir as apiUpdateHadir, deleteParticipant as apiDeleteParticipant, type Participant } from "@/src/lib/api";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
  }

  return <AdminDashboard onLogout={() => setIsLoggedIn(false)} />;
}

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    if (email === "admin" && password === "password123") {
      setError("");
      onLogin();
    } else {
      setError("Username atau password salah. Silakan coba lagi.");
    }
  };

  return (
    <section className="min-h-[80vh] flex items-center justify-center py-20 px-4 bg-neutral-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #004532 1px, transparent 0)', backgroundSize: '24px 24px' }} />
      
      <div 
        className="w-full max-w-md bg-white p-12 rounded-2xl shadow-2xl border border-neutral-100 flex flex-col items-center animate-fade-in"
      >
        <div className="mb-8">
          <img src="/images/logo-header.png" alt="IM3 Gunma" className="h-16 w-auto mx-auto" />
        </div>
        
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl text-primary mb-3 font-bold">Admin Portal</h1>
          <p className="text-neutral-500">Masukkan username dan password untuk masuk ke dashboard admin.</p>
        </div>

        {error && (
          <div className="w-full mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        <form className="w-full space-y-6" onSubmit={handleLogin}>
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-400 tracking-widest uppercase px-1">Username</label>
            <input 
              required
              name="email"
              type="text" 
              placeholder="admin"
              className="w-full px-5 py-4 rounded-xl border border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-400 tracking-widest uppercase px-1">Password</label>
            <input 
              required
              name="password"
              type="password" 
              placeholder="••••••••"
              className="w-full px-5 py-4 rounded-xl border border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary-container active:scale-[0.98] transition-all shadow-xl"
          >
            Authorize Login
          </button>
        </form>
      </div>
    </section>
  );
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState<Participant[]>([]);

  // Load from Google Sheets
  const loadData = async () => {
    try {
      const result = await getAllParticipants();
      if (result.success) {
        setParticipants(result.data);
      }
    } catch (e) {
      console.error("Failed to load data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleHadir = async (id: string) => {
    const person = participants.find(p => p.id === id);
    if (!person) return;
    const newHadir = !person.hadir;
    setParticipants(prev => prev.map(p => p.id === id ? { ...p, hadir: newHadir } : p));
    await apiUpdateHadir(id, newHadir);
  };

  const deleteParticipant = async (id: string) => {
    if (window.confirm("Yakin ingin menghapus data ini?")) {
      setParticipants(prev => prev.filter(p => p.id !== id));
      await apiDeleteParticipant(id);
    }
  };

  const totalHadir = participants.filter(p => p.hadir).length;

  const exportData = () => {
    if (participants.length === 0) {
      alert("Belum ada data untuk di-export.");
      return;
    }
    const headers = ["ID", "Nama", "Pekerjaan", "Telepon", "Email", "Lokasi", "Waktu Daftar", "Kehadiran"];
    const rows = participants.map(p => [
      p.id, p.name, p.job, p.phone, p.email, p.location, p.time, p.hadir ? "Hadir" : "Belum Hadir"
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");
    
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `absensi-jamaah-im3gunma-${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportPdf = () => {
    if (participants.length === 0) {
      alert("Belum ada data untuk di-export.");
      return;
    }
    
    const rows = participants.map(p => `
      <tr>
        <td style="border:1px solid #ddd;padding:8px;">${p.id}</td>
        <td style="border:1px solid #ddd;padding:8px;">${p.name}</td>
        <td style="border:1px solid #ddd;padding:8px;">${p.job}</td>
        <td style="border:1px solid #ddd;padding:8px;">${p.phone}</td>
        <td style="border:1px solid #ddd;padding:8px;">${p.location}</td>
        <td style="border:1px solid #ddd;padding:8px;text-align:center;font-weight:bold;color:${p.hadir ? '#004532' : '#999'}">${p.hadir ? '✓ Hadir' : '—'}</td>
      </tr>
    `).join("");

    const htmlContent = `<html>
      <head>
        <title>Absensi Jamaah - IM3 Gunma</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
          h1 { color: #004532; margin-bottom: 4px; }
          p { color: #666; margin-bottom: 24px; }
          table { width: 100%; border-collapse: collapse; font-size: 13px; }
          th { background: #004532; color: white; padding: 10px 8px; text-align: left; }
          tr:nth-child(even) { background: #f9f9f9; }
          .footer { margin-top: 32px; font-size: 11px; color: #999; }
        </style>
      </head>
      <body>
        <h1>Absensi Jamaah Sholat Idul Adha 1447 H</h1>
        <p>IM3 Gunma — Dicetak: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama</th>
              <th>Pekerjaan</th>
              <th>Telepon</th>
              <th>Lokasi</th>
              <th>Kehadiran</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <div class="footer">
          Total Terdaftar: ${participants.length} | Hadir: ${totalHadir} | Belum Hadir: ${participants.length - totalHadir}
        </div>
        <script>window.onload = function() { window.print(); }<\/script>
      </body>
      </html>`;

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const filteredParticipants = participants.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone.includes(searchTerm)
  );

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-12 py-6 md:py-12">
      {/* Header + Logout */}
      <div className="flex justify-between items-center mb-6">
        <nav className="hidden md:flex items-center gap-2 text-xs font-bold text-neutral-400 tracking-widest uppercase">
          <span>Admin</span>
          <ChevronRight size={14} />
          <span className="text-primary">Dashboard</span>
        </nav>
        <h3 className="md:hidden font-serif text-lg text-primary font-bold">Admin Panel</h3>
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-red-500 font-bold text-xs md:text-sm hover:bg-red-50 active:scale-95 transition-all"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>

      {/* Title */}
      <div className="mb-6 md:mb-12 flex justify-between items-end">
        <div>
          <h2 className="font-serif text-2xl md:text-4xl text-primary font-bold">Absensi & Data Jamaah</h2>
          <p className="text-neutral-500 mt-2 text-sm md:text-base">Kelola kehadiran jamaah Sholat Idul Adha 1447 H.</p>
        </div>
        <button onClick={loadData} className="text-xs font-bold text-primary bg-primary/5 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors">
          ↻ Refresh
        </button>
      </div>

      {/* Stat Cards - horizontal scroll on mobile */}
      <div className="flex gap-3 md:gap-4 mb-6 md:mb-12 overflow-x-auto pb-2">
        <div className="bg-white border-l-4 border-secondary px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl shadow-sm flex items-center gap-3 md:gap-4 border-y border-r border-neutral-100 shrink-0">
          <div className="bg-primary-container p-2.5 md:p-3 rounded-lg md:rounded-xl text-on-primary-container shadow-sm">
            <Users size={20} />
          </div>
          <div>
            <p className="text-[9px] md:text-[10px] font-bold text-neutral-400 tracking-widest uppercase">Terdaftar</p>
            <p className="text-xl md:text-2xl font-serif font-bold text-primary">{participants.length}</p>
          </div>
        </div>
        <div className="bg-white border-l-4 border-primary px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl shadow-sm flex items-center gap-3 md:gap-4 border-y border-r border-neutral-100 shrink-0">
          <div className="bg-primary/10 p-2.5 md:p-3 rounded-lg md:rounded-xl text-primary shadow-sm">
            <UserCheck size={20} />
          </div>
          <div>
            <p className="text-[9px] md:text-[10px] font-bold text-neutral-400 tracking-widest uppercase">Hadir</p>
            <p className="text-xl md:text-2xl font-serif font-bold text-primary">{totalHadir} <span className="text-xs md:text-sm text-neutral-400 font-sans">/ {participants.length}</span></p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4 md:mb-0">
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 justify-between items-center mb-4 md:mb-0">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama atau telepon..."
              className="w-full pl-11 pr-4 py-3 md:py-3.5 bg-white border border-neutral-100 rounded-xl md:rounded-2xl text-sm focus:border-primary focus:ring-0 outline-none transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button onClick={exportData} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-3 md:py-3.5 rounded-xl border-2 border-secondary text-secondary font-bold text-xs md:text-sm hover:bg-neutral-50 active:scale-95 transition-all">
              <Download size={16} />
              Excel
            </button>
            <button onClick={exportPdf} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-3 md:py-3.5 rounded-xl border-2 border-primary text-primary font-bold text-xs md:text-sm hover:bg-neutral-50 active:scale-95 transition-all">
              <Download size={16} />
              PDF
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-3xl shadow-xl border border-neutral-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/50">
                <th className="px-6 py-5 text-xs font-bold text-primary uppercase tracking-widest text-center">Kehadiran</th>
                <th className="px-6 py-5 text-xs font-bold text-primary uppercase tracking-widest">Nama Lengkap</th>
                <th className="px-6 py-5 text-xs font-bold text-primary uppercase tracking-widest">Pekerjaan</th>
                <th className="px-6 py-5 text-xs font-bold text-primary uppercase tracking-widest">Kontak</th>
                <th className="px-6 py-5 text-xs font-bold text-primary uppercase tracking-widest">Lokasi</th>
                <th className="px-6 py-5 text-xs font-bold text-primary uppercase tracking-widest">Waktu Daftar</th>
                <th className="px-6 py-5 text-xs font-bold text-primary uppercase tracking-widest text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {filteredParticipants.map((person) => (
                <tr key={person.id} className={cn("hover:bg-neutral-50/30 transition-colors group", person.hadir && "bg-primary/[0.03]")}>
                  <td className="px-6 py-6 text-center">
                    <button 
                      onClick={() => toggleHadir(person.id)}
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90",
                        person.hadir 
                          ? "bg-primary text-white shadow-lg" 
                          : "bg-neutral-100 text-neutral-300 hover:bg-neutral-200"
                      )}
                    >
                      {person.hadir ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                    </button>
                  </td>
                  <td className="px-6 py-6">
                    <div className={cn("font-bold transition-colors", person.hadir ? "text-primary" : "text-neutral-800 group-hover:text-primary")}>{person.name}</div>
                    <div className="text-[10px] font-bold text-neutral-400 tracking-wider">ID: {person.id}</div>
                  </td>
                  <td className="px-6 py-6 text-sm text-neutral-600">{person.job}</td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-sm text-neutral-800 flex items-center gap-2 font-medium">
                        <Phone size={14} className="text-primary" /> {person.phone}
                      </span>
                      <span className="text-xs text-neutral-400 flex items-center gap-2">
                        <Mail size={14} /> {person.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-sm text-neutral-600">{person.location}</td>
                  <td className="px-6 py-6 text-xs font-bold text-neutral-400 uppercase tracking-tighter">{person.time}</td>
                  <td className="px-6 py-6 text-center">
                    <button 
                      onClick={() => deleteParticipant(person.id)}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-600 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        {/* Desktop Footer */}
        <div className="hidden md:flex p-8 bg-neutral-50/50 border-t border-neutral-50 flex-row justify-between items-center gap-6">
          <p className="text-xs font-bold text-neutral-400 tracking-wider uppercase">
            {totalHadir} dari {participants.length} jamaah sudah hadir
          </p>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-xl flex items-center justify-center border border-neutral-200 bg-white hover:bg-neutral-50 transition-all shadow-sm">
              <ChevronLeft size={18} />
            </button>
            <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary text-white font-bold shadow-lg">1</button>
            <button className="w-10 h-10 rounded-xl flex items-center justify-center border border-neutral-200 bg-white hover:bg-neutral-50 transition-all shadow-sm">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden space-y-3">
        {loading && (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xs text-neutral-400">Memuat data...</p>
          </div>
        )}
        {!loading && filteredParticipants.length === 0 && (
          <div className="text-center py-12 text-neutral-400">
            <Users size={40} className="mx-auto mb-4 opacity-30" />
            <p className="font-bold">Belum ada data registrasi</p>
            <p className="text-xs mt-1">Data akan muncul setelah jamaah mendaftar.</p>
          </div>
        )}
        {!loading && filteredParticipants.map((person) => (
          <div 
            key={person.id} 
            className={cn(
              "bg-white rounded-xl border shadow-sm p-4 flex items-center gap-4 active:scale-[0.98] transition-all",
              person.hadir ? "border-primary/30 bg-primary/[0.02]" : "border-neutral-100"
            )}
          >
            {/* Tombol Hadir */}
            <button 
              onClick={() => toggleHadir(person.id)}
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-90 shrink-0",
                person.hadir 
                  ? "bg-primary text-white shadow-lg" 
                  : "bg-neutral-100 text-neutral-300"
              )}
            >
              {person.hadir ? <CheckCircle2 size={24} /> : <Circle size={24} />}
            </button>
            
            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className={cn("font-bold text-sm truncate", person.hadir ? "text-primary" : "text-neutral-800")}>
                {person.name}
              </div>
              <div className="text-xs text-neutral-500 truncate">{person.job} • {person.location}</div>
              <div className="flex items-center gap-2 mt-1">
                <Phone size={11} className="text-primary shrink-0" />
                <span className="text-xs text-neutral-600 truncate">{person.phone}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <Mail size={11} className="text-neutral-400 shrink-0" />
                <span className="text-xs text-neutral-500 truncate">{person.email}</span>
              </div>
            </div>

            {/* Status badge */}
            <div className="flex flex-col items-end gap-2">
              <div className={cn(
                "text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shrink-0",
                person.hadir ? "bg-primary/10 text-primary" : "bg-neutral-100 text-neutral-400"
              )}>
                {person.hadir ? "Hadir" : "—"}
              </div>
              <button 
                onClick={() => deleteParticipant(person.id)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-600 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        {/* Mobile Footer */}
        <div className="text-center py-4">
          <p className="text-xs font-bold text-neutral-400">
            {totalHadir} dari {participants.length} jamaah sudah hadir ✓
          </p>
        </div>
      </div>
    </section>
  );
}
