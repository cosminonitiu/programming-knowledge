import { Component } from '@angular/core';
import { ThreadGridComponent } from '../../components/thread-grid/thread-grid.component';
import { ActivatedRoute, Router } from '@angular/router';
import { categories_mock } from '../../../assets/data/Categories';
import { Category } from '../../../shared/models/Category ';
import { Subcategory } from '../../../shared/models/Subcategory';
import { Topic } from '../../../shared/models/Topic';
import { Thread } from '../../../shared/models/Thread';

@Component({
  selector: 'app-topic-page',
  imports: [ThreadGridComponent],
  templateUrl: './topic-page.component.html',
  styleUrl: './topic-page.component.css'
})
export class TopicPageComponent {
  private categoryId: string = '';
  private subcategoryId: string = '';
  private topicId: string = '';
  public category!: Category;
  public subcategory!: Subcategory;
  public topic!: Topic;
  public threads: Thread[] = [];

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.params.subscribe(params => {
      this.categoryId = params['categoryId'];
      this.subcategoryId = params['subcategoryId'];
      this.topicId = params['topicId'];
      if(this.categoryId && this.subcategoryId && this.topicId) {
        const category = categories_mock.find(c => c.id === this.categoryId);
        if(category) {
          this.category = category;
          const subcategory = category.subcategories.find(sc => sc.id === this.subcategoryId);
          if(subcategory) {
            this.subcategory = subcategory;
            const topic = subcategory.topics.find(t => t.id === this.topicId);
            if(topic) {
              this.topic = topic;
              this.threads = topic.threads;
            }
          }
        }
      }
    });
  }

  public categoryClick() {
    this.router.navigate(['/'])
  }
  public subcategoryClick() {
    this.router.navigate([`/${this.categoryId}/${this.subcategoryId}`]);
  }
}
