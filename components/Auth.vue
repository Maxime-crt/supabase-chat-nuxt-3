<template>
  <form class="row flex-center flex" @submit.prevent="handleLogin">
    <div class="col-6 form-widget">
      <h1 class="header">Supabase + Nuxt 3</h1>
      <p class="description">Sign in via magic link with your email below</p>
      <div>
        <input
          class="inputField"
          type="email"
          placeholder="Your email"
          v-model="email"
        />
      </div>
      <div>
        <input
          type="submit"
          class="button block"
          :value="loading ? 'Loading' : 'Send magic link'"
          :disabled="loading"
        />
      </div>
    </div>
  </form>
</template>

<script setup>
const supabase = useSupabaseClient();

const loading = ref(false);
const email = ref("");
const handleLogin = async () => {
  try {
    loading.value = true;
    const { data: response, error } = await supabase.auth.signInWithOtp({ email: email.value });
    if (response) {
      const accessToken = useCookie("sb-access-token");
      const refreshToken = useCookie("sb-refresh-token");
      accessToken.value = response.session?.access_token ?? null;
      refreshToken.value = response.session?.refresh_token ?? null;
    }
    /* if (!!error) {
      errorMsg.value = error.message;
    } */
    if (error) throw error;
    alert("Check your email for the login link!");
  } catch (error) {
    alert(error.error_description || error.message);
  } finally {
    loading.value = false;
  }
};
</script>
