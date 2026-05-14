// GANTI URL INI dengan URL dari Google Apps Script deployment kamu
const API_URL = "https://script.google.com/macros/s/AKfycbyTXFODhnF0OmZ720Z7sqxeJqINqEI2z2lmLFi857_0CMQ2zF3Vc0nMBZRDUUwi0fbI/exec";

export interface Participant {
  id: string;
  name: string;
  job: string;
  phone: string;
  email: string;
  location: string;
  time: string;
  hadir: boolean;
}

async function postData(body: object) {
  try {
    // Google Apps Script needs this specific format to avoid CORS/redirect issues
    const res = await fetch(API_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(body),
    });
    
    // no-cors returns opaque response, so we need a different approach
    // Use a workaround: send via URL params for GET request
    return { success: true };
  } catch {
    return { success: false, error: "Network error" };
  }
}

// Use GET-based approach which works better with Google Apps Script CORS
async function getData(body: object) {
  try {
    const params = encodeURIComponent(JSON.stringify(body));
    const res = await fetch(`${API_URL}?data=${params}`, {
      method: "GET",
      redirect: "follow",
    });
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return { success: false, error: "Invalid response" };
    }
  } catch {
    return { success: false, error: "Network error" };
  }
}

export async function registerParticipant(data: {
  name: string;
  job: string;
  phone: string;
  email: string;
  location: string;
}) {
  return getData({ action: "register", ...data });
}

export async function getAllParticipants(): Promise<{ success: boolean; data: Participant[] }> {
  return getData({ action: "getAll" });
}

export async function updateHadir(id: string, hadir: boolean) {
  return getData({ action: "updateHadir", id, hadir });
}

export async function deleteParticipant(id: string) {
  return getData({ action: "delete", id });
}
