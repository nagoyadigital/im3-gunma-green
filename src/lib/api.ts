// GANTI URL INI dengan URL dari Google Apps Script deployment kamu
const API_URL = "https://script.google.com/macros/s/AKfycbwhhWKzAvm5CWKxbcKgdoVv_iaLPQanvELwsiPuw8ge3AelWdt2J8KL4E0VCBP8s4so/exec";

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
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function registerParticipant(data: {
  name: string;
  job: string;
  phone: string;
  email: string;
  location: string;
}) {
  return postData({ action: "register", ...data });
}

export async function getAllParticipants(): Promise<{ success: boolean; data: Participant[] }> {
  return postData({ action: "getAll" });
}

export async function updateHadir(id: string, hadir: boolean) {
  return postData({ action: "updateHadir", id, hadir });
}

export async function deleteParticipant(id: string) {
  return postData({ action: "delete", id });
}
