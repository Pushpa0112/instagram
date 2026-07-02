/* MOCK — replace with real API call once backend Stories endpoints exist. */
import { Story, MOCK_STORIES } from "./mockData";

export const getStories = async (): Promise<Story[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...MOCK_STORIES]);
    }, 800); // Simulate network delay
  });
};
