import { Component, Input } from '@angular/core';
import { Topic } from '../../../shared/models/Topic';
import { TopicCardComponent } from '../topic-card/topic-card.component';
import { Category } from '../../../shared/models/Category ';
import { Subcategory } from '../../../shared/models/Subcategory';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topic-grid',
  imports: [TopicCardComponent],
  templateUrl: './topic-grid.component.html',
  styleUrl: './topic-grid.component.css'
})
export class TopicGridComponent {
  @Input({required: true}) topics!: Topic[];
  @Input({required: true}) category!: Category;
  @Input({required: true}) subcategory!: Subcategory;

  constructor(private router: Router){}

  public onClick(topic: Topic) {
    this.router.navigate([`/${this.category.id}/${this.subcategory.id}/${topic.id}`])
  }
}
