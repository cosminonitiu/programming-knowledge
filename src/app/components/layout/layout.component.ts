import { Component } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { RouterModule } from '@angular/router';
import { SidebarContentStore } from '../../services/sidebar-content.store';
import { ChevronRight, LucideAngularModule } from 'lucide-angular';


@Component({
  selector: 'app-layout',
  imports: [SidebarComponent, RouterModule, LucideAngularModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  constructor(public sidebarContentStore: SidebarContentStore){}
  readonly ChevronRight = ChevronRight;
}
