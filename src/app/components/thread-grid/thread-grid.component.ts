import { Component, Input } from '@angular/core';
import { Thread } from '../../../shared/models/Thread';
import { ThreadCardComponent } from '../thread-card/thread-card.component';
import { Category } from '../../../shared/models/Category ';
import { Subcategory } from '../../../shared/models/Subcategory';
import { Topic } from '../../../shared/models/Topic';
import { Router } from '@angular/router';

@Component({
  selector: 'app-thread-grid',
  imports: [ThreadCardComponent],
  templateUrl: './thread-grid.component.html',
  styleUrl: './thread-grid.component.css'
})
export class ThreadGridComponent {
  @Input({required: true}) threads!: Thread[];
  @Input({required: true}) category!: Category;
  @Input({required: true}) subcategory!: Subcategory;
  @Input({required: true}) topic!: Topic;

  constructor(private router: Router) {}

  public handleThreadClick(thread: Thread) {
    this.router.navigate([`/${this.category.id}/${this.subcategory.id}/${this.topic.id}/${thread.id}`])
  }
}
