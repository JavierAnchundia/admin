import { Component, OnInit } from '@angular/core';
import { ComunicateNavSiderService } from '../../services/comunicatens/comunicate-nav-sider.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isCollapsed: boolean = false;
  rolSuperAdmin: boolean = true;
  constructor(
    private comunicateNSService: ComunicateNavSiderService
  ) { }

  ngOnInit(): void {
    this.comunicateNSService.change.subscribe(isOpen => {
      this.isCollapsed = isOpen;
    });
  }

}
