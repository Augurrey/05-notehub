import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import toast from "react-hot-toast";

import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import NoteList from "../NoteList/NoteList";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";

import { createNote, fetchNotes } from "../../services/noteService";

import type { CreateNoteData } from "../../services/noteService";

import css from "./App.module.css";

const PER_PAGE = 12;

export default function App() {
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ["notes", search, page],
    queryFn: () => fetchNotes(search, page, PER_PAGE),
    placeholderData: keepPreviousData,
  });

  const createMutation = useMutation({
    mutationFn: createNote,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["notes"],
      });

      setIsModalOpen(false);
      toast.success("Note created");
    },

    onError: () => {
      toast.error("Failed to create note");
    },
  });

  const handleSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  const handleSearchChange = (value: string) => {
    setInputValue(value);
    handleSearch(value);
  };

  const handleCreateNote = async (values: CreateNoteData) => {
    await createMutation.mutateAsync(values);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={inputValue} onChange={handleSearchChange} />

        {data && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            page={page}
            setPage={setPage}
          />
        )}

        <button
          type="button"
          className={css.button}
          onClick={() => setIsModalOpen(true)}
        >
          Create note +
        </button>
      </header>

      {isLoading && <strong>Loading...</strong>}

      {isFetching && !isLoading && <strong>Updating...</strong>}

      {isError && <strong>Something went wrong. Please try again.</strong>}

      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}

      {data && data.notes.length === 0 && !isLoading && <p>No notes found.</p>}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onSubmit={handleCreateNote}
            onCancel={() => setIsModalOpen(false)}
            isSubmitting={createMutation.isPending}
          />
        </Modal>
      )}
    </div>
  );
}
