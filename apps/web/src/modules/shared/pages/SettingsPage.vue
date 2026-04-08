<template>
  <div class="min-h-screen bg-[color:var(--surface-page)] px-4 py-6 md:px-8">
    <div class="w-full space-y-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button
            class="rounded-full border border-slate-200 bg-white p-3 text-slate-500 transition hover:text-slate-900"
            type="button"
            @click="router.back()"
          >
            <ArrowLeft :size="18" />
          </button>
          <div>
            <p class="eyebrow">Settings</p>
            <h1 class="page-title text-xl font-bold text-slate-900">Profile Settings</h1>
          </div>
        </div>
      </div>

      <section class="grid gap-6 rounded-[1.5rem] bg-white p-6 shadow-xl shadow-slate-200/60 md:grid-cols-[220px_1fr]">
        <div class="space-y-4">
          <div class="relative h-44 w-full overflow-hidden rounded-[1.35rem] bg-slate-100">
            <img
              v-if="sessionStore.avatarUrl"
              :src="sessionStore.avatarUrl"
              alt="Profile"
              class="h-full w-full object-cover"
            />
            <div
              v-else
              class="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,#dbeafe,transparent_60%)] text-slate-400"
            >
              <UserRound :size="56" />
            </div>
          </div>

          <label class="block">
            <span class="sr-only">Upload profile picture</span>
            <input
              class="block w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white"
              type="file"
              accept="image/png,image/jpeg"
              @change="handleAvatarChange"
            />
          </label>
        </div>

        <div class="space-y-5">
          <div class="grid gap-4 md:grid-cols-2">
            <label class="space-y-2">
              <span class="eyebrow">First name</span>
              <input
                v-model="form.firstName"
                class="theme-input"
                type="text"
              />
            </label>
            <label class="space-y-2">
              <span class="eyebrow">Last name</span>
              <input
                v-model="form.lastName"
                class="theme-input"
                type="text"
              />
            </label>
          </div>

          <label class="space-y-2 block">
            <span class="eyebrow">Display name</span>
            <input
              v-model="form.displayName"
              class="theme-input"
              type="text"
            />
          </label>

          <div class="flex flex-wrap gap-3">
            <button
              class="theme-accent-bg rounded-xl px-6 py-3.5 text-[13px] font-semibold"
              type="button"
              @click="confirmOpen = true"
            >
              Save changes
            </button>
            <button
              class="rounded-xl bg-slate-900 px-6 py-3.5 text-[13px] font-semibold text-white"
              type="button"
              @click="signOut"
            >
              Sign out
            </button>
          </div>
        </div>
      </section>
    </div>

    <ConfirmationDialog
      confirm-label="Save"
      message="Save these profile changes and return to the dashboard?"
      :open="confirmOpen"
      title="Confirm changes"
      @cancel="confirmOpen = false"
      @confirm="saveProfile"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ArrowLeft, UserRound } from "lucide-vue-next";

import ConfirmationDialog from "@/components/ui/ConfirmationDialog.vue";
import { useSessionStore } from "@/stores/session";

const router = useRouter();
const route = useRoute();
const sessionStore = useSessionStore();
const confirmOpen = ref(false);

const form = reactive({
  displayName: "",
  firstName: "",
  lastName: "",
});

watch(
  () => sessionStore.profile,
  (profile) => {
    form.displayName = profile?.displayName ?? sessionStore.displayName;
    form.firstName = profile?.firstName ?? "";
    form.lastName = profile?.lastName ?? "";
  },
  { immediate: true },
);

const handleAvatarChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) {
    return;
  }
  await sessionStore.uploadAvatar(file);
};

const saveProfile = async () => {
  confirmOpen.value = false;
  await sessionStore.updateProfile({
    displayName: form.displayName,
    firstName: form.firstName,
    lastName: form.lastName,
    themeMode: "blue-medical",
    accentColor: "#2563eb",
  });
  const role = route.meta.role === "doctor" ? "doctor" : "patient";
  await router.push(`/${role}/dashboard`);
};

const signOut = async () => {
  const role = route.meta.role === "doctor" ? "doctor" : "patient";
  await sessionStore.logout();
  await router.push(`/${role}/login`);
};
</script>
