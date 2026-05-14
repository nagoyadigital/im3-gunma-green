// ============================================
// INSTRUKSI SETUP:
// 1. Buka Google Sheets baru: https://sheets.new
// 2. Beri nama: "IM3 Gunma Registrasi"
// 3. Di baris pertama (header), isi kolom A-H:
//    ID | Nama | Pekerjaan | Telepon | Email | Lokasi | Waktu | Hadir
// 4. Klik menu Extensions > Apps Script
// 5. Hapus semua kode, paste kode di bawah ini
// 6. Klik Deploy > New Deployment
// 7. Pilih Type: Web app
// 8. Execute as: Me
// 9. Who has access: Anyone
// 10. Klik Deploy, copy URL-nya
// 11. Paste URL ke file src/lib/api.ts di project
// ============================================

const SHEET_NAME = "Sheet1";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const data = JSON.parse(e.postData.contents);
    
    if (data.action === "register") {
      // Check duplicate
      const allData = sheet.getDataRange().getValues();
      for (let i = 1; i < allData.length; i++) {
        if (allData[i][4] === data.email) {
          return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Email sudah terdaftar" }))
            .setMimeType(ContentService.MimeType.JSON);
        }
        if (allData[i][3] === data.phone) {
          return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Nomor WhatsApp sudah terdaftar" }))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }
      
      // Add new row
      const id = "REG-" + String(allData.length).padStart(5, "0");
      const waktu = new Date().toLocaleString("id-ID");
      sheet.appendRow([id, data.name, data.job, data.phone, data.email, data.location, waktu, "Belum Hadir"]);
      
      // Kirim email konfirmasi ke pendaftar
      try {
        MailApp.sendEmail({
          to: data.email,
          subject: "✅ Konfirmasi Pendaftaran - Sholat Idul Adha 1447 H | IM3 Gunma",
          htmlBody: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: #004532; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">IM3 GUNMA</h1>
                <p style="color: #8bd6b7; margin: 8px 0 0 0; font-size: 12px;">IKATAN MAJELIS MUSLIM MUSLIMAH GUNMA</p>
              </div>
              <div style="background: white; padding: 30px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 12px 12px;">
                <h2 style="color: #004532; margin-top: 0;">Assalamu'alaikum, ${data.name} 👋</h2>
                <p style="color: #555; line-height: 1.6;">Alhamdulillah, pendaftaran Anda untuk <strong>Sholat Idul Adha 1447 H</strong> berhasil dicatat.</p>
                
                <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p style="margin: 0 0 8px 0; color: #333;"><strong>📋 Detail Pendaftaran:</strong></p>
                  <p style="margin: 4px 0; color: #555;">ID: ${id}</p>
                  <p style="margin: 4px 0; color: #555;">Nama: ${data.name}</p>
                  <p style="margin: 4px 0; color: #555;">Pekerjaan: ${data.job}</p>
                  <p style="margin: 4px 0; color: #555;">Lokasi: ${data.location}</p>
                </div>
                
                <div style="background: #fffbeb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p style="margin: 0 0 8px 0; color: #333;"><strong>📍 Info Pelaksanaan:</strong></p>
                  <p style="margin: 4px 0; color: #555;">Tanggal: Rabu, 27 Mei 2026</p>
                  <p style="margin: 4px 0; color: #555;">Waktu: 08:30 - Selesai</p>
                  <p style="margin: 4px 0; color: #555;">Lokasi: Ishihara Ryokuchi Park, Gunma</p>
                  <p style="margin: 4px 0; color: #555;">Imam & Khotib: Ustadz Supian</p>
                </div>
                
                <p style="color: #555; line-height: 1.6;">Mohon hadir tepat waktu. Semoga Allah menerima amal ibadah kita semua. 🤲</p>
                <p style="color: #555;">Jazakumullahu khairan,<br><strong>Panitia IM3 Gunma</strong></p>
              </div>
              <p style="text-align: center; color: #999; font-size: 11px; margin-top: 16px;">© 1447 H IM3 Gunma | Powered by Nagoya Digital</p>
            </div>
          `
        });
      } catch (emailError) {
        // Email gagal tapi registrasi tetap berhasil
        Logger.log("Email error: " + emailError.toString());
      }
      
      return ContentService.createTextOutput(JSON.stringify({ success: true, id: id }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (data.action === "getAll") {
      const allData = sheet.getDataRange().getValues();
      const rows = [];
      for (let i = 1; i < allData.length; i++) {
        rows.push({
          id: allData[i][0],
          name: allData[i][1],
          job: allData[i][2],
          phone: allData[i][3],
          email: allData[i][4],
          location: allData[i][5],
          time: allData[i][6],
          hadir: allData[i][7] === "Hadir"
        });
      }
      return ContentService.createTextOutput(JSON.stringify({ success: true, data: rows }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (data.action === "updateHadir") {
      const allData = sheet.getDataRange().getValues();
      for (let i = 1; i < allData.length; i++) {
        if (allData[i][0] === data.id) {
          sheet.getRange(i + 1, 8).setValue(data.hadir ? "Hadir" : "Belum Hadir");
          break;
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (data.action === "delete") {
      const allData = sheet.getDataRange().getValues();
      for (let i = 1; i < allData.length; i++) {
        if (allData[i][0] === data.id) {
          sheet.deleteRow(i + 1);
          break;
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Unknown action" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const data = JSON.parse(decodeURIComponent(e.parameter.data));
    
    if (data.action === "register") {
      const allData = sheet.getDataRange().getValues();
      for (let i = 1; i < allData.length; i++) {
        if (allData[i][4] === data.email) {
          return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Email sudah terdaftar" }))
            .setMimeType(ContentService.MimeType.JSON);
        }
        if (allData[i][3] === data.phone) {
          return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Nomor WhatsApp sudah terdaftar" }))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }
      
      const id = "REG-" + String(allData.length).padStart(5, "0");
      const waktu = new Date().toLocaleString("id-ID");
      sheet.appendRow([id, data.name, data.job, data.phone, data.email, data.location, waktu, "Belum Hadir"]);
      
      // Kirim email konfirmasi
      try {
        MailApp.sendEmail({
          to: data.email,
          subject: "✅ Konfirmasi Pendaftaran - Sholat Idul Adha 1447 H | IM3 Gunma",
          htmlBody: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: #004532; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">IM3 GUNMA</h1>
                <p style="color: #8bd6b7; margin: 8px 0 0 0; font-size: 12px;">IKATAN MAJELIS MUSLIM MUSLIMAH GUNMA</p>
              </div>
              <div style="background: white; padding: 30px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 12px 12px;">
                <h2 style="color: #004532; margin-top: 0;">Assalamu'alaikum, ${data.name} 👋</h2>
                <p style="color: #555; line-height: 1.6;">Alhamdulillah, pendaftaran Anda untuk <strong>Sholat Idul Adha 1447 H</strong> berhasil dicatat.</p>
                <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p style="margin: 0 0 8px 0; color: #333;"><strong>📋 Detail Pendaftaran:</strong></p>
                  <p style="margin: 4px 0; color: #555;">ID: ${id}</p>
                  <p style="margin: 4px 0; color: #555;">Nama: ${data.name}</p>
                  <p style="margin: 4px 0; color: #555;">Pekerjaan: ${data.job}</p>
                  <p style="margin: 4px 0; color: #555;">Lokasi: ${data.location}</p>
                </div>
                <div style="background: #fffbeb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p style="margin: 0 0 8px 0; color: #333;"><strong>📍 Info Pelaksanaan:</strong></p>
                  <p style="margin: 4px 0; color: #555;">Tanggal: Rabu, 27 Mei 2026</p>
                  <p style="margin: 4px 0; color: #555;">Waktu: 08:30 - Selesai</p>
                  <p style="margin: 4px 0; color: #555;">Lokasi: Ishihara Ryokuchi Park, Gunma</p>
                  <p style="margin: 4px 0; color: #555;">Imam & Khotib: Ustadz Supian</p>
                </div>
                <p style="color: #555; line-height: 1.6;">Mohon hadir tepat waktu. Semoga Allah menerima amal ibadah kita semua. 🤲</p>
                <p style="color: #555;">Jazakumullahu khairan,<br><strong>Panitia IM3 Gunma</strong></p>
              </div>
              <p style="text-align: center; color: #999; font-size: 11px; margin-top: 16px;">© 1447 H IM3 Gunma | Powered by Nagoya Digital</p>
            </div>
          `
        });
      } catch (emailError) {
        Logger.log("Email error: " + emailError.toString());
      }
      
      return ContentService.createTextOutput(JSON.stringify({ success: true, id: id }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (data.action === "getAll") {
      const allData = sheet.getDataRange().getValues();
      const rows = [];
      for (let i = 1; i < allData.length; i++) {
        rows.push({
          id: allData[i][0],
          name: allData[i][1],
          job: allData[i][2],
          phone: allData[i][3],
          email: allData[i][4],
          location: allData[i][5],
          time: allData[i][6],
          hadir: allData[i][7] === "Hadir"
        });
      }
      return ContentService.createTextOutput(JSON.stringify({ success: true, data: rows }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (data.action === "updateHadir") {
      const allData = sheet.getDataRange().getValues();
      for (let i = 1; i < allData.length; i++) {
        if (allData[i][0] === data.id) {
          sheet.getRange(i + 1, 8).setValue(data.hadir ? "Hadir" : "Belum Hadir");
          break;
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (data.action === "delete") {
      const allData = sheet.getDataRange().getValues();
      for (let i = 1; i < allData.length; i++) {
        if (allData[i][0] === data.id) {
          sheet.deleteRow(i + 1);
          break;
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Unknown action" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
