import * as path from 'node:path';
import { defineConfig } from 'rspress/config';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  title: 'Juwenzhang‘ Android-Study',
  icon: '/rspress-icon.png',
  logo: {
    light: '/rspress-light-logo.png',
    dark: '/rspress-dark-logo.png',
  },
  themeConfig: {
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/juwenzhang',
      },
      {
        icon: 'juejin',
        mode: 'link',
        content: 'https://juejin.cn/user/3877322821505440',
      },
    ],
  },
  // 显示指定部署使用的 cdn 链接
  builderConfig: {
    output: {
      // assetPrefix: 'https://juwenzhang.github.io',
    }
  },
  // 指定需要进行部署的子路径
  base: '/android-study/',
});
