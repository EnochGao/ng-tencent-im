import { Component, OnInit } from '@angular/core';
import { TimHelperService } from '../../tim-helper.service';

import { Store } from '@ngrx/store';

import { ConversationItem } from '../../im.type';
import { getSelectConversationStates } from '../../store/selectors';
import { showAction } from '../../store/actions';


@Component({
  selector: 'app-conversation-list',
  templateUrl: './conversation-list.component.html',
  styleUrls: ['./conversation-list.component.less']
})
export class ConversationListComponent implements OnInit {
  conversationList: Array<ConversationItem> = [];
  timeout = null;
  showDialog = false;
  userID = '';
  constructor(
    private store: Store,
    private timHelperService: TimHelperService
  ) { }

  ngOnInit(): void {

    // 获取当前会话
    this.store.select(getSelectConversationStates).subscribe(res => {
      console.log('%c getSelectConversationStates::', 'color:red;font-size:20px', res);

      this.conversationList = res.conversationList;
    });

  };

  add() {
    this.showDialog = true;
  }

  handleOk(): void {
    if (this.userID !== '@TIM#SYSTEM') {
      this.timHelperService.checkoutConversation(`C2C${this.userID}`);
      this.showDialog = false;
    }
    this.userID = '';
  }

  handleCancel(): void {
    this.showDialog = false;
  }

  refresh() {
    // if (!this.timeout) {
    //   this.timeout = setTimeout(() => {
    //     this.timeout = null;

    //   }, 1000);
    // }

    // 拉取会话列表
    this.timHelperService.tim.getConversationList().then(({ data }) => {
      console.log('刷新成功', data);
      this.store.dispatch(showAction({ msgType: 'success', message: '刷新成功！' }));

    }).catch((imError) => {
      console.error('getConversationList error:', imError); // 获取会话列表失败的相关信息
    });




  }

}
