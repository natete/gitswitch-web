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
  userSelected: boolean = false;

  constructor() {
  }

  ngOnInit() {

  }

  selectedUser(user){
    this.userSelected = !this.userSelected;
    if(this.userSelected) {
      this.userSelect.emit(user);
    }
  }

}
