import { Component, OnInit } from '@angular/core';
import { MdDialogRef, MdSnackBar } from '@angular/material';
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
  private usersSubscription: Subscription;
  searchUser: string;
  private userSelected: User;

  constructor(public dialogRef: MdDialogRef<FindCollaboratorDialog>,
              private userService: UserService,
              private spinnerService: SpinnerService) { }

  ngOnInit() {
  }

  /**
   * Search list of users for that username
   */
  search() {
    this.spinnerService.showSpinner();

    // Get the list of users
    this.usersSubscription = this.userService.getUsers(this.searchUser)
                                 .filter(users => !!users)
                                 .do(()=> this.spinnerService.hideSpinner())
                                 .subscribe(
                                   (users) => {
                                     this.users = users;
                                   },
                                   (error) => {
                                     this.users = undefined;
                                     console.error(error);
                                   },
                                   () => this.spinnerService.hideSpinner()
                                 );
  }

  /**
   * Get the selected user
   * @param user data of user
   */
  getUserSelect(user) {
    this.userSelected = user;
  }

  /**
   * Confirm the selected user to add to repositories
   * @param user data of user
   */
  confirmSelection() {
    this.dialogRef.close(this.userSelected);
  }

  deleteUsername() {
    this.searchUser = undefined;
    this.users = undefined;
  }
}
