<template>
  <div>
    <button
      class="container flex items-center bg-slate-100 hover:bg-slate-200 p-2"
      @click="handleClick($event)"
      id="user"
    >
      <div class="flex-shrink-0 mr-2">
        <ProfileImage v-model:path="avatar" />
      </div>
      <div class="flex-grow w-80">
        <div class="font-bold text-sm text-left">{{ user }}</div>
        <div class="text-sm text-left overflow-hidden">
          <span :class="{ 'text-stroke': lastMessage.length > 20 }">{{
            lastMessage.length > 20
              ? lastMessage.slice(0, 20) + "..."
              : lastMessage
          }}</span>
        </div>
      </div>
      <div class="flex-shrink-0 w-20 text-xs text-gray-500">
        {{ dateLastMessage }}
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

// Le receiver_id est celui de l'utilisateur avec qui on veut discuter avec prevent default
const handleClick = (e) => {
  e.preventDefault();
  receiver_id.value = props.username;
};

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
