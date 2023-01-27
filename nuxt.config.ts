// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  components: true,
  modules: ["@nuxtjs/supabase", "@nuxtjs/tailwindcss", "@pinia/nuxt"],
  css: ["@/assets/css/tailwind.css"],
  build: {
    transpile: ["@vuepic/vue-datepicker"],
  },
  
  pinia: {
    autoImports: ['defineStore', 'acceptHMRUpdate'],
  },
});
