import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Repository } from './repository/repository';
import { Http } from '@angular/http';
import { Constants } from '../shared/constants';
import { Collaborator } from './repository/collaborator';

@Injectable()
export class ConfigurationService {

  private readonly ACCOUNTS_ENDPOINT = `${Constants.BACKEND_URL}/api/simple_git/repository`;
  private readonly COLLABORATORS_ENDPOINT = `${Constants.BACKEND_URL}/api/simple_git/collaborator`;
  private repositories = new BehaviorSubject<Repository[]>(null);

  constructor(private http: Http) {
    this.refreshConnectedRepositories()
        .subscribe((res: Repository[]) => this.repositories.next(res));
  }

  /**
   * Get the observable list of repositories.
   * @returns {Observable<Repository[]>}.
   */
  getRepositories(): Observable<Repository[]> {
    return this.repositories.asObservable();
  }

  /**
   * Get the list of connected accounts.
   * @returns {Observable<R>}.
   */
  private refreshConnectedRepositories(): Observable<Repository[]> {

    return this.http.get(`${this.ACCOUNTS_ENDPOINT}/all/all?_format=json`)
    // .map(res => res.json ? res.json() : res)
               .map((repos: any) => repos.map(repo => new Repository(repo)))
               .flatMap(repos => this.addCollaboratorsToRepos(repos))
               // .map(repos => this.addCollaboratorsToRepos(repos))
               .catch((err: any) => Observable.throw(err));
  }

  private addCollaboratorsToRepos(repos: Repository[]): Observable<Repository[]> {
    return Observable.forkJoin(repos.map(
      repo => repo.canAdmin ? this.addCollaboratorsToRepo(repo) : Observable.of(repo))
    );
  }

  private addCollaboratorsToRepo(repo: Repository): Observable<Repository> {
    return this.http.get(`${this.COLLABORATORS_ENDPOINT}/${repo.accountId}/${repo.username}/${repo.name}/all?_format=json`)
               .map((res: any) => res as Collaborator[])
               .do(collaborators => repo.collaborators = collaborators)
               .map(collaborators => repo);
    // .subscribe(collaborators => repo.collaborators = collaborators)
  }
}
