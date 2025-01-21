import { resolve } from 'path';
import type { Plugin } from 'vite';
import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import vwt from 'weapp-tailwindcss-webpack-plugin/vite';
import postcssWeappTailwindcssRename from 'weapp-tailwindcss-webpack-plugin/postcss';
import copyPlugin from 'rollup-plugin-copy';
function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}

// 注意： 打包成 h5 和 app 都不需要开启插件配置
const isH5 = process.env.UNI_PLATFORM === 'h5';
const isApp = process.env.UNI_PLATFORM === 'app';
const WeappTailwindcssDisabled = isH5 || isApp;

// vite 插件配置
const vitePlugins = [uni() as unknown as Plugin];
// postcss 插件配置
const postcssPlugins = [require('autoprefixer')(), require('tailwindcss')()];
if (!WeappTailwindcssDisabled) {
  vitePlugins.push(vwt()!);

  postcssPlugins.push(
    require('postcss-rem-to-responsive-pixel')({
      rootValue: 32,
      propList: ['*'],
      transformUnit: 'rpx',
    }),
  );
  postcssPlugins.push(postcssWeappTailwindcssRename({}));
}
if (process.env.NODE_ENV !== 'production') {
  vitePlugins.push(
    copyPlugin({
      targets: [
        {
          src: './ext.json',
          dest: `dist/${process.env.NODE_ENV === 'production' ? 'build' : 'dev'}/${
            process.env.UNI_PLATFORM
          }`,
        },
      ], // 将文件复制到 dist/healthcheck, vite会自动复制到dist目录
    }),
  );
}

const copyPublicDir = !!isApp;

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    copyPublicDir,
  },
  resolve: {
    alias: [
      {
        find: /\/@\//,
        replacement: `${pathResolve('src')}/`,
      },
      {
        find: 'static',
        replacement: pathResolve('src/static'),
      },
    ],
  },
  publicDir: 'public',
  plugins: vitePlugins,
  css: {
    postcss: {
      plugins: postcssPlugins,
    },
  },
});
