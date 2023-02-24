<template>
  <div>
    <!-- Menu Left side -->
    <div class="relative">
      <div class="absolute inset-y-0 left-0 max-w-3xl z-50">
        <Private
          v-for="user in filteredUserList"
          :key="user.id"
          :username="user.id"
          :personal_id="userID"
        />
      </div>
    </div>
    <!-- Chat -->
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
              :key="message.id"
              :username="message.user_id"
              :receiver_id="message.receiver_id"
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
const user = useUser();
const chat = useChatStore();
const input = ref("");
const userID = ref(null);
const userList = ref([]);
const receiver_id = useReceiver_id();
const messages = ref([]);
const messagesCount = ref(0);
const maxMessagesPerRequest = 50;

const getUsers = async () => {
  userList.value = await chat.getUserList();
};

// récupère la liste des utilisateurs
await getUsers();

// Récupère l'id de l'utilisateur courant
userID.value = user.value.id;

// Filtre pour ne pas afficher l'utilisateur courant (sois-même)
const filteredUserList = computed(() => {
  return userList.value.filter((user) => {
    return user.id !== userID.value;
  });
});

// Envoie un message quand on appuie sur entrée
const handleSend = async (event) => {
  if (!event.key || event.key === "Enter") {
    if (input.value) {
      await chat.createNewMessage(userID.value, input.value, receiver_id.value);
      input.value = "";
      console.log("Receiver id : " + receiver_id.value);
    }
  }
};

// Au changement de la conversation on charge les messages et on écoute les nouveaux messages
watch(receiver_id, async (newReceiver_id) => {
  if (newReceiver_id) {
    // Reset les messages et le compteur de messages chargés pour la nouvelle conversation
    messages.value = [];
    messagesCount.value = 0;

    //function qui Charge les messages
    const loadMessagesBatch = async () => {
      // Charge les messages
      const loadedMessages = await chat.getMessagesById(
        newReceiver_id,
        userID.value,
        messagesCount.value,
        maxMessagesPerRequest - 1
      );
      messages.value = [...messages.value, ...loadedMessages];
      messagesCount.value += loadedMessages.length;
    };
    // appel de la function qui charge les messages
    await loadMessagesBatch();
    // update les messages quand un nouveau message arrive et scroll automatiquement
    await chat.onNewMessage((newMessage) => {
      if (newMessage.receiver_id === newReceiver_id && newMessage.user_id === userID.value) {
        messages.value = [newMessage, ...messages.value];
        messagesCount.value += 1;
        nextTick(() => {
          scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
        });
      }
    });
  }
});

// Scroll automatique quand on reçoit un nouveau message
onMounted(() => {
  nextTick(() => {
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
  });
});
</script>
