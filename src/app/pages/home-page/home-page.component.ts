import { Component } from '@angular/core';
import { categories_mock } from '../../../assets/data/Categories';
import { LucideAngularModule } from 'lucide-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [LucideAngularModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

  constructor(private router: Router) {}

  public categories = categories_mock;

  public navigateToSubcategory(categoryId: string, subcategoryId: string) {
    this.router.navigate([`/${categoryId}/${subcategoryId}`]);
  }
}
