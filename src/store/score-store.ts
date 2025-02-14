import { create } from "zustand";
import { scoreStorage } from "@/lib/redis";

export interface Group {
  id: string;
  name: string;
  description: string;
  score: number;
}

interface ScoreState {
  groups: Group[];
  numGroups: number;
  editMode: boolean;
  isLoading: boolean;
  setNumGroups: (num: number) => void;
  setGroups: (groups: Group[]) => Promise<void>;
  setEditMode: (mode: boolean) => void;
  updateGroupName: (id: string, name: string) => Promise<void>;
  updateGroupDescription: (id: string, description: string) => Promise<void>;
  updateGroupScore: (id: string, scoreToAdd: number) => Promise<void>;
  setDirectScore: (id: string, score: string) => Promise<void>;
  loadGroups: () => Promise<void>;
}

export const useScoreStore = create<ScoreState>((set, get) => ({
  groups: [],
  numGroups: 2,
  editMode: false,
  isLoading: true,

  loadGroups: async () => {
    const groups = await scoreStorage.getScores();
    set({ groups, isLoading: false });
  },

  setNumGroups: (num) => set({ numGroups: num }),

  setGroups: async (groups) => {
    set({ groups });
    await scoreStorage.setScores(groups);
  },

  setEditMode: (mode) => set({ editMode: mode }),

  updateGroupName: async (id, name) => {
    const newGroups = get().groups.map((group) =>
      group.id === id ? { ...group, name } : group,
    );
    set({ groups: newGroups });
    await scoreStorage.setScores(newGroups);
  },

  updateGroupDescription: async (id, description) => {
    const newGroups = get().groups.map((group) =>
      group.id === id ? { ...group, description } : group,
    );
    set({ groups: newGroups });
    await scoreStorage.setScores(newGroups);
  },

  updateGroupScore: async (id, scoreToAdd) => {
    const newGroups = get().groups.map((group) => {
      if (group.id === id) {
        const currentScore = Number(group.score) || 0;
        const addScore = Number(scoreToAdd) || 0;
        return {
          ...group,
          score: currentScore + addScore,
        };
      }
      return group;
    });
    set({ groups: newGroups });
    await scoreStorage.setScores(newGroups);
  },

  setDirectScore: async (id, score) => {
    const newGroups = get().groups.map((group) =>
      group.id === id ? { ...group, score: parseInt(score) || 0 } : group,
    );
    set({ groups: newGroups });
    await scoreStorage.setScores(newGroups);
  },
}));
