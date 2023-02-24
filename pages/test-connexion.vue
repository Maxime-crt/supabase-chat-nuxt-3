<template>
  <div>test connexion</div>
  <div class="container mx-auto bg-gray-300 p-8 my-8">
    <h1 class="font-bold text-black text-4xl text-center">SupaBase Login</h1>
    <Account v-if="user" />
    <Auth v-else />
  </div>
</template>

<script setup>
const user = useUser();
user.value = useSupabaseUser();
</script>
