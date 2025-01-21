import buttonService from 'kt-page/components/button-service.vue';
import KtButton from 'ui/kt-button/kt-button.vue';
import KtIcon from 'ui/kt-icon/kt-icon.vue';
import KtLayout from 'ui/kt-layout/kt-layout.vue';
import KtHeader from 'ui/kt-header/kt-header.vue';
import KtFooter from 'ui/kt-footer/kt-footer.vue';
import KtLoading from 'ui/kt-loading/kt-loading.vue';
import KtTabs from 'ui/kt-tabs/kt-tabs.vue';
import KtTouchShow from 'ui/kt-touch-show/kt-touch-show.vue';
import KtAuthUserinfo from 'ui/kt-auth-userinfo/kt-auth-userinfo.vue';
import KtSearchBar from 'ui/kt-search-bar/kt-search-bar.vue';
import KtPaging from 'ui/kt-paging/kt-paging.vue';
import KtListFooter from 'ui/kt-list-footer/kt-list-footer.vue';
import KtUploadImage from 'ui/kt-upload-image/kt-upload-image.vue';
import KtUploadVideo from 'ui/kt-upload-video/kt-upload-video.vue';
import KtVideoPlayer from 'ui/kt-video-player/kt-video-player.vue';
import KtCanvas from 'ui/kt-canvas/kt-canvas.vue';
import KtDialogBase from 'ui/kt-dialog-base/kt-dialog-base.vue';

declare module 'vue' {
  interface GlobalComponents {
    buttonService: typeof buttonService;
    KtButton: typeof KtButton;
    KtIcon: typeof KtIcon;
    KtLayout: typeof KtLayout;
    KtHeader: typeof KtHeader;
    KtFooter: typeof KtFooter;
    KtLoading: typeof KtLoading;
    KtTabs: typeof KtTabs;
    KtTouchShow: typeof KtTouchShow;
    KtAuthUserinfo: typeof KtAuthUserinfo;
    KtSearchBar: typeof KtSearchBar;
    KtPaging: typeof KtPaging;
    KtListFooter: typeof KtListFooter;
    KtUploadImage: typeof KtUploadImage;
    KtUploadVideo: typeof KtUploadVideo;
    KtVideoPlayer: typeof KtVideoPlayer;
    KtCanvas: typeof KtCanvas;
    KtDialogBase: typeof KtDialogBase;
  }
}
