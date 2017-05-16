import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from './user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  @Input() user: User;
  @Input() lastUser: User;
  @Output() userSelect = new EventEmitter<User>();

  constructor() {
  }

  ngOnInit() {

  }

  /**
   * Select a user of de list
   */
  selectedUser(){
    if(this.lastUser && this.lastUser.type!==this.user.type){
      this.lastUser.selected = !this.lastUser.selected;
    }
    this.user.selected = !this.user.selected;
    if(this.user.selected) {
      this.userSelect.emit(this.user);
    }else{
      this.userSelect.emit(null);
    }
  }

}
