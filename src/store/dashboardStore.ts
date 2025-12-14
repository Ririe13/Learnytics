import { create } from "zustand";
import { FilterOptions } from "@/types/learning";
import { format, subMonths } from "date-fns";

interface DashboardState {
  filters: FilterOptions;
  setFilters: (filters: Partial<FilterOptions>) => void;
  resetFilters: () => void;
}

const defaultFilters: FilterOptions = {
  startDate: format(subMonths(new Date(), 3), "yyyy-MM-dd"),
  endDate: format(new Date(), "yyyy-MM-dd"),
  cohort: "",
  module: "",
  searchQuery: "",
};

export const useDashboardStore = create<DashboardState>((set) => ({
  filters: defaultFilters,
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  resetFilters: () => set({ filters: defaultFilters }),
}));
