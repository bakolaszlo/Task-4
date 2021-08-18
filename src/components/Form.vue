<template>
  <form id="myForm">
    <div class="table-head">
      <label for="firstName"> First Name*: </label>

      <input type="text" id="firstName" name="firstName" /> <br />

      <label for="lname"> Last Name*: </label>

      <input type="text" id="lastName" name="lastName" /> <br />

      <label for="mail"> Mail*: </label>

      <input type="mail" id="mail" name="mail" /> <br />

      <label for="sex"> Sex*: </label>

      <select name="sex" id="sex">
        <option value="" selected disabled hidden>Choose here</option>
        <option value="female">Female</option>
        <option value="male">Male</option>
        <option value="wtf">Other</option>
      </select>
      <br />

      <label for="date"> Date*: </label>

      <input type="date" name="date" id="date" /> <br />

      <label for="image"> Image: </label>
      <input type="file" name="image" id="image" /> <br />

      <input type="submit" value="Register" />
    </div>
  </form>
</template>

<script>
export default {};
</script>

<style>
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
