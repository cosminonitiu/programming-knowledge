import { Injectable, signal, WritableSignal } from "@angular/core";
import { categories_mock } from "../../assets/data/Categories";
import { Category } from "../../shared/models/Category ";
import { Topic } from "../../shared/models/Topic";
import { Thread } from "../../shared/models/Thread";

@Injectable({
    providedIn: 'root'
})
export class SidebarContentStore {
    public currentCategories: WritableSignal<Category[]> = signal(categories_mock);
    public currentTopics: WritableSignal<Topic[]> = signal([]);
    public currentThreads: WritableSignal<Thread[]> = signal([]);

    public currentCategoryId: WritableSignal<string> = signal("");
    public currentSubcategoryId: WritableSignal<string> = signal("");
    public currentTopicId: WritableSignal<string> = signal("");

    public currentMode = "categories";

    public switchToCategoryMode() {
        this.currentMode = "categories";
        this.currentCategories.set(categories_mock);
    }

    public switchToTopicMode(categoryId: string, subcategoryId: string, topics: Topic[]) {
        this.currentMode = "topics";
        this.currentTopics.set(topics);
        this.currentCategoryId.set(categoryId);
        this.currentSubcategoryId.set(subcategoryId);
    }

    public switchToThreadMode(categoryId: string, subcategoryId: string, topicId: string, threads: Thread[]) {
        this.currentMode = "threads";
        this.currentCategoryId.set(categoryId);
        this.currentSubcategoryId.set(subcategoryId);
        this.currentTopicId.set(topicId);
        this.currentThreads.set(threads);
    }

}