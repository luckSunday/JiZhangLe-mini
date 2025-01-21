import type { App } from 'vue';
import { createPinia } from 'pinia';

const store = createPinia();

export function setupStore(app: App<Element>) {
  app.use(store);
}

export { store };

export * from './modules/app';
export * from './modules/user';
export * from './modules/detail';
export * from './modules/public';
export * from './modules/home';
export * from './modules/short';
