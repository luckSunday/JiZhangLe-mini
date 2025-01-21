declare type PlatformType = 'kt' | 'kskt' | 'wxkt';
declare type PlatformNames = 'h5' | 'mp-toutiao' | 'mp-kuaishou' | 'mp-weixin' | 'app';

declare const tt: Uni & {
  getCustomButtonBoundingClientRect(): {
    capsule: UniNamespace.GetMenuButtonBoundingClientRectRes;
    leftIcon?: UniNamespace.GetMenuButtonBoundingClientRectRes;
  };
  getAppLogManager(): {
    debug: (info: string) => void;
    error: (info: string) => void;
    info: (info: string) => void;
    warn: (info: string) => void;
  };
};

declare const ks: Uni;
declare const wx: Uni;
