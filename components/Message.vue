<template>
  <!-- Other -->
  <div v-if="!personal" class="flex w-full mt-2 space-x-3 max-w-xs">
    <!-- Profile Picture -->
    <div class="flex-shrink-0 w-12 h-12 overflow-hidden">
      <ProfileImage v-model:path="avatar" />
    </div>
    <!-- Message -->
    <div>
      <span class="font-bold text-sm">{{ user }}</span>
      <div
        class="bg-blue-600 text-white p-3 rounded-r-lg rounded-bl-lg sm:max-w-sm"
        style="max-width: 16rem"
      >
        <p class="text-sm break-words">{{ text }}</p>
      </div>
      <span class="text-xs text-gray-500 leading-none">{{ messageHour }}</span>
    </div>
  </div>
  <!-- Current -->
  <div v-else class="flex w-full mt-4 space-x-3 max-w-xs ml-auto justify-end">
    <div>
      <div
        class="bg-emerald-600 text-white p-3 rounded-l-lg rounded-br-lg sm:max-w-sm"
        style="max-width: 16rem"
      >
        <p class="text-sm break-words">{{ text }}</p>
      </div>
      <span class="flex text-xs text-gray-500 leading-none justify-end mt-2">{{
        messageHour
      }}</span>
    </div>
    <!-- Profile Picture -->
    <div class="flex-shrink-0 w-12 h-12 overflow-hidden">
      <ProfileImage v-model:path="avatar" />
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  username: String,
  receiver_id: String,
  personal: Boolean,
  timestamp: String,
  text: String,
});

const user = ref(null);
const avatar = ref(null);
const supabase = useSupabaseClient();

// Récupérer le username de chaque utilisateurs
onMounted(async () => {
  await supabase
    .from("profiles")
    .select("username, avatar_url")
    .eq("id", props.username)
    .single()
    .then(({ data, error }) => {
      user.value = data.username ? data.username : props.username;
      avatar.value = data.avatar_url ? data.avatar_url : "";
    });
});

// le format de l'heure
const messageHour = computed(() => {
  const now = new Date();
  const timestampDate = new Date(props.timestamp);
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
