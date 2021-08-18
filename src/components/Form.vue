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

<style></style>
