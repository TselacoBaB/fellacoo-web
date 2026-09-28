"use client";

import { useCallback, useState } from "react";
import type { BuilderDocument } from "@/types/builder";

type DocumentUpdater = BuilderDocument | ((current: BuilderDocument) => BuilderDocument);

export function useBuilderHistory(initialDocument: BuilderDocument) {
  const [document, setDocument] = useState<BuilderDocument>(initialDocument);
  const [past, setPast] = useState<BuilderDocument[]>([]);
  const [future, setFuture] = useState<BuilderDocument[]>([]);

  const updateDocument = useCallback((updater: DocumentUpdater) => {
    setDocument((current) => {
      const next = typeof updater === "function" ? updater(current) : updater;
      if (next === current) return current;
      setPast((items) => [...items.slice(-49), current]);
      setFuture([]);
      return next;
    });
  }, []);

  const undo = useCallback(() => {
    setPast((items) => {
      const previous = items[items.length - 1];
      if (!previous) return items;
      setFuture((itemsFuture) => [...itemsFuture.slice(-49), document]);
      setDocument(previous);
      return items.slice(0, -1);
    });
  }, [document]);

  const redo = useCallback(() => {
    setFuture((items) => {
      const next = items[items.length - 1];
      if (!next) return items;
      setPast((itemsPast) => [...itemsPast.slice(-49), document]);
      setDocument(next);
      return items.slice(0, -1);
    });
  }, [document]);

  const resetDocument = useCallback((next: BuilderDocument) => {
    setDocument(next);
    setPast([]);
    setFuture([]);
  }, []);

  return {
    document,
    updateDocument,
    resetDocument,
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0
  };
}
