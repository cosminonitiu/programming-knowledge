import { Component, Input } from '@angular/core';
import { Topic } from '../../../shared/models/Topic';

@Component({
  selector: 'app-topic-card',
  imports: [],
  templateUrl: './topic-card.component.html',
  styleUrl: './topic-card.component.css'
})
export class TopicCardComponent {
  @Input({ required: true }) topic!: Topic;
}
