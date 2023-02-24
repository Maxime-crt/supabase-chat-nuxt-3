<script setup>
let supabase = useSupabaseClient()
const prop = defineProps(['path'])
const { path } = toRefs(prop)
const src = ref('')
const downloadImage = async () => {
    if (!path.value) return
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
    <img v-else src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" class="h-full w-full object-cover rounded-full" alt="Default avatar">

  </div>
</template>
