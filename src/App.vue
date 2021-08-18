<template>
  <div id="nav">
    <router-link to="/">List Employees</router-link> |
    <router-link to="/Add">Add Employees</router-link>
  </div>
  <router-view />
</template>

<script></script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

body,
html {
  height: 100%;
  font-family: sans-serif;
  background-color: gray;
}

input,
select {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

input[type="submit"] {
  width: 100%;
  background-color: #393939;
  color: #00ad5f;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

select {
  min-width: 9em;
}

input[type="submit"]:hover {
  background-color: #00ad5f;
  color: #393939;
}

div {
  border-radius: 5px;
  background-color: #808080;
  padding: 20px;
}

.btn {
  width: auto;
  border-radius: 50%;
}

.btn:hover {
  cursor: pointer;
  background-color: #00ad5f;
  border-color: #808080;
}

label {
  color: #08df7e;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 5px;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.1);
  /* //box-shadow: 0 5px 20px 0px rgba(0, 0, 0, 0.9); */
}
</style>
