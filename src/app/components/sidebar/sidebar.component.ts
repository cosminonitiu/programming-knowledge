import { Component, EventEmitter, Output, Input } from '@angular/core';
import { Category } from '../../../shared/models/Category ';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ChevronDown, ChevronRight, Outdent } from 'lucide-angular';
import { categories_mock } from '../../../assets/data/Categories';
import {MatButtonModule} from '@angular/material/button';
import { SidebarContentStore } from '../../services/sidebar-content.store';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, LucideAngularModule, MatButtonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  constructor(
    private router: Router,
    public sidebarConentStore: SidebarContentStore
  ) {}

  readonly ChevronDown = ChevronDown;
  readonly ChevronRight = ChevronRight;

  @Input({required: true}) isOpen!: boolean;
  @Output() sidebarToggle = new EventEmitter<boolean>(true);

  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
    this.sidebarToggle.next(this.isOpen);
  }

  expandedCategories: { [key: string]: boolean } = {};

  toggleCategory(categoryId: string): void {
    this.expandedCategories[categoryId] = !this.expandedCategories[categoryId];
  }

  navigateToSubcategory(categoryId: string, subcategoryId: string): void {
    this.router.navigate([`/${categoryId}/${subcategoryId}`]);
  }
  navigateToTopic(topicId: string,): void {
    const categoryId = this.sidebarConentStore.currentCategoryId();
    const subcategoryId = this.sidebarConentStore.currentSubcategoryId();
    if(categoryId && subcategoryId){
      this.router.navigate([`/${categoryId}/${subcategoryId}/${topicId}`]);
    }
  }
  navigateToThread(threadId: string): void {
    const categoryId = this.sidebarConentStore.currentCategoryId();
    const subcategoryId = this.sidebarConentStore.currentSubcategoryId();
    const topicId = this.sidebarConentStore.currentTopicId();
    if(categoryId && subcategoryId && topicId){
      this.router.navigate([`/${categoryId}/${subcategoryId}/${topicId}/${threadId}`]);
    }
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  isActiveThread(threadId: string): boolean {
    const categoryId = this.sidebarConentStore.currentCategoryId();
    const subcategoryId = this.sidebarConentStore.currentSubcategoryId();
    const topicId = this.sidebarConentStore.currentTopicId();
    if(categoryId && subcategoryId && topicId){
      return this.router.url === '/' + categoryId + '/' + subcategoryId + '/' + topicId + '/' + threadId;
    }
    return false;
  }
}
