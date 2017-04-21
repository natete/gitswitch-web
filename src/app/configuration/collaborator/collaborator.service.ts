import { Injectable } from '@angular/core';
import { Repository } from '../repository/repository';
import { Observable } from 'rxjs';
import { Http } from '@angular/http';
import { Collaborator } from './collaborator';
import { Constants } from '../../shared/constants';

@Injectable()
export class CollaboratorService {

  private readonly COLLABORATORS_ENDPOINT = `${Constants.BACKEND_URL}/api/simple_git/collaborator`;

  constructor(private http: Http) { }

  fetchReposCollaborators(repos: Repository[]): Observable<Repository[]> {
    return Observable.forkJoin(repos.map(
      repo => repo.canAdmin ? this.fetchRepoCollaborators(repo) : Observable.of(repo))
    );
  }

  fetchRepoCollaborators(repo: Repository): Observable<Repository> {
    return this.http.get(`${this.COLLABORATORS_ENDPOINT}/${repo.accountId}/${repo.username}/${repo.name}/all?_format=json`)
               .map((res: any) => res as Collaborator[])
               .do(collaborators => repo.collaborators = collaborators)
               .map(collaborators => repo);
  }
}