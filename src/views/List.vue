<template>
  <div class="home">
    <Filters />
    <Table />
  </div>
</template>

<script>
// @ is an alias to /src
import Filters from "@/components/Filters.vue";
import Table from "@/components/Table.vue";

export default {
  name: "Home",
  components: {
    Filters,
    Table,
  },
};
</script>
