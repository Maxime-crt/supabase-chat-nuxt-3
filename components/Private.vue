<template>
  <div>
    <button class="bg-gray-100 rounded-lg p-1" @click="handleClick()">
      <ProfileImage v-model:path="avatar" />
      <div class="flex content-center align-center gap-2">
        <span class="grid font-bold text-sm content-center"> {{ user }} </span>

        <span class="grid italic text-sm content-center">
          {{ lastMessage }}
        </span>
        
        <span class="grid text-xs content-center">
          {{ dateLastMessage }}
        </span>

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
const lastMessage = ref("");
const dateLastMessage = ref(null);

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

// Récupère le dernier message de la conversation entre l'utilisateur courant et l'utilisateur avec qui on veut discuter
onMounted(async () => {
  try {
    await supabase
      .from("messages")
      .select("text, timestamp, user_id, receiver_id")
      .eq("user_id", props.personal_id)
      .eq("receiver_id", props.username)
      .order("timestamp", { ascending: false })
      .limit(1)
      .then(({ data, error }) => {
        console.log(data);
        if (data[0].user_id === props.personal_id) {
          lastMessage.value = "Vous : " + data[0].text;
        } else {
          lastMessage.value = data[0].text;
        }

        dateLastMessage.value = new Date(data[0].timestamp).toLocaleString();

      });
  } catch (error) {
    console.log(error);
  }
});



</script>
