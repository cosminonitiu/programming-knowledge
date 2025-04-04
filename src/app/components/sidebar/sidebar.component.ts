import { Component } from '@angular/core';
import { Category } from '../../../shared/models/Category ';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ChevronDown, ChevronRight } from 'lucide-angular';
import { categories_mock } from '../../../assets/data/Categories';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, LucideAngularModule, MatButtonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  isOpen = true;
  readonly ChevronDown = ChevronDown;
  readonly ChevronRight = ChevronRight;

  categories: Category[] = categories_mock;

  expandedCategories: { [key: string]: boolean } = {};

  constructor(private router: Router) {}

  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  }

  toggleCategory(categoryId: string): void {
    this.expandedCategories[categoryId] = !this.expandedCategories[categoryId];
  }

  navigateToSubcategory(categoryId: string, subcategoryId: string): void {
    this.router.navigate([`/${categoryId}/${subcategoryId}`]);
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }
}
