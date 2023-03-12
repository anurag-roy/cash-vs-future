import { create } from 'zustand';
import { getExpiryOptions } from './utils/ui';

const expiryOptions = getExpiryOptions();

type State = {
  selectedTab: number;
  isEntryStarted: boolean;
  isExitStarted: boolean;
  expiry: string;
  enteredStock: string;
  enteredDiff: '' | number;
  exitDiffPercent: '' | number;
};

type Action = {
  updateSelectedTab: (selectedTab: number) => void;
  updateIsEntryStarted: (isEntryStarted: boolean) => void;
  updateIsExitStarted: (isEntryStarted: boolean) => void;
  updateExpiry: (expiry: string) => void;
  updateEnteredStock: (enteredStock: string) => void;
  updateEnteredDiff: (enteredDiff: '' | number) => void;
  updateExitDiffPercent: (exitDiffPercent: '' | number) => void;
};

export const useStore = create<State & Action>((set) => ({
  selectedTab: 0,
  isEntryStarted: false,
  isExitStarted: false,
  expiry: expiryOptions[0],
  enteredStock: '',
  enteredDiff: 0,
  exitDiffPercent: 0,
  updateSelectedTab: (selectedTab) => set(() => ({ selectedTab })),
  updateIsEntryStarted: (isEntryStarted) => set(() => ({ isEntryStarted })),
  updateIsExitStarted: (isExitStarted) => set(() => ({ isExitStarted })),
  updateExpiry: (expiry) => set(() => ({ expiry })),
  updateEnteredStock: (enteredStock) => set(() => ({ enteredStock })),
  updateEnteredDiff: (enteredDiff) => set(() => ({ enteredDiff })),
  updateExitDiffPercent: (exitDiffPercent) => set(() => ({ exitDiffPercent })),
}));
