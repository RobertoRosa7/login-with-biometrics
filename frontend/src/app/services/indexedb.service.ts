import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IndexdbService {
  constructor(private indexdb: NgxIndexedDBService) {}

  public create(data: any): Observable<any> {
    return from(this.indexdb.add('biometrics', data));
  }

  public update(data: any): Observable<any> {
    return from(this.indexdb.update('biometrics', data));
  }

  public delete(id: string): Observable<any> {
    return from(this.indexdb.delete('biometrics', id));
  }

  public clearStore(): Observable<any> {
    return from(this.indexdb.clear('biometrics'));
  }

  public getById(id: string): Observable<any> {
    return from(this.indexdb.getByID('biometrics', id));
  }

  public getAll(): Observable<any> {
    return from(this.indexdb.getAll('biometrics'));
  }

  public getByIndex(index: number): Observable<any> {
    return from(this.indexdb.getByIndex('biometrics', 'issue', index));
  }

  public count(): Observable<any> {
    return from(this.indexdb.count('biometrics'));
  }
}
