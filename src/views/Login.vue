<template>
  <v-progress-linear indeterminate />
</template>

<script>
import { UserUseCase } from "@/useCases/UserUseCase";

export default {
  async mounted() {
    const userUseCase = new UserUseCase();
    await userUseCase.login();
    await this.$router.push({ path: "/" });
  },
};
</script>
