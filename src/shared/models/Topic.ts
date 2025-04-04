import { Thread } from "./Thread";

export interface Topic {
    id: string;
    title: string;
    description: string;
    threads: Thread[]
  }
  