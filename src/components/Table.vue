<template>
  <div>
    <center>
      <button id="prevBtn" onclick="pagePrev()">Prev</button>
      <button id="nextBtn" onclick="pageNext()">Next</button>

      <select onchange="setEmployeesToShow(this.value)">
        <option value="5" selected>5</option>
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="all">All</option>
      </select>
    </center>
  </div>
  <div class="table-head">
    <table class="table" id="myTable">
      <tbody id="table-class">
        <tr id="-1" class="head">
          <td class="table-header" onclick="sortBy(this.innerHTML)">Index</td>
          <td class="table-header" onclick="sortBy(this.innerHTML)">
            First Name
          </td>
          <td class="table-header" onclick="sortBy(this.innerHTML)">
            Last Name
          </td>
          <td class="table-header" onclick="sortBy(this.innerHTML)">Mail</td>
          <td class="table-header" onclick="sortBy(this.innerHTML)">Sex</td>
          <td class="table-header" onclick="sortBy(this.innerHTML)">Date</td>
          <td class="table-header" onclick="sortBy(this.innerHTML)">Image</td>
          <td class="table-header" onclick="sortBy(this.innerHTML)">Edit</td>
          <td class="table-header" onclick="sortBy(this.innerHTML)">Delete</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {};
</script>

<style></style>
