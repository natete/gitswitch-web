import { Injectable } from '@angular/core';
import { Repository } from '../repository/repository';
import { Observable } from 'rxjs';
import { Http } from '@angular/http';
import { Collaborator } from './collaborator';
import { Constants } from '../../shared/constants';
import { User } from './user/user';

@Injectable()
export class CollaboratorService {

  private readonly COLLABORATORS_ENDPOINT = `${Constants.BACKEND_URL}/api/simple_git/collaborator`;
  private readonly FORMAT_URL = '?_format=json';

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
               .map(collaborators => repo)
               .catch((err: any) => {
                 console.log('error');
                 return Observable.throw(err)
               });
  }

  /**
   * Removes it from the collaborator the repository has.
   * @param repository data of repository where the user has.
   * @param user data of user to remove user as a collaborator.
   */
  deleteCollaborator(repository: Repository, username: string): Observable<any> {
    return this.http
               .delete(`${this.COLLABORATORS_ENDPOINT}/${repository.accountId}/${repository.username}/${repository.name}/${username}${this.FORMAT_URL}`)
               .catch((err: any) => {
                 console.log('error');
                 return Observable.throw(err)
               });
  }

  /**
   * Add it from the collaborator the repository has.
   * @param repository data of repository where the user isn't collaborator.
   * @param user data of user to add user as a collaborator.
   */
  addCollaborator(repository: Repository, user: User): Observable<any> {
    return this.http
               .put(`${this.COLLABORATORS_ENDPOINT}/${repository.accountId}/${repository.username}/${repository.name}/${user.username}${this.FORMAT_URL}`, JSON.stringify({}))
               .catch((err: any) => {
                 console.log('error');
                 return Observable.throw(err)
               });
  }
}