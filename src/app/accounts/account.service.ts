import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {Account} from "./account";
import {Http, URLSearchParams} from "@angular/http";
import {Constants} from "../shared/constants";
import {MdSnackBar} from "@angular/material";

@Injectable()
export class AccountService {

  private readonly ACCOUNTS_ENDPOINT = `${Constants.BACKEND_URL}/api/simple_git/account`;
  private readonly GITHUB = 'GITHUB';
  private readonly GITLAB = 'GITLAB';
  private storage: Storage = localStorage;
  private accounts = new BehaviorSubject<Account[]>(null);

  constructor(private http: Http,
              private snackBar: MdSnackBar) {
    this.refreshConnectedAccounts()
      .subscribe((res: Account[]) => this.accounts.next(res));
  }

  /**
   * Get the observable list of accounts.
   * @returns {Observable<Account[]>}.
   */
  getAccounts(): Observable<Account[]> {
    return this.accounts.asObservable();
  }

  /**
   * Initiate the process for getting a git login code.
   */
  addAccountGitHub(): void {
    const nonce = this.createNonce();
    this.storage.setItem('GitHubNonce', nonce);

    this.http.get(`${Constants.BACKEND_URL}/api/simple_git/connector?_format=json`)
      .subscribe(
        (gitHubClient: any) => {
          const params = new URLSearchParams();
          for (let client of gitHubClient) {
            if (client.type === this.GITHUB) {
              params.set('client_id', client.client_id);
              params.set('redirect_uri', `${window.location.protocol}//${window.location.hostname}/gitswitch/accounts?account=hub`);
              params.set('state', nonce);
              params.set('scope', 'user, repo');
              params.set('allow_signup', 'false');

              location.href = 'https://github.com/login/oauth/authorize?' + params.toString();
            }
          }
        }
      )
  }

  addAccountGitLab(): void {
    const nonce = this.createNonce();
    this.storage.setItem('GitLabNonce', nonce);

    this.http.get(`${Constants.BACKEND_URL}/api/simple_git/connector?_format=json`)
      .subscribe(
        (gitLabClient: any) => {
          const params = new URLSearchParams();
          for (let client of gitLabClient) {
            if (client.type === this.GITLAB) {
              params.set('client_id', client.client_id);
              params.set('redirect_uri', `${window.location.protocol}//${window.location.hostname}/gitswitch/accounts?account=lab`);
              params.set('state', nonce);
              params.set('response_type', 'code');
              location.href = 'https://gitlab.com/oauth/authorize?' + params.toString();
            }
          }
        }
      )
  }

  /**
   * Disconnect an account.
   * @param account The account to disconnect.
   * @returns {Observable<void>}.
   */
  removeAccount(account: Account): Observable<any> {

    const params = new URLSearchParams();
    params.set('accountId', account.id.toString());

    return this.http
      .delete(`${this.ACCOUNTS_ENDPOINT}/${account.accountId}`)
      .map(() => {
        let currentValue: Account[] = this.accounts.getValue();
        const accountIndex = currentValue.indexOf(account);
        currentValue.splice(accountIndex, 1);
        this.accounts.next(currentValue);
        return account;
      })
      .catch((err: any) => {
        return Observable.throw(err)
      });
  }

  /**
   * Authorize the user account.
   * @param code The code to send to the BE so that it can obtain the access token.
   * @param nonce The nonce to check if the petition has been compromised.
   * @return {Observable<void>}.
   */
  authorizeAccount(code: string, nonce: string, type: string): Observable<void> {
    let currentNonce, api: string = null;

    if (type === 'hub') {
      currentNonce = this.storage.getItem('GitHubNonce');
      api = '/assets/json/new-account-hub.json';
    }

    if (type === 'lab') {
      currentNonce = this.storage.getItem('GitLabNonce');
      api = '/assets/json/new-account-lab.json';
    }
    if (currentNonce === nonce) {

      return this.http.post(`${this.ACCOUNTS_ENDPOINT}?_format=json`, {code: code, state: nonce})
        .map((res) => {
          const currentValue: Account[] = this.accounts.getValue();
          currentValue.push(new Account(res));
          this.accounts.next(currentValue);
        })
        .catch((err: any) => {
          if (err.status === 409) {
            this.snackBar.open('You have already added this account', null, {duration: 2000})
          }
          return Observable.throw(err)
        });
    }
  }

  /**
   * Change the default storage method.
   * @param storage The storage type.
   */
  setStorage(storage: Storage): void {
    this.storage = storage;
  }

  /**
   * Get the list of connected accounts.
   * @returns {Observable<R>}.
   */
  private refreshConnectedAccounts(): Observable<Account[]> {

    return this.http.get(`${this.ACCOUNTS_ENDPOINT}/all?_format=json`)
      .catch((err: any) => {
        return Observable.throw(err)
      });
  }

  /**
   * Create a unique string to check if a request has
   * not been compromised.
   * @returns {string} The generated code.
   */
  private createNonce(): string {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 40; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

}
