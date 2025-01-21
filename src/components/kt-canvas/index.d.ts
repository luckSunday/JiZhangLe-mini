export interface BaseStep {
  /** 需要绘制的内容，以下是特殊内容：
   * 用户昵称(text): `{{nickname}}`
   * 用户头像(image): `{{avatar}}`
   * 产品二维码(image): `{{qrcode}}`
   */
  context: string;
  /** 绘制的X轴起点 */
  x: number;
  /** 绘制的Y轴起点 */
  y: number;
}

export interface ImageStep extends BaseStep {
  type: 'image';
  style: {
    /** 图片宽度 */
    width: number;
    /** 图片高度 */
    height: number;
    /** 是否圆形图片 */
    arc?: boolean;
    /** 以下等价于width|height ,后续已弃用 */
    w?: number;
    h?: number;
  };
}

export interface TextStep extends BaseStep {
  type: 'text';
  style: {
    /** 文本颜色 */
    color?: string;
    /** 文本水平对齐方式，默认left */
    align?: 'left' | 'center' | 'right';
    /** 文本垂直对齐方式，默认middle */
    base?: 'middle' | 'top' | 'bottom';
    /** 文字粗细大小，例如：bold 34px */
    font: string;
    /** 文字描边颜色，部分平台不支持 */
    stroke?: string;
  };
}

export interface LongTextStep extends BaseStep {
  type: 'longtext';
  style: {
    /** 文本颜色 */
    color?: string;
    /** 文本水平对齐方式，默认left */
    align?: 'left' | 'center' | 'right';
    /** 文本垂直对齐方式，默认middle */
    base?: 'middle' | 'top' | 'bottom';
    /** 文字粗细大小，例如：bold 34px */
    font: string;
    /** 宽度，超出此宽度会开始换行 */
    width: number;
    /** 行高，默认 字体大小 * 1.5 */
    lineHeight?: number;
    /** 是否根据内容高度自动增加绘制结果的图片高度 */
    autoHeight?: boolean;
  };
}

export interface PathStep extends BaseStep {
  type: 'path';
  /** 图形路径,
   *  例如在原点绘制 200*100方形:
   *  [[0,0],[200,0],[200,100],[0,100]]
   *  */
  context: string;
  style: {
    /** 填充颜色，支持渐变，一下是渐变示例：
     * [[0,'rgba(0,0,0,0'],[1,'rgba(0,0,0,1)']]
     */
    color: string;
    /** 渐变色方向，两点的连线表示渐变方向和距离，格式：[x1,y1,x2,y2]
     * 默认是图形路径的前两个坐标的连线
     */
    gradient_direction?: string;
    /** 是否填充，默认false 是描边效果 */
    fill?: boolean;
  };
}

export type PosterStepsModel = ImageStep | TextStep | LongTextStep | PathStep;
