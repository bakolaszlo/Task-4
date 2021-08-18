<template>
  <div class="home">
    <HelloWorld />
    <Table />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/Filters.vue";
import Table from "@/components/Table.vue";

export default {
  name: "Home",
  components: {
    HelloWorld,
    Table,
  },
};
</script>
