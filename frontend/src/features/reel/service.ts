/* MOCK — replace with real API call once backend Reels endpoints exist. */
import { Reel, MOCK_REELS } from "./mockData";

// TODO: Replace with real backend endpoint
export const getReels = async (): Promise<Reel[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...MOCK_REELS]);
    }, 800); // Simulate network delay
  });
};
