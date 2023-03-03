export const useChatStore = defineStore('chatStore', {
    state: () => ({
        messages: [],
    }),
    getters: {
        messageList: (state) => state.messages,
    },
    actions: {
        async getMessages(from, to) { // from and to are optional
            let supabase = useSupabaseClient()
            const { data } = await supabase
                .from("messages")
                .select() 
                .range(from, to)
                .order("timestamp", { ascending: false });
            return data;
        },
        async getMessagesById(id, userID, from, to) { // from and to are optional
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
        async onNewMessage(handler) {
            let supabase = useSupabaseClient()
            supabase
                .channel('*')
                .on('postgres_changes', { event: '*', schema: '*' }, payload => {
                    handler(payload.new);
                })
                .subscribe()
        },
        async createNewMessage(user_id, text, receiver_id) {
            let supabase = useSupabaseClient()
            const { data } = await supabase
                .from("messages")
                .insert({ user_id, text, receiver_id });
            return data;
        },
        async getUserList() {
            let supabase = useSupabaseClient()
            const { data } = await supabase
                .from("profiles")
                .select();
            return data;
        },
    },
})