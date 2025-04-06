import { Component } from '@angular/core';
import { Category } from '../../../shared/models/Category ';
import { Subcategory } from '../../../shared/models/Subcategory';
import { Topic } from '../../../shared/models/Topic';
import { Thread } from '../../../shared/models/Thread';
import { ActivatedRoute, Router } from '@angular/router';
import { categories_mock } from '../../../assets/data/Categories';
import { LucideAngularModule, ArrowLeft } from 'lucide-angular';
import { MarkdownComponent  } from 'ngx-markdown';
import { ThreadContentService } from '../../services/thread-content.service';
import { SidebarContentStore } from '../../services/sidebar-content.store';

@Component({
  selector: 'app-thread-page',
  imports: [LucideAngularModule, MarkdownComponent],
  templateUrl: './thread-page.component.html',
  styleUrl: './thread-page.component.css'
})
export class ThreadPageComponent {
  private categoryId: string = '';
  private subcategoryId: string = '';
  private topicId: string = '';
  private threadId: string = '';
  public category!: Category;
  public subcategory!: Subcategory;
  public topic!: Topic;
  public thread!: Thread;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private threadContentService: ThreadContentService,
    private sidebarContentStore: SidebarContentStore
  ) {
    this.route.params.subscribe(params => {
      this.categoryId = params['categoryId'];
      this.subcategoryId = params['subcategoryId'];
      this.topicId = params['topicId'];
      this.threadId = params['threadId'];
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
              const thread = topic.threads.find(t => t.id === this.threadId);
              if(thread) {
                this.thread = thread;
                this.sidebarContentStore.switchToThreadMode(category.id, subcategory.id, topic.id, topic.threads);
                this.loadThreadContent(thread.contentPath);
              }
            }
          }
        }
      }
    });
  }

  readonly ArrowLeft = ArrowLeft;
  public markdown = '';
  public loadingDone = false;

  private loadThreadContent(contentPath: string) {
    this.threadContentService.getThreadContent(contentPath).subscribe(content => {
      if (content) {
        this.markdown = this.processMarkdownContent(content);
        this.loadingDone = true;
      } else {
        console.error(`Content not found for thread: ${this.threadId}`);
      }
    });
  }

  private processMarkdownContent(content: string): string {
    let processedContent = content.trim();
    const lines = processedContent.split('\n');
    // const processedLines = lines.map(line => {
    //   return line.replace(/^\s+/, '');
    // });
    return lines.join('\n');
  }

  public categoryClick() {
    this.router.navigate(['/'])
  }
  public subcategoryClick() {
    this.router.navigate([`/${this.categoryId}/${this.subcategoryId}`]);
  }
  public topicClick() {
    this.router.navigate([`/${this.categoryId}/${this.subcategoryId}/${this.topicId}`]);
  }

  public example_markdown  = `## Common Language Runtime (CLR)
  ---
  
  The Common Language Runtime (CLR) is the virtual machine component of Microsoft's .NET framework that manages the execution of .NET programs.
  ### Key Features
  \`\`\`typescript
  const language = 'typescript';
  \`\`\`
  
  ### Lists
  1. Ordered list
  2. Another bullet point
     - Unordered list
     - Another unordered bullet
  
  ### Blockquote
  > Blockquote to the max`;
}
