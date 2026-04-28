"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import JSZip from "jszip";
import { mockAlbums, mockPhotos, mockShares } from "@/lib/mock-data";
import { makeToken } from "@/lib/utils";
import type { Album, GridMode, LumaUser, Photo, Share } from "@/types/lumadrop";

const demoUser: LumaUser = { id: "u-demo", name: "Luma Creator", email: "hello@lumadrop.dev", provider: "email" };

function normalizePhoto(photo: Photo): Photo {
  const seed = mockPhotos.find((item) => item.id === photo.id);
  return {
    ...photo,
    userId: photo.userId ?? seed?.userId ?? demoUser.id,
    takenAt: photo.takenAt ?? seed?.takenAt ?? photo.uploadedAt,
    category: photo.category ?? seed?.category ?? "other",
    tags: photo.tags ?? seed?.tags ?? []
  };
}

function normalizeAlbum(album: Album): Album {
  const seed = mockAlbums.find((item) => item.id === album.id);
  return {
    ...album,
    userId: album.userId ?? seed?.userId ?? demoUser.id
  };
}

function normalizeShare(share: Share): Share {
  const seed = mockShares.find((item) => item.id === share.id);
  return {
    ...share,
    userId: share.userId ?? seed?.userId ?? demoUser.id
  };
}

function removeLocalOnlyUploads(photos: Photo[]) {
  return photos.filter((photo) => !photo.url.startsWith("/uploads/"));
}

type LumaState = {
  photos: Photo[];
  albums: Album[];
  shares: Share[];
  selectedIds: string[];
  selectionMode: boolean;
  gridMode: GridMode;
  user: LumaUser | null;
  login: (email: string) => void;
  loginWithPhone: (phone: string) => void;
  loginWithWechat: () => void;
  loginWithUser: (user: LumaUser) => void;
  logout: () => void;
  addPhotos: (photos: Photo[]) => void;
  toggleFavorite: (photoId: string) => void;
  toggleSelection: (photoId: string) => void;
  clearSelection: () => void;
  setSelectionMode: (value: boolean) => void;
  setGridMode: (mode: GridMode) => void;
  createAlbum: (input: Pick<Album, "title" | "description" | "theme" | "isPrivate">, photoIds?: string[]) => Album;
  updateAlbum: (albumId: string, input: Partial<Album>) => void;
  addToAlbum: (albumId: string, photoIds: string[]) => void;
  softDelete: (photoIds: string[]) => void;
  restorePhotos: (photoIds: string[]) => void;
  hardDelete: (photoIds: string[]) => void;
  purgeExpiredTrash: () => void;
  emptyTrash: () => void;
  resetDemoData: () => void;
  createShare: (input: Omit<Share, "id" | "token" | "createdAt">) => Share;
  downloadPhotos: (photoIds: string[], fileName?: string) => Promise<void>;
};

