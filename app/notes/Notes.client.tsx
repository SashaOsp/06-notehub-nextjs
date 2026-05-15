"use client";

import css from "./Notes.module.css";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import SearchBox from "@/components/SearchBox/SearchBox";

import { fetchNotes } from "../../lib/api";

import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

export default function App() {
  const [note, setNote] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryKey = ["notes", note, currentPage];

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => fetchNotes(currentPage, note),
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.totalPages ?? 0;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setNote(value);
    setCurrentPage(1);
  }, 300);

  const hasPagination = totalPages > 1;
  const hasNotes = data && !isLoading;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={debouncedSearch} />
        {hasPagination && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
        <button onClick={openModal} className={css.button}>
          Create note +
        </button>
        {isModalOpen && (
          <Modal onClose={closeModal}>
            <NoteForm onEnd={closeModal} />
          </Modal>
        )}
      </header>
      {hasNotes && <NoteList notes={data.notes} />}
    </div>
  );
}
