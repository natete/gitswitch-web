import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from './user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  @Input() user: User;
  @Output() userSelect = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit() {

  }

  selectedUser(user){
    this.userSelect.emit(user);
  }

}
