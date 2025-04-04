import { Thread } from "./Thread";
import { Topic } from "./Topic";

export interface Subcategory {
    id: string;
    name: string;
    description: string;
    topics: Topic[]
}