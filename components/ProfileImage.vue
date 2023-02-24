<script setup>
let supabase = useSupabaseClient()
const prop = defineProps(['path', 'size'])
const { path, size } = toRefs(prop)
const src = ref('')
const downloadImage = async () => {
    const { data, error } = await supabase.storage.from('avatars').download(path.value)
    if (error) {
        console.log('Error downloading image: ', error.message)
    } else {
        src.value = URL.createObjectURL(data)
    }
}
watch(path, () => {
  if (path.value) downloadImage()
})
</script>

<template>
  <div>
    <img
        v-if="src"
        :src="src"
        alt="Avatar"
        class=""
        style="margin-top: 2px; border-radius: 100px;"
    />
    <div v-else class="flex-shrink-0 h-10 w-10 rounded-full bg-blue-300" />

  </div>
</template>
