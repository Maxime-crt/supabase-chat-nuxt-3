<template>
  <button class="bg-gray-300" @click="handleClick()">
    <div v-if="!avatar_url" class="flex-shrink-0 h-10 w-10 rounded-full">
      <ProfileImage v-model:path="avatar" />
    </div>
    <div v-else class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300" />
    <span class="font-bold text-sm"> {{ props.username }} </span>
  </button>

  <Message
    v-for="message in messages.slice().reverse()"
    :key="message.id"
    :username="message.user_id"
    :receiver_id="message.receiver_id"
    :personal="message.user_id === userID"
    :timestamp="message.timestamp"
    :text="message.text"
  />
</template>

<script setup>
const props = defineProps({
  username: String,
  personal_id: String,
});

const user = ref(null);
const avatar = ref(null);
const supabase = useSupabaseClient();
const chat = useChatStore();
const userID = ref(null);
const messages = ref([]);
const messagesCount = ref(0);
const maxMessagesPerRequest = 50;
const scrollContainer = ref(null);
const receiver_id = useReceiver_id();

async function handleClick() {
  console.log(user.value);
  console.log("My id : " + props.personal_id);
  receiver_id.value = props.username;
  console.log("Receiver id : " + receiver_id.value);

  if (receiver_id.value) {
    messages.value = await chat.getMessagesById(
      userID.value,
      receiver_id.value,
      messagesCount.value,
      maxMessagesPerRequest
    );
    messagesCount.value += messages.value.length;
    const loadMessagesBatch = async () => {
      const loadedMessages = await chat.getMessagesById(
        userID.value,
        receiver_id.value,
        messagesCount.value,
        maxMessagesPerRequest
      );

      messagesCount.value, maxMessagesPerRequest - 1;

      messages.value = [...loadedMessages, ...messages.value];
      messagesCount.value += loadedMessages.length;
    };

    await loadMessagesBatch();
    await chat.onNewMessage((newMessage) => {
      messages.value = [newMessage, ...messages.value];
      messagesCount.value += 1;
      nextTick(() => {
        scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
      });
    });
  }
}

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

onMounted(() => {
  nextTick(() => {
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
  });
});
</script>
