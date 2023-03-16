<template>
  <div>
    <!-- Chat -->
    <div class="relative mt-4">
      <div class="">
        <div
          class="flex flex-col flex-grow w-full h-full bg-white overflow-hidden"
        >
          <div v-if="receiver_id">
            <!-- Bouton retour arrière -->
            <div
              class="fixed cursor-pointer left-0 top-0 mt-4 ml-4 w-8 h-8"
              @click="resetReceiver_id($event)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="ionicon"
                viewBox="0 0 512 512"
              >
                <title>Arrow Back</title>
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="48"
                  d="M244 400L100 256l144-144M120 256h292"
                />
              </svg>
            </div>

            <div class="mt-6 mb-2" ref="scrollContainer">
              <Message
                v-for="message in messages.slice()"
                :key="message.id"
                :username="message.user_id"
                :receiver_id="message.receiver_id"
                :personal="message.user_id === userID"
                :timestamp="message.timestamp"
                :text="message.text"
                @updateMessages="updateMessages()"
              />
            </div>
            <!-- Input Chat -->
            <div
              class="flex justify-center items-center bg-gray-300 p-1 rounded"
            >
              <input
                class="flex items-center h-10 w-full rounded px-3 text-sm outline-none"
                type="text"
                placeholder="Type your message…"
                v-model="input"
                @keydown="handleSend"
              />
            </div>
          </div>
          <div v-else>
            <!-- Barre de recherche conversation -->
            <div class="flex items-center justify-center mb-4 w-full">
              <input
                class="container flex items-center h-10 w-full px-3 text-sm outline-none bg-gray-100 p-1 rounded"
                type="text"
                placeholder="Rechercher ou démarrer une nouvelle discussion"
              />
            </div>

            <!-- Menu Top side -->
            <div class="flex flex-col gap-4">
              <div class="">
                <Private
                  v-for="user in filteredUserList"
                  :key="user.id"
                  :username="user.id"
                  :personal_id="userID"
                />
              </div>
            </div>
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
const scrollContainer = ref(null);

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
      // console.log("Receiver id : " + receiver_id.value);
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
      console.log("Receiver id : " + newReceiver_id);
      console.log("User id : " + userID.value);
      const loadedMessages = await chat.getMessagesById(
        newReceiver_id,
        userID.value,
        messagesCount.value,
        maxMessagesPerRequest - 1
      );
      messages.value = [...messages.value, ...loadedMessages];
      messagesCount.value += loadedMessages.length;

      nextTick(() => {
        setTimeout(() => {
          scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
        }, 200);
      });
    };
    // appel de la function qui charge les messages
    await loadMessagesBatch();

    /*  console.log(messages.value); */

    // Ecoute les nouveaux messages et les ajoute au début du tableau de messages (pour afficher les messages les plus récents en premier)
    await chat.onNewMessageById(messages, newReceiver_id, userID.value, () => {
      /* messages.value = [newMessage, ...messages.value]; */
      messagesCount.value += 1;
      /* console.log(messages.value) */
      nextTick(() => {
        setTimeout(() => {
          scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
        }, 200);
      });
    });
  }
});

// Scroll automatique quand on reçoit un nouveau message
onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
    }, 200);
  });
});

// Update les messages quand on envoie un nouveau message
const updateMessages = async () => {
  await chat.onNewMessageById((newMessage) => {
    messages.value = [newMessage, ...messages.value];
    messagesCount.value += 1;
    nextTick(() => {
      setTimeout(() => {
        scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
      }, 200);
    });
  });
};

// Reset le receiver_id à null quand on clique sur le bouton retour arrière avec prevent default pour éviter de recharger la page
const resetReceiver_id = (event) => {
  event.preventDefault();
  receiver_id.value = null;
};
</script>
