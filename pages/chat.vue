<template>
  <div class="relative">
    <div
      class="flex flex-col items-center justify-center w-screen min-h-screen bg-gray-100 text-gray-800 pt-14 md:pt-16"
    >
      <div
        class="flex flex-col flex-grow w-full max-w-xl bg-white overflow-hidden"
      >
        <div
          class="flex flex-col flex-grow h-0 p-4 overflow-y-auto position-fixed"
          ref="scrollContainer"
        >
          <Message
            v-for="message in messages.slice().reverse()"
            :username="message.user_id"
            :personal="message.user_id === userID"
            :timestamp="message.timestamp"
            :text="message.text"
          />
        </div>

        <div class="bg-gray-300 p-4">
          <input
            class="flex items-center h-10 w-full rounded px-3 text-sm"
            type="text"
            placeholder="Type your message…"
            v-model="input"
            @keydown="handleSend"
          />
          <ion-icon name="attach-outline" ></ion-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const user = useUser();

const chat = useChatStore();
const input = ref("");
const message = ref(null);
const userID = ref(null);
const show = ref(false);

const messages = ref([]);
const messagesCount = ref(0);
const maxMessagesPerRequest = 50;

const scrollContainer = ref(null);

const loadMessagesBatch = async () => {
  const loadedMessages = await chat.getMessages(
    messagesCount.value,
    maxMessagesPerRequest - 1
  );

  messages.value = [...loadedMessages, ...messages.value];
  messagesCount.value += loadedMessages.length;
};

userID.value = user.value.id;
await loadMessagesBatch();
await chat.onNewMessage((newMessage) => {
  messages.value = [newMessage, ...messages.value];
  messagesCount.value += 1;
  nextTick(() => {
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
  });
});

function closeModal() {
  message.value = null;
  show.value = false;
}

const handleSend = async (event) => {
  if (!event.key || event.key === "Enter") {
    if (input.value) {
      await chat.createNewMessage(userID.value, input.value);
      input.value = "";
    }
  }
};

onMounted(() => {
  nextTick(() => {
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
  });
});


</script>
