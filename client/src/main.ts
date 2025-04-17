import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { setupI18n, t } from './i18n';
import './styles/main.css';

// i18n 초기화
setupI18n();

const app = createApp(App);
app.use(router);

// 글로벌 속성으로 $t 함수 추가
app.config.globalProperties.$t = t;

// TypeScript에서 $t 타입 지정
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $t: typeof t;
  }
}

app.mount('#app');
