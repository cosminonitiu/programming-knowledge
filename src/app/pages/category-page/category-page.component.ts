import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../../../shared/models/Category ';
import { Subcategory } from '../../../shared/models/Subcategory';
import { Topic } from '../../../shared/models/Topic';
import { categories_mock } from '../../../assets/data/Categories';
import { TopicGridComponent } from '../../components/topic-grid/topic-grid.component';
import { SidebarContentStore } from '../../services/sidebar-content.store';

@Component({
  selector: 'app-category-page',
  imports: [TopicGridComponent],
  templateUrl: './category-page.component.html',
  styleUrl: './category-page.component.css'
})
export class CategoryPageComponent implements OnInit{
  private categoryId: string = '';
  private subcategoryId: string = '';
  public category!: Category;
  public subcategory!: Subcategory;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    public sidebarContentStore: SidebarContentStore
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.categoryId = params['categoryId'];
      this.subcategoryId = params['subcategoryId'];
      if(this.categoryId && this.subcategoryId) {
        const category = categories_mock.find(c => c.id === this.categoryId);
        if(category) {
          this.category = category;
          const subcategory = category.subcategories.find(sc => sc.id === this.subcategoryId);
          if(subcategory) {
            this.subcategory = subcategory;
            this.sidebarContentStore.switchToTopicMode(category.id, subcategory.id, subcategory.topics);
          }
        }
      }
    });
  }

  public categoryClick() {
    this.router.navigate(['/'])
  }
}
