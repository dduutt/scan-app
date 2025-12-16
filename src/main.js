import { createApp } from "vue";
import App from "./App.vue";
import router from './router';
import { createPinia } from 'pinia';

import 'vant/es/toast/style';
import 'vant/es/dialog/style';
const pinia = createPinia();

createApp(App).use(router).use(pinia).mount("#app");
