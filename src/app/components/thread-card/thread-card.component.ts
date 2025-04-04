import { Component, Input } from '@angular/core';
import { Thread } from '../../../shared/models/Thread';

@Component({
  selector: 'app-thread-card',
  imports: [],
  templateUrl: './thread-card.component.html',
  styleUrl: './thread-card.component.css'
})
export class ThreadCardComponent {
  @Input({ required: true }) thread!: Thread;
}
