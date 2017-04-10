import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-tag',
  templateUrl: 'tag.component.html',
  styleUrls: ['tag.component.scss']
})
export class TagComponent implements OnInit {

  @Input() tagName: string;
  @Output() onRemove = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  onClick() {
    this.onRemove.emit(this.tagName);
  }
}
