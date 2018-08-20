import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/index';
import {LoaderService} from './loader.service';
import {Loader} from './loader';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit, OnDestroy {
  show = false;
  private subscription: Subscription;

  constructor(private loaderService: LoaderService) { }

  ngOnInit() {
    this.subscription = this.loaderService.loaderState.subscribe(
      (state: Loader) => {
        this.show = state.show;
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
