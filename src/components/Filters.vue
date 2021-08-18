<template>
  <div class="filters" id="filters">
    Filters:
    <div>
      By sex
      <select name="filterSex" id="filterSex" onchange="filterBySex()">
        <option value="" selected>All</option>
        <option value="female">Female</option>
        <option value="male">Male</option>
        <option value="wtf">Other</option>
      </select>
    </div>

    <div>
      By Image
      <select name="filterImg" id="filterImg" onchange="filterByImg()">
        <option value="" selected>All</option>
        <option value="img">With</option>
        <option value="No Image">Without</option>
      </select>
      <br />
    </div>

    <div>
      <div>
        Start Date:
        <input
          type="date"
          name="startDate"
          id="startDate"
          onchange="filterByDate(value,null)"
        />
        End Date:
        <input
          type="date"
          name="endDate"
          id="endDate"
          onchange="filterByDate(null,value)"
        />
      </div>
    </div>

    <div>
      Keyword
      <input
        type="text"
        id="filterKw"
        onkeyup="filterByKw(value)"
        placeholder="Search for anything.."
        title="Type in a name"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
