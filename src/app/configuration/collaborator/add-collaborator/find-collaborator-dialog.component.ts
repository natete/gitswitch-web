import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { AutoUnsubscribe } from '../../../shared/auto-unsubscribe/auto-unsubscribe.decorator';
import { Subscription } from 'rxjs';
import { UserService } from '../user/user.service';
import { SpinnerService } from '../../../shared/providers/spinner.service';
import { User } from '../user/user';

@Component({
  selector: 'app-find-collaborator-dialog',
  templateUrl: './find-collaborator-dialog.component.html',
  styleUrls: ['./find-collaborator-dialog.component.scss']
})
@AutoUnsubscribe()
export class FindCollaboratorDialog implements OnInit {

  title = 'Which one...?';
  private users: User[];
  private user: User;
  private usersSubscription: Subscription;
  searchUser: string;
  private userSelected: User;

  constructor(public dialogRef: MdDialogRef<FindCollaboratorDialog>,
              private userService: UserService,
              private spinnerService: SpinnerService) { }

  ngOnInit() {

  }

  search(){
    this.spinnerService.showSpinner();

    // Get the list of users
    this.usersSubscription = this.userService.getUsers(this.searchUser)
                                 .filter(users => !!users)
                                 .do(()=> this.spinnerService.hideSpinner())
                                 .subscribe(
                                   (users) => this.users = users,
                                   (error) => console.error(error)
                                 );
  }

  getUserSelect(event) {
    this.userSelected = event;
  }

  confirmSelection() {
    this.dialogRef.close(this.userSelected);
  }

}
