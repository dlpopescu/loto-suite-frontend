import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import '../root.css';

const app = createApp(App);
app.use(createPinia());

router.afterEach((to) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title;
  } else {
    document.title = 'Loto Vue';
  }
});

app.use(router);
app.mount('#app');