// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  components: true,
  modules: ["@nuxtjs/supabase", "@nuxtjs/tailwindcss", "@pinia/nuxt", "~/modules/sitemap"],
  css: ["@/assets/css/tailwind.css"],
  build: {
    transpile: ["@vuepic/vue-datepicker"],
  },
  
  pinia: {
    autoImports: ['defineStore', 'acceptHMRUpdate'],
  },
  sitemap: {
    hostname: 'https://timely-salmiakki-c93425.netlify.app/',
  },

});
