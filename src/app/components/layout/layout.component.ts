import { Component } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-layout',
  imports: [SidebarComponent, RouterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  public isOpen = true;
  public toggleSidebar() {
    this.isOpen = !this.isOpen;
  }
}
