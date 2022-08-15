import {ReactNode} from "react";

export type TerminalHistoryItem = ReactNode | string;
export type TerminalHistory = TerminalHistoryItem[];
export type TerminalPushToHistoryWithDelayProps = {
  content: TerminalHistoryItem;
  delay?: number;
};


export type TerminalCommands = {
  [command: string]: () => void;
};

export type TerminalProps = {
    history: TerminalHistory;
    pushToHistory: (item: TerminalHistoryItem) => void;
  promptLabel?: TerminalHistoryItem;
  commands: TerminalCommands;
};