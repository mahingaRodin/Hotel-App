import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
// import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzStepsModule } from 'ng-zorro-antd/steps';
// import { NzAffixModule } from 'ng-zorro-antd/affix';
import { NzBackTopModule } from 'ng-zorro-antd/back-top';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMentionModule } from 'ng-zorro-antd/mention';
import { NzAffixModule } from 'ng-zorro-antd/affix';
import { LoginOutline } from '@ant-design/icons-angular/icons';

const icons = [LoginOutline];


@NgModule({
  imports: [NzIconModule.forRoot(icons)],
  exports: [
    CommonModule,
    BrowserAnimationsModule, // Required for animations in NG-ZORRO

    // All NG-ZORRO modules
    NzButtonModule,
    NzIconModule,
    NzGridModule,
    NzTypographyModule,
    NzCardModule,
    NzInputModule,
    NzFormModule,
    NzSelectModule,
    NzDatePickerModule,
    NzTableModule,
    NzModalModule,
    NzNotificationModule,
    NzMessageModule,
    NzCheckboxModule,
    NzSwitchModule,
    NzAlertModule,
    NzSpinModule,
    NzPopoverModule,
    NzToolTipModule,
    NzDropDownModule,
    NzSliderModule,
    NzRadioModule,
    NzPaginationModule,
    NzTreeModule,
    NzUploadModule,
    NzCarouselModule,
    NzTagModule,
    NzTimelineModule,
    NzStepsModule,
    NzAffixModule,
    NzBackTopModule,
    NzBreadCrumbModule,
    NzDrawerModule,
    NzPopconfirmModule,
    NzProgressModule,
    NzResultModule,
    NzLayoutModule,
    NzListModule,
    NzMentionModule,
  ],
})
export class DemoNgZorroAntdModule {}
