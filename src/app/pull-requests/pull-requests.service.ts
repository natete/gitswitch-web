import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PullRequest } from './pull-request';
import { Http } from '@angular/http';
import { Constants } from '../shared/constants';
import { DatePipe } from '@angular/common';

@Injectable()
export class PullRequestsService {

  private readonly PULLREQUEST_ENDPOINT = `${Constants.BACKEND_URL}/api/simple_git/pull_request?_format=json`;
  private pullRequests = new BehaviorSubject<PullRequest[]>(null);

  constructor(private http: Http,
              private datePipe: DatePipe) {
  }

  /**
   * Get the observable list of pull requests.
   * @returns {Observable<PullRequest[]>}
   */
  getPullRequests(): Observable<PullRequest[]> {
    return this.pullRequests.asObservable();
  }

  refreshPullRequestList(): void {
    this.getPullRequestList()
        .subscribe((res: PullRequest[]) => this.pullRequests.next(res.map(pr => new PullRequest(this.datePipe, pr))));
  }

  clearData() {
    this.pullRequests.next(null);
  }

  /**
   * Reload the pull request list.
   * @returns {Observable<R>}
   */
  private getPullRequestList(): Observable<PullRequest[]> {
    return this.http.get(`${this.PULLREQUEST_ENDPOINT}`)
               .catch((err: any) => Observable.throw(err));
  }

}
