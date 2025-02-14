import type { Group } from "@/store/score-store";

export const scoreStorage = {
  async getScores(): Promise<Group[]> {
    try {
      const response = await fetch("/api/scores");
      const data = (await response.json()) as Group[];
      return data;
    } catch (error) {
      console.error("Failed to get scores:", error);
      return [];
    }
  },

  async setScores(groups: Group[]): Promise<void> {
    try {
      const response = await fetch("/api/scores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(groups),
      });

      if (!response.ok) {
        throw new Error("Failed to save scores");
      }
    } catch (error) {
      console.error("Failed to set scores:", error);
    }
  },
};
