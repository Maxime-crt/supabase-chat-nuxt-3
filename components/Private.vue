<template>
  <div>
    <button class="bg-gray-300" @click="handleClick()">
      <div v-if="!avatar_url" class="flex-shrink-0 h-10 w-10 rounded-full">
        <ProfileImage v-model:path="avatar" />
      </div>
      <div v-else class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300" />
      <span class="font-bold text-sm"> {{ user }} </span>
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
        avatar.value = data.avatar_url
          ? data.avatar_url
          : `https://avatars.dicebear.com/api/bottts/${props.username}.svg`;
      });
  } catch (error) {
    console.log(error);
  }
});

// Récupérer le username de l'utilisateur connecté
onMounted(async () => {
  try {
    await supabase
      .from("profiles")
      .select("username")
      .single()
      
      .then(({ data, error }) => {
        user.value = data.username ? data.username : props.username;
      });
  } catch (error) {
    console.log(error);
  }
});
</script>