export const useLumaStore = create<LumaState>()(
  persist(
    (set, get) => ({
      photos: mockPhotos.map(normalizePhoto),
      albums: mockAlbums.map(normalizeAlbum),
      shares: mockShares.map(normalizeShare),
      selectedIds: [],
      selectionMode: false,
      gridMode: "grid",
      user: demoUser,
      login: (email) =>
        set({ user: { id: "u-demo", name: email.split("@")[0] || "Luma Creator", email, provider: "email" } }),
      loginWithPhone: (phone) =>
        set({ user: { id: "u-demo", name: `手机用户 ${phone.slice(-4)}`, phone, provider: "phone" } }),
      loginWithWechat: () =>
        set({ user: { id: "u-demo", name: "微信创作者", provider: "wechat" } }),
      loginWithUser: (user) =>
        set((state) => ({
          user,
          photos: state.photos.map((photo) =>
            state.user?.id === "u-authenticated" && photo.userId === "u-authenticated"
              ? { ...photo, userId: user.id }
              : photo
          ),
          albums: state.albums.map((album) =>
            state.user?.id === "u-authenticated" && album.userId === "u-authenticated"
              ? { ...album, userId: user.id }
              : album
          ),
          shares: state.shares.map((share) =>
            state.user?.id === "u-authenticated" && share.userId === "u-authenticated"
              ? { ...share, userId: user.id }
              : share
          )
        })),
      logout: () => set({ user: null }),
      addPhotos: (photos) =>
        set((state) => {
          const ownerId = state.user?.id ?? demoUser.id;
          return { photos: [...photos.map((photo) => ({ ...photo, userId: ownerId })), ...state.photos] };
        }),
      toggleFavorite: (photoId) =>
        set((state) => ({
          photos: state.photos.map((photo) =>
            photo.id === photoId ? { ...photo, favorite: !photo.favorite } : photo
          )
        })),
      toggleSelection: (photoId) =>
        set((state) => {
          const selected = state.selectedIds.includes(photoId)
            ? state.selectedIds.filter((id) => id !== photoId)
            : [...state.selectedIds, photoId];
          return { selectedIds: selected, selectionMode: selected.length > 0 };
        }),
      clearSelection: () => set({ selectedIds: [], selectionMode: false }),
      setSelectionMode: (value) => set({ selectionMode: value, selectedIds: value ? get().selectedIds : [] }),
      setGridMode: (gridMode) => set({ gridMode }),
      createAlbum: (input, photoIds = []) => {
        const album: Album = {
          id: `a-${Date.now()}`,
          userId: get().user?.id ?? demoUser.id,
          coverPhotoId: photoIds[0],
          createdAt: new Date().toISOString(),
          ...input
        };
        set((state) => ({
          albums: [album, ...state.albums],
          photos: state.photos.map((photo) =>
            photoIds.includes(photo.id) ? { ...photo, albumId: album.id } : photo
          )
        }));
        return album;
      },
      updateAlbum: (albumId, input) =>
        set((state) => ({ albums: state.albums.map((album) => (album.id === albumId ? { ...album, ...input } : album)) })),
      addToAlbum: (albumId, photoIds) =>
        set((state) => ({
          photos: state.photos.map((photo) =>
            photoIds.includes(photo.id) ? { ...photo, albumId } : photo
          )
        })),
      softDelete: (photoIds) =>
        set((state) => ({
          photos: state.photos.map((photo) =>
            photoIds.includes(photo.id) ? { ...photo, deletedAt: new Date().toISOString() } : photo
          ),
          selectedIds: [],
          selectionMode: false
        })),
      restorePhotos: (photoIds) =>
        set((state) => ({
          photos: state.photos.map((photo) =>
            photoIds.includes(photo.id) ? { ...photo, deletedAt: null } : photo
          ),
          selectedIds: [],
          selectionMode: false
        })),
      hardDelete: (photoIds) =>
        set((state) => ({
          photos: state.photos.filter((photo) => !photoIds.includes(photo.id)),
          selectedIds: [],
          selectionMode: false
        })),
      purgeExpiredTrash: () =>
        set((state) => {
          const now = Date.now();
          const sevenDays = 7 * 24 * 60 * 60 * 1000;
          const nextPhotos = removeLocalOnlyUploads(state.photos)
            .map(normalizePhoto)
            .filter((photo) => {
              if (!photo.deletedAt) return true;
              return now - new Date(photo.deletedAt).getTime() < sevenDays;
            });
          if (
            nextPhotos.length === state.photos.length &&
            nextPhotos.every((photo, index) => photo === state.photos[index])
          ) {
            return state;
          }
          return { photos: nextPhotos };
        }),
      emptyTrash: () =>
        set((state) => ({
          photos: state.photos.filter((photo) => {
            const belongsToCurrentUser = !state.user || photo.userId === state.user.id;
            return !belongsToCurrentUser || !photo.deletedAt;
          }),
          selectedIds: [],
          selectionMode: false
        })),
      resetDemoData: () =>
        set({
          photos: mockPhotos.map(normalizePhoto),
          albums: mockAlbums.map(normalizeAlbum),
          shares: mockShares.map(normalizeShare),
          selectedIds: [],
          selectionMode: false,
          gridMode: "grid",
          user: demoUser
        }),
      createShare: (input) => {
        const share: Share = {
          id: `s-${Date.now()}`,
          userId: get().user?.id ?? demoUser.id,
          token: makeToken(),
          createdAt: new Date().toISOString(),
          ...input
        };
        set((state) => ({ shares: [share, ...state.shares] }));
        return share;
      },
      downloadPhotos: async (photoIds, fileName = "lumadrop-photos") => {
        const photos = get().photos.filter((photo) => photoIds.includes(photo.id));
        if (photos.length === 1) {
          const photo = photos[0];
          const link = document.createElement("a");
          link.href = photo.url;
          link.download = `${photo.title}.jpg`;
          link.target = "_blank";
          link.click();
          return;
        }
        const zip = new JSZip();
        await Promise.all(
          photos.map(async (photo, index) => {
            const response = await fetch(photo.url);
            const blob = await response.blob();
            zip.file(`${String(index + 1).padStart(2, "0")}-${photo.title}.jpg`, blob);
          })
        );
        const blob = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${fileName}.zip`;
        link.click();
        URL.revokeObjectURL(url);
      }
    }),
    {
      name: "lumadrop-store",
      version: 3,
      migrate: (persistedState) => {
        const state = persistedState as Partial<LumaState>;
        return {
          photos: removeLocalOnlyUploads((state.photos ?? mockPhotos).map(normalizePhoto)),
          albums: (state.albums ?? mockAlbums).map(normalizeAlbum),
          shares: (state.shares ?? mockShares).map(normalizeShare),
          user: state.user ?? demoUser,
          gridMode: state.gridMode ?? "grid"
        };
      },
      partialize: (state) => ({
        photos: state.photos,
        albums: state.albums,
        shares: state.shares,
        user: state.user,
        gridMode: state.gridMode
      })
    }
  )
);
