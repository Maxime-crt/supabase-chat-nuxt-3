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
          :key="user.id"
          :username="user.id"
          :personal_id="userID"
          @keydown="handleClick"
        />
        <div
          class="flex flex-col flex-grow h-0 p-4 overflow-y-auto position-fixed"
          ref="scrollContainer"
        ></div>

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
const receiver_id = useReceiver_id();

const getUsers = async () => {
  userList.value = await chat.getUserList();
};

await getUsers();

userID.value = user.value.id;

const handleSend = async (event) => {
  if (!event.key || event.key === "Enter") {
    if (input.value) {
      await chat.createNewMessage(userID.value, input.value, receiver_id.value);
      input.value = "";
      console.log("Receiver id : " + receiver_id.value);
    }
  }
};
</script>
