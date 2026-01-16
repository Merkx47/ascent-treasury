import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { mockCheckerQueue as initialMockCheckerQueue, type MockCheckerQueueItem } from "@/lib/mockData";

interface CheckerQueueContextType {
  queueItems: MockCheckerQueueItem[];
  addToQueue: (item: Omit<MockCheckerQueueItem, "id" | "submittedAt" | "status">) => void;
  updateQueueItem: (id: string, updates: Partial<MockCheckerQueueItem>) => void;
  removeFromQueue: (id: string) => void;
  getQueueCount: () => number;
}

const CheckerQueueContext = createContext<CheckerQueueContextType | null>(null);

export function CheckerQueueProvider({ children }: { children: ReactNode }) {
  const [queueItems, setQueueItems] = useState<MockCheckerQueueItem[]>([...initialMockCheckerQueue]);

  const addToQueue = useCallback((item: Omit<MockCheckerQueueItem, "id" | "submittedAt" | "status">) => {
    const newItem: MockCheckerQueueItem = {
      ...item,
      id: `queue-${Date.now()}`,
      submittedAt: new Date(),
      status: "pending",
    };
    setQueueItems((prev) => [newItem, ...prev]);
  }, []);

  const updateQueueItem = useCallback((id: string, updates: Partial<MockCheckerQueueItem>) => {
    setQueueItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  }, []);

  const removeFromQueue = useCallback((id: string) => {
    setQueueItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const getQueueCount = useCallback(() => {
    return queueItems.filter((item) => item.status === "pending").length;
  }, [queueItems]);

  return (
    <CheckerQueueContext.Provider
      value={{
        queueItems,
        addToQueue,
        updateQueueItem,
        removeFromQueue,
        getQueueCount,
      }}
    >
      {children}
    </CheckerQueueContext.Provider>
  );
}

export function useCheckerQueue() {
  const context = useContext(CheckerQueueContext);
  if (!context) {
    throw new Error("useCheckerQueue must be used within a CheckerQueueProvider");
  }
  return context;
}
