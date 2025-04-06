import { Component } from '@angular/core';
import { categories_mock } from '../../../assets/data/Categories';
import { LucideAngularModule } from 'lucide-angular';
import { Router } from '@angular/router';
import { SidebarContentStore } from '../../services/sidebar-content.store';

@Component({
  selector: 'app-home-page',
  imports: [LucideAngularModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

  constructor(
    private router: Router,
    public sidebarContentStore: SidebarContentStore
  ) {
    sidebarContentStore.switchToCategoryMode();
  }

  public categories = categories_mock;

  public navigateToSubcategory(categoryId: string, subcategoryId: string) {
    this.router.navigate([`/${categoryId}/${subcategoryId}`]);
  }
}
