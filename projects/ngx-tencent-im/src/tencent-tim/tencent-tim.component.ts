import { ChangeDetectionStrategy, Input } from '@angular/core';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs';
import { getMessage } from '../store/selectors';

@Component({
  selector: 'ngx-tencent-tim',
  templateUrl: './tencent-tim.component.html',
  styleUrls: ['./tencent-tim.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TencentTimComponent implements OnInit, OnDestroy {

  @Input() hiddenWindow = false;

  @Output() message = new EventEmitter<any>();
  @Output() hiddenWindowChange = new EventEmitter<boolean>();

  showDetail = false;
  subscription: Subscription;

  constructor(
    private store: Store
  ) { }

  ngOnInit(): void {
    this.subscription = this.store.select(getMessage)
      .subscribe((res: { type: string, message: string; }) => {
        this.message.emit(res);
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
