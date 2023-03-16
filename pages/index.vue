<template>
  <div>
    <div class="container mx-auto bg-gray-300 p-8 my-8">
      <h1 class="font-bold text-black text-4xl text-center">SupaBase Login</h1>
      <Account v-if="user" />
      <Auth v-else />
    </div>

    

    

    <!-- The button to open modal -->
    <label for="my-modal-4" class="btn">Messagerie</label>

    <!-- Put this part before </body> tag -->
    <input type="checkbox" id="my-modal-4" class="modal-toggle" />
    <label for="my-modal-4" class="modal cursor-pointer">
      <label
        class="modal-box absolute h-full right-2 sm:right-10 scrollbar scrollbar-thumb-rounded-full scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-corner-rounded-full"
        for=""
      >
        <Chat />
      </label>
    </label>

    <!-- Button Scroll to bottom of the page and appear only when the scrollbar is not on the bottom of the page -->
    <div
      class="fixed bottom-4 right-4 bg-gray-100 rounded-full shadow cursor-pointer"
      @click="scrollToBottom()"
      v-if="!isHidden"
    >
      <div class="bg-white rounded-full p-2 shadow">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-gray-700"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M15.293 8.293a1 1 0 00-1.414-1.414L10 11.586 5.707 7.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l5-5z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
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
  title: "Supabase Chat",
  meta: [
    {
      name: "google-site-verification",
      content: "1MolawBMrGYEVTKzy2yIsW9UQAKG9yTyJ8a0-XdzP58",
    },
  ],
});

// Button Scroll to bottom of the page appear when the user is not on the bottom of the page
const isHidden = ref(false);

function scrollToBottom() {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
}

onMounted(() => {
  window.addEventListener("scroll", () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    isHidden.value = scrollTop + clientHeight >= scrollHeight - 10;
  });
});
</script>
