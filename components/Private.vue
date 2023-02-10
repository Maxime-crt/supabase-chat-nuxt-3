<template>
    <button class="bg-gray-300"
        @click="handleClick"
    >
        <div v-if="!avatar_url" class="flex-shrink-0 h-10 w-10 rounded-full">
            <ProfileImage v-model:path="avatar" />
        </div>
        <div v-else class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300" />
        <span class="font-bold text-sm">{{ user }}</span>
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

const handleClick = () => {
    console.log({ user });
    console.log("My id : " + props.personal_id)
    console.log("User id : " + props.username)
};

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
</script>