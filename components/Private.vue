<template>
  <div>
    <button class="bg-gray-300 rounded-full p-2" @click="handleClick()">
      <div class="flex content-center align-center gap-2">
        <ProfileImage v-model:path="avatar" />
        <span class="grid font-bold text-sm content-center"> {{ user }} </span>
      </div>
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  username: String,
  personal_id: String,
});

const user = ref(null);
const avatar = ref(null);
const supabase = useSupabaseClient();
const receiver_id = useReceiver_id();

// Le receiver_id est celui de l'utilisateur avec qui on veut discuter
async function handleClick() {
  receiver_id.value = props.username;
  /* console.log(user.value);
  console.log("My id : " + props.personal_id);
  console.log("Receiver id : " + receiver_id.value); */
}

// Récupérer le username de chaque utilisateurs
onMounted(async () => {
  try {
    await supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", props.username)
      .single()
      .then(({ data, error }) => {
        user.value = data.username ? data.username : props.username;
        avatar.value = data.avatar_url ? data.avatar_url : "";
      });
  } catch (error) {
    console.log(error);
  }
});
</script>
