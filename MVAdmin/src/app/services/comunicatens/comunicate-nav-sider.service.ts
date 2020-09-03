import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComunicateNavSiderService {
  isCollapsed = false;

  @Output() change: EventEmitter<boolean> = new EventEmitter();

  toggle() {
    this.isCollapsed = !this.isCollapsed;
    this.change.emit(this.isCollapsed);
  }
  constructor() { }
}
