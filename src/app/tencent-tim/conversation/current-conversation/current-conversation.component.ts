import {
  AfterViewInit,
  Component,
  ElementRef,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { Conversation, ConversationItem } from '../../im.type';
import { conversationSelector, currentConversationSelector } from '../../store/selectors';
import { TimHelperService } from '../../tim-helper.service';

@Component({
  selector: 'app-current-conversation',
  templateUrl: './current-conversation.component.html',
  styleUrls: ['./current-conversation.component.less']
})
export class CurrentConversationComponent implements OnInit, AfterViewInit, OnDestroy {
  currentConversation: Conversation;
  currentMessageList = [];
  isShowScrollBottomTips = false;
  isCompleted = false;
  preScrollHeight = 0;
  name: string;
  toAccount: string;
  showConversationProfile = false;

  eventBusSubscription: Subscription;
  conversationSubscription: Subscription;
  currentConversationSubscription: Subscription;

  get showCurrentConversation() {
    return !!this.currentConversation?.conversationID;
  }

  get showMessageSendBox() {
    return (this.currentConversation.type !== TIM.TYPES.CONV_SYSTEM);
  }

  @ViewChild('messageList', { static: false }) messageListRef: ElementRef;

  constructor(
    private store: Store,
    private timHelperService: TimHelperService,
  ) { }

  ngOnInit(): void {
    // 获取当前会话
    this.currentConversationSubscription = this.store.select(currentConversationSelector).subscribe(res => {
      this.currentConversation = res;
      this.preScrollHeight = 0;
      if (!res || !res.conversationID) {
        this.toAccount = '';
      }
      switch (res.type) {
        case 'C2C':
          this.toAccount = res.conversationID.replace('C2C', '');
          break;
        case 'GROUP':
          this.toAccount = res.conversationID.replace('GROUP', '');
          break;
        default:
          this.toAccount = res.conversationID;
      }
      this.getName();
    });

    this.conversationSubscription = this.store.select(conversationSelector)
      .subscribe(res => {
        this.currentMessageList = res.currentMessageList;
        this.isCompleted = res.isCompleted;
        if (res.currentMessageList && res.currentMessageList.length > 0) {
          if (this.currentConversation.conversationID) {
            this.keepMessageListOnBottom();
            this.timHelperService.tim.setMessageRead({ conversationID: this.currentConversation.conversationID });
          }
        }

        if (this.currentConversation.conversationID === '@TIM#SYSTEM' || typeof this.currentConversation.conversationID === 'undefined') {
          this.showConversationProfile = false;
        }

      }, err => {
        console.log('获取当前会话err', err);
      });

    this.eventBusSubscription = this.timHelperService.eventBus$
      .subscribe((res: string) => {
        if (res === 'scroll-bottom') {
          this.scrollMessageListToBottom();
        }
      });
  };

  ngAfterViewInit(): void {
    this.keepMessageListOnBottom();


  }

  showMore() {
    this.showConversationProfile = !this.showConversationProfile;
  }

  getMore() {
    this.timHelperService.getMessageList(this.currentConversation.conversationID);
  }

  onscroll({ target: { scrollTop } }) {
    let messageListNode = this.messageListRef?.nativeElement;

    if (!messageListNode) {
      return;
    }
    if (this.preScrollHeight - messageListNode.clientHeight - scrollTop < 20) {
      this.isShowScrollBottomTips = false;
    }
  }

  scrollMessageListToBottom() {
    let messageListNode = this.messageListRef?.nativeElement;
    if (!messageListNode) {
      return;
    }

    setTimeout(() => {
      messageListNode.scrollTop = messageListNode.scrollHeight;
      this.preScrollHeight = messageListNode.scrollHeight;
      this.isShowScrollBottomTips = false;
    }, 0);

  }

  // 如果滚到底部就保持在底部，否则提示是否要滚到底部
  keepMessageListOnBottom() {
    let messageListNode = this.messageListRef?.nativeElement;
    if (!messageListNode) {
      return;
    }

    setTimeout(() => {
      // 距离底部20px内强制滚到底部,否则提示有新消息
      if (this.preScrollHeight - messageListNode.clientHeight - messageListNode.scrollTop < 20) {
        messageListNode.scrollTop = messageListNode.scrollHeight;
        this.isShowScrollBottomTips = false;
      } else {
        this.isShowScrollBottomTips = true;
      }
      this.preScrollHeight = messageListNode.scrollHeight;
    }, 0);

  }

  ngOnDestroy(): void {
    [
      this.eventBusSubscription,
      this.conversationSubscription,
      this.currentConversationSubscription
    ].forEach(item => {
      if (item) {
        item.unsubscribe();
      }
    });
  }

  private getName() {
    if (this.currentConversation?.type === 'C2C') {
      this.name = this.currentConversation.userProfile.nick || this.toAccount;
    } else if (this.currentConversation?.type === 'GROUP') {
      this.name = this.currentConversation.groupProfile.name || this.toAccount;
    } else if (this.currentConversation?.conversationID === '@TIM#SYSTEM') {
      this.name = '系统通知';
    }
  }


}
