<template>
  <div class="relative">
    <div
      class="flex flex-col items-center justify-center w-screen min-h-screen bg-gray-100 text-gray-800 pt-14 md:pt-16"
    >
      <div
        class="flex flex-col flex-grow w-full max-w-xl bg-white overflow-hidden"
      >
        <Private
          v-for="user in userList"
          :username="user.id"
          :personal_id="userID"
        />
        <div
          class="flex flex-col flex-grow h-0 p-4 overflow-y-auto position-fixed"
          ref="scrollContainer"
        >
          <Message
            v-for="message in messages.slice().reverse()"
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
</template>

<script setup>
const user = useUser();

const chat = useChatStore();
const input = ref("");
const userID = ref(null);

const userList = ref([]);
const messages = ref([]);



const receiver_id = useReceiver_id();

const getUsers = async () => {
  userList.value = await chat.getUserList();
};

await getUsers();
console.log(userList.value);



userID.value = user.value.id;

const handleSend = async (event) => {
  console.log("Receiver id : " + receiver_id.value);

  if (!event.key || event.key === "Enter") {
    if (input.value) {
      await chat.createNewMessage(userID.value, input.value, receiver_id.value);
      input.value = "";
    }

  }
};
</script>
