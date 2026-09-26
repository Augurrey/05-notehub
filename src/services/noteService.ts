import axios from "axios";
import type { Note, NoteTag } from "../types/note";

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteData {
  title: string;
  content: string;
  tag: NoteTag;
}

const token = import.meta.env.VITE_NOTEHUB_TOKEN;

const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export async function fetchNotes(
  search: string,
  page: number,
  perPage: number,
): Promise<FetchNotesResponse> {
  const response = await api.get<FetchNotesResponse>("/notes", {
    params: {
      search,
      page,
      perPage,
    },
  });

  return response.data;
}

export async function createNote(note: CreateNoteData): Promise<Note> {
  const response = await api.post<Note>("/notes", note);

  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await api.delete<Note>(`/notes/${id}`);

  return response.data;
}
