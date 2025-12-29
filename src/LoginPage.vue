<template>
  <div class="login-container">
    <form @submit.prevent="login">
      <div>
        <label for="username">Username</label>
        <input id="username" v-model="username" required />
      </div>
      <div>
        <label for="password">Password</label>
        <input id="password" type="password" v-model="password" required />
      </div>
      <button type="submit" :disabled="loading">Login</button>
      <div v-if="error" class="error">{{ error }}</div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Login } from './api/client.js';
import { useLotoStore } from './stores/loto_store.js';

const username = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');
const router = useRouter();
const lotoStore = useLotoStore();

async function login() {
  loading.value = true;
  error.value = '';
  try {
    const response = await Login(username.value, password.value);
    if (!response.ok) throw new Error('Login failed');

    await lotoStore.fetchGames();
    await lotoStore.fetchDates(30);
    router.replace({ name: 'ticket' });
  } catch (e) {
    error.value = e.message || 'Login failed';
  } finally {
    loading.value = false;
  }
}

</script>

<style scoped>
.login-container {
  max-width: 350px;
  margin: 60px auto;
  padding: 2rem;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
label {
  display: block;
  margin-bottom: 0.2rem;
}
input {
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}
button {
  width: 100%;
  padding: 0.7rem;
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
}
.error {
  color: #d32f2f;
  margin-top: 1rem;
}
</style>
