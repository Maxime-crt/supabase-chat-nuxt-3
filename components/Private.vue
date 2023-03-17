<template>
  <div>
    <button
      class="container flex items-center bg-slate-100 p-2"
      :class="{ 'hover:bg-slate-200': !hovering }"
      @click="handleClick($event)"
      @mouseover="hovering = true"
      @mouseleave="hovering = false"
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
        {{ messageHour }}
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
        /* console.log(data); */
        if (data[0].user_id === props.personal_id) {
          lastMessage.value = "Vous : " + data[0].text;
        } else {
          lastMessage.value = data[0].text;
        }

        dateLastMessage.value = new Date(data[0].timestamp);
      });
  } catch (error) {
    console.log(error);
  }
});

// le format de l'heure
const messageHour = computed(() => {
  const now = new Date();
  const timestampDate = new Date(dateLastMessage.value);
  const isToday = now.toDateString() === timestampDate.toDateString();
  const isYesterday =
    new Date(now - 86400000).toDateString() === timestampDate.toDateString(); // 86400000 = 24 * 60 * 60 * 1000 (milliseconds in a day)

  if (isToday) {
    // aujourd'hui
    return `Aujourd'hui à ${timestampDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })}`;
  } else if (isYesterday) {
    // hier
    return `Hier à ${timestampDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })}`;
  } else {
    // plus de 2 jours
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour12: false,
    };
    return `${timestampDate.toLocaleDateString(
      [],
      options
    )} à ${timestampDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })}`;
  }
});
</script>
