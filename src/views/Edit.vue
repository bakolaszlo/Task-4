<template>
  <div class="home">
    <EditEmployee />
  </div>
</template>

<script>
// @ is an alias to /src
import EditEmployee from "@/components/EditEmployee.vue";

export default {
  name: "Edit",
  components: {
    EditEmployee,
  },
};
</script>
