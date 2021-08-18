<template>
  <div class="about">
    <h1>Here you can add employees</h1>
    <Form />
  </div>
</template>
<script>
// @ is an alias to /src
import Form from "@/components/Form.vue";

export default {
  name: "Home",
  components: {
    Form,
  },
};
</script>
