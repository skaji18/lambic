<template>
  <v-progress-linear indeterminate />
</template>

<script>
import { UserService } from "@/services/UserService";

export default {
  async mounted() {
    const service = new UserService();
    await service.login();
    await this.$router.push({ path: "/" });
  },
};
</script>
