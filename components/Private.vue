<template>
  <button class="bg-gray-300" @click="handleClick">
    <div v-if="!avatar_url" class="flex-shrink-0 h-10 w-10 rounded-full">
      <ProfileImage v-model:path="avatar" />
    </div>
    <div v-else class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300" />
    <span class="font-bold text-sm"> {{ props.username }} </span>
  </button>
  
  
</template>

<script setup>
const props = defineProps({
  username: String,
  personal_id: String,
});

const user = ref(null);
const avatar = ref(null);

const supabase = useSupabaseClient();

/*  const user = useUser(); */

const chat = useChatStore();

const input = ref("");
const userID = ref(null);

const messages = ref([]);
const messagesCount = ref(0);
const maxMessagesPerRequest = 50;

const scrollContainer = ref(null);

const receiver_id = useReceiver_id();

const handleClick = () => {
  console.log( user.value );
  console.log("My id : " + props.personal_id);

  receiver_id.value = props.username;
  /* console.log("Receiver id : " + receiver_id.value); */
};

/* console.log(user); */

onMounted(async () => {
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
});

const loadMessagesBatch = async () => {
  const loadedMessages = await chat.getMessagesById(props.username);

  messagesCount.value, maxMessagesPerRequest - 1;

  messages.value = [...loadedMessages, ...messages.value];
  messagesCount.value += loadedMessages.length;
};

onMounted(() => {
  nextTick(() => {
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
  });
});


await loadMessagesBatch();
await chat.onNewMessage((newMessage) => {
  messages.value = [newMessage, ...messages.value];
  messagesCount.value += 1;
  nextTick(() => {
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
  });
});


</script>
