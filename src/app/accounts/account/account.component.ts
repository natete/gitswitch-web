import { Component, Input, OnInit } from '@angular/core';
import { Account } from '../account';
import { AccountService } from '../account.service';
import { MdSnackBar } from '@angular/material';
import { DialogsService } from '../../shared/dialogs/dialogs.service';
import { SpinnerService } from '../../shared/providers/spinner.service';
import 'rxjs/add/operator/do';
import { AutoUnsubscribe } from '../../shared/auto-unsubscribe/auto-unsubscribe.decorator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
@AutoUnsubscribe()
export class AccountComponent implements OnInit {

  @Input() account: Account;
  private snackbarSubscription: Subscription;

  constructor(private accountService: AccountService,
              private dialogService: DialogsService,
              private spinnerService: SpinnerService,
              private snackBar: MdSnackBar) { }

  ngOnInit() {
  }

  /**
   * Remove an existing account.
   * @param account The account to disconnect.
   */
  removeAccount(account: Account): void {

    // this.snackbarSubscription =
    this.dialogService.confirm('Confirm Remove', 'Are you sure you want to disconnect this account?')
        .filter(res => res)
        .do(() => this.spinnerService.showSpinner())
        .toPromise()
        .then(() => this.performRemoveAccount(account));
    // .map(obs => Observable.forkJoin([this.accountService.removeAccount(account), Observable.of(null)]))
    // .flatMap((res) => {
    //   console.log(res);
    //   return res;
    // })
    // .do(() => this.spinnerService.hideSpinner())
    // .subscribe(() => console.log('finiched'));
    // .map(() => {
    //   this.spinnerService.showSpinner();
    //   this.accountService.removeAccount(account)
    //       .subscribe(() => {
    //         this.snackBar.open('Account successfully removed', null, { duration: 2000 });
    //         this.spinnerService.hideSpinner();
    //       });
    // });

  }

  private performRemoveAccount(account: Account) {
    this.accountService.removeAccount(account)
        .do(() => this.spinnerService.hideSpinner())
        .do(() => this.snackBar.open('Account successfully removed', null, { duration: 2000 }))
        .toPromise()
        .then(() => console.log('finiched'));
  }
}
