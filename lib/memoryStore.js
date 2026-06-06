const defaultNotices = [
  {
    _id: "seed-1",
    title: "5-Day Public Holiday Notice",
    content:
      "Janapath Secondary School will remain closed for 5 days due to public holiday. Regular classes will resume on the next working day.",
    category: "Holiday",
    isPinned: true,
    publishedAt: new Date().toISOString(),
  },
  {
    _id: "seed-2",
    title: "Computer Engineering Admissions Open",
    content:
      "Applications are now open for the Technical stream — Computer Engineering program for the 2026 academic session.",
    category: "Admission",
    isPinned: false,
    publishedAt: new Date().toISOString(),
  },
];

import { defaultGallery } from "@/lib/gallerySeed";

let memoryNotices = [...defaultNotices];
let memoryContacts = [];
let memoryGallery = [...defaultGallery];

function syncMemoryGallery() {
  for (const seed of defaultGallery) {
    if (!memoryGallery.some((g) => g.imageUrl === seed.imageUrl)) {
      memoryGallery.push({ ...seed });
    }
  }
}

export function getMemoryNotices() {
  return [...memoryNotices].sort(
    (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
  );
}

export function addMemoryNotice(notice) {
  const item = { ...notice, _id: `mem-${Date.now()}`, publishedAt: new Date().toISOString() };
  memoryNotices.unshift(item);
  return item;
}

export function updateMemoryNotice(id, updates) {
  const idx = memoryNotices.findIndex((n) => n._id === id);
  if (idx === -1) return null;
  memoryNotices[idx] = { ...memoryNotices[idx], ...updates };
  return memoryNotices[idx];
}

export function deleteMemoryNotice(id) {
  const before = memoryNotices.length;
  memoryNotices = memoryNotices.filter((n) => n._id !== id);
  return before !== memoryNotices.length;
}

export function addMemoryContact(contact) {
  const item = { ...contact, _id: `c-${Date.now()}`, createdAt: new Date().toISOString() };
  memoryContacts.unshift(item);
  return item;
}

export function getMemoryGallery() {
  syncMemoryGallery();
  return [...memoryGallery];
}

export function addMemoryGalleryItem(item) {
  const newItem = { ...item, _id: `g-${Date.now()}` };
  memoryGallery.unshift(newItem);
  return newItem;
}

export function updateMemoryGalleryItem(id, updates) {
  const idx = memoryGallery.findIndex((g) => g._id === id);
  if (idx === -1) return null;
  memoryGallery[idx] = { ...memoryGallery[idx], ...updates };
  return memoryGallery[idx];
}

export function deleteMemoryGalleryItem(id) {
  const before = memoryGallery.length;
  memoryGallery = memoryGallery.filter((g) => g._id !== id);
  return before !== memoryGallery.length;
}
