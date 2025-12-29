import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from './LoginPage.vue';
import TicketPage from './TicketPage.vue';

const routes = [
  { 
    path: '/', 
    meta: { title: 'Login - Loto Vue' }, 
    name: 'login', 
    component: LoginPage 
},
  { 
    path: '/ticket', 
    name: 'ticket', 
    meta: { title: 'Verificare bilet - Loto Vue' }, 
    component: TicketPage 
},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
