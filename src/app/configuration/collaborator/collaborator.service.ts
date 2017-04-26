import { Injectable } from '@angular/core';
import { Repository } from '../repository/repository';
import { Observable, BehaviorSubject } from 'rxjs';
import { Http } from '@angular/http';
import { Collaborator } from './collaborator';
import { Constants } from '../../shared/constants';
import { User } from './user/user';

@Injectable()
export class CollaboratorService {

  private readonly COLLABORATORS_ENDPOINT = `${Constants.BACKEND_URL}/api/simple_git/collaborator`;
  private readonly FORMAT_URL = '?_format=json';

  private collaborators = new BehaviorSubject<Collaborator[]>(null);

  constructor(private http: Http) { }

  fetchReposCollaborators(repos: Repository[]): Observable<Repository[]> {
    return Observable.forkJoin(repos.map(
      repo => repo.canAdmin ? this.fetchRepoCollaborators(repo) : Observable.of(repo))
    );
  }

  fetchRepoCollaborators(repo: Repository): Observable<Repository> {
    return this.http.get(`${this.COLLABORATORS_ENDPOINT}/${repo.accountId}/${repo.username}/${repo.name}/all${this.FORMAT_URL}`)
               .map((res: any) => res as Collaborator[])
               .do(collaborators => repo.collaborators = collaborators)
               .map(collaborators => repo);
  }

  /**
   * Removes it from the collaborator the repository has.
   * @param repository data of repository where the user has.
   * @param user data of user to remove user as a collaborator.
   */
  deleteCollaborator(repository: Repository, username: string): Observable<any> {
    return this.http
        .delete(`${this.COLLABORATORS_ENDPOINT}/${repository.accountId}/${repository.username}/${repository.name}/${username}${this.FORMAT_URL}`)
        .map(() =>{
      const collaborators = this.collaborators.getValue()
                                .filter((co: Collaborator) => co.username !== username);
          this.collaborators.next(collaborators)
          return collaborators;
        });
  }

  /**
   * Add it from the collaborator the repository has.
   * @param repository data of repository where the user isn't collaborator.
   * @param user data of user to add user as a collaborator.
   */
  addCollaborator(repository: Repository, user: User): void {
    this.http
        .put(`${this.COLLABORATORS_ENDPOINT}/${repository.accountId}/${repository.username}/${repository.name}/${user.username}${this.FORMAT_URL}`, JSON.stringify({}))
        .subscribe((collaborator: any) => {
            const collaborators: Collaborator[] = this.collaborators.getValue();
            collaborators.push(collaborator as Collaborator);
            this.collaborators.next(collaborators);
          },
          err => {return Observable.throw(err)});
  }
}