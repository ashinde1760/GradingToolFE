import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service'
import {Observable} from "rxjs";
import {select, Store} from "@ngrx/store";
import {AppState} from "../../store";
import {isLoggedIn,userFirstName,userRole} from '../../store/selectors/auth.selectors'
import {LogoutStart} from "../../store/actions/auth.actions";
import {FetchProjectsStart} from "../../store/actions/project.actions";
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  role$:Observable<string>;
  firstName$:Observable<string>;

  constructor(public authService: AuthService, private store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.isLoggedIn$ = this.store.pipe(select(isLoggedIn));
    this.role$=this.store.pipe(select(userRole));
    this.firstName$=this.store.pipe(select(userFirstName));
  }

  logout() {
    this.store.dispatch(new LogoutStart());
  }
}
