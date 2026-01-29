import { create } from "zustand";

interface ApiLoadingState {
  isApiLoading: boolean;
  startApiCall: () => void;
  endApiCall: () => void;
}

let pendingRequests = 0;

const useApiLoadingStore = create<ApiLoadingState>((set) => ({
  isApiLoading: false,
  startApiCall: () => {
    pendingRequests++;
    if (pendingRequests === 1) {
      set({ isApiLoading: true });
    }
  },
  endApiCall: () => {
    if (pendingRequests > 0) {
      pendingRequests--;
    }
    if (pendingRequests === 0) {
      set({ isApiLoading: false });
    }
  },
}));

export default useApiLoadingStore;
