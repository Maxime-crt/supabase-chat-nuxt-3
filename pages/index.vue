<template>
  <div>
    <div class="container mx-auto bg-gray-300 p-8 my-8">
      <h1 class="font-bold text-black text-4xl text-center">SupaBase Login</h1>
      <Account v-if="user" />
      <Auth v-else />
    </div>

    <div class="container mx-auto bg-gray-300 p-8 my-8">
      <h1 class="font-bold text-black text-4xl text-center">Supabase Chat</h1>
      <router-link to="/chat">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Chat page
        </button>
      </router-link>
    </div>
    <div class="container mx-auto bg-gray-300 p-8 my-8">
      <h1 class="font-bold text-black text-4xl text-center">Scroll page</h1>
      <router-link to="/scroll">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          scroll page
        </button>
      </router-link>
    </div>
    <div class="container mx-auto bg-gray-300 p-8 my-8">
      <h1 class="font-bold text-black text-4xl text-center">Vueuse</h1>
      <router-link to="/vueuse">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          VueUse
        </button>
      </router-link>
    </div>


  </div>
</template>

<script setup>
const user = useUser();
user.value = useSupabaseUser();
/* console.log(user.value); */

useHead({
  title: 'Supabase Chat',
  meta: [
    {
      name: 'google-site-verification',
      content: '1MolawBMrGYEVTKzy2yIsW9UQAKG9yTyJ8a0-XdzP58',
    },
  ],
});
</script>
