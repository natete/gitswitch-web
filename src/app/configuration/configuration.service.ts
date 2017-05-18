import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Repository } from './repository/repository';
import { Http } from '@angular/http';
import { Constants } from '../shared/constants';
import { CollaboratorService } from './collaborator/collaborator.service';

@Injectable()
export class ConfigurationService {

  private readonly ACCOUNTS_ENDPOINT = `${Constants.BACKEND_URL}/api/simple_git/repository`;
  private repositories = new BehaviorSubject<Repository[]>(null);

  constructor(private http: Http,
              private collaboratorService: CollaboratorService) {
  }

  /**
   * Get the observable list of repositories.
   * @returns {Observable<Repository[]>}.
   */
  getRepositories(): Observable<Repository[]> {
    return this.repositories.asObservable();
  }

  refreshConnectedRepositories(): void {
    this.getConnectedRepositoriesList()
        .subscribe((res: Repository[]) => this.repositories.next(res));
  }

  clearData() {
    this.repositories.next(null);
  }

  /**
   * Get the list of connected accounts.
   * @returns {Observable<Repository[]>}.
   */
  private getConnectedRepositoriesList(): Observable<Repository[]> {

    return this.http.get(`${this.ACCOUNTS_ENDPOINT}/all/all?_format=json`)
               .map((repos: any) => repos.map(repo => new Repository(repo)))
               .flatMap(repos => this.collaboratorService.fetchReposCollaborators(repos))
               .catch((err: any) => Observable.throw(err));
  }
}
