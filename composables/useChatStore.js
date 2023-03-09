export const useChatStore = defineStore("chatStore", {
  state: () => ({
    messages: [],
  }),
  getters: {
    messageList: (state) => state.messages,
  },
  actions: {
    // A function that get all the messages between the current user and the user with the id passed as parameter
    async getMessagesById(id, userID, from, to) {
      // from and to are optional
      let supabase = useSupabaseClient();
      const { data } = await supabase
        .from("messages")
        .select()
        .eq("receiver_id", id)
        .eq("user_id", userID)
        .range(from, to)
        .order("timestamp", { ascending: false });
      const { data: data2 } = await supabase
        .from("messages")
        .select()
        .eq("receiver_id", userID)
        .eq("user_id", id)
        .range(from, to)
        .order("timestamp", { ascending: false });
      const allMessages = data.concat(data2);
      allMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      return allMessages;
    },

    // A function that get the new message only if we are in the chat with the user who sent it
    async onNewMessageById(messages, id, userID, handler) {
        /* console.log("messages : " + messages.value ); */
      /* console.log("test1 : " + userID);
      console.log("test2 : " + id);
      console.log("test3 : " + handler); */
      let supabase = useSupabaseClient();
      supabase
        .channel("realtime:messages:*")
        .on("postgres_changes", { event: "*", schema: "*" }, (payload) => {
        
          if (
            (payload.new.receiver_id == id && payload.new.user_id == userID) ||
            (payload.new.receiver_id == userID && payload.new.user_id == id)
          ) {
            handler(payload.new);
            messages.value.push(payload.new);
          }
        })
        .subscribe();
    },

    async createNewMessage(user_id, text, receiver_id) {
      let supabase = useSupabaseClient();
      const { data } = await supabase
        .from("messages")
        .insert({ user_id, text, receiver_id });
      return data;
    },
    async getUserList() {
      let supabase = useSupabaseClient();
      const { data } = await supabase.from("profiles").select();
      return data;
    },
  },
});
