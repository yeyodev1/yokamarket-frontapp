<script setup lang="ts">
import { shallowRef } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const email = shallowRef('')
const password = shallowRef('')
const error = shallowRef('')
const loading = shallowRef(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await userStore.login(email.value, password.value)
    router.replace(String(route.query.next || '/admin'))
  } catch (e) {
    error.value = (e as { message?: string }).message || 'No pudimos iniciar sesión'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login">
    <form class="login__card" @submit.prevent="submit">
      <img src="/wordmark.png" alt="YOKA Market" width="160" height="56" />
      <h1>Panel de pedidos</h1>
      <div class="field">
        <label for="email">Correo</label>
        <input id="email" v-model="email" type="email" autocomplete="username" required />
      </div>
      <div class="field">
        <label for="password">Contraseña</label>
        <input id="password" v-model="password" type="password" autocomplete="current-password" required />
      </div>
      <p v-if="error" class="login__error">{{ error }}</p>
      <button type="submit" class="btn btn--primary btn--block" :disabled="loading">{{ loading ? 'Ingresando…' : 'Ingresar' }}</button>
      <RouterLink to="/" class="login__back">← Volver a la tienda</RouterLink>
    </form>
  </div>
</template>

<style scoped lang="scss">
.login {
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 20px;
  background: radial-gradient(60% 50% at 50% 0%, rgba($yellow, 0.25), transparent 70%), $cream;
  &__card {
    width: min(400px, 100%);
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 32px;
    border-radius: $radius-lg;
    background: $white;
    box-shadow: $shadow;
    img {
      height: 40px;
      width: auto;
    }
    h1 {
      font-size: 22px;
      margin-bottom: 6px;
    }
  }
  &__error {
    color: $red;
    font-size: 14px;
    font-weight: 500;
  }
  &__back {
    text-align: center;
    font-size: 13px;
    color: $muted;
  }
}
</style>
