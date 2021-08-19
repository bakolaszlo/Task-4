<template>
  <div>
    <center>
      <button id="prevBtn" onclick="pagePrev()">Prev</button>
      <button id="nextBtn" onclick="pageNext()">Next</button>

      <select @change="setEmployeesToShow($event)">
        <option value="5" selected>5</option>
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="all">All</option>
      </select>
    </center>
  </div>
  <div class="table-head">
    <span v-if="doneLoadingImages">
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
            <td class="table-header" onclick="sortBy(this.innerHTML)">
              Delete
            </td>
          </tr>

          <tr v-for="employee in employees" v-bind:key="employee.id">
            <td class="column">{{ employee.id }}</td>
            <td class="column">{{ employee.firstName }}</td>
            <td class="column">{{ employee.lastName }}</td>
            <td class="column">{{ employee.mail }}</td>
            <td class="column">{{ employee.sex }}</td>
            <td class="column">{{ employee.date }}</td>
            <td class="column">
              <img :src="employeesImg[employee.id]" width="50" height="50" />
            </td>
            <td class="column"><button class="edit">Edit</button></td>
            <td class="column"><button class="edit">X</button></td>
          </tr>
        </tbody>
      </table>
    </span>
    <span v-else><div>Loading data.</div> </span>
  </div>
</template>

<script>
import db from "../firebase/init";
import storage from "../firebase/storage";
export default {
  name: "dashboard",
  data() {
    return {
      employees: [],
      employeesImg: [],
      limit: 5,
      doneLoadingImages: false,
      imagesLoaded: 0,
    };
  },
  created() {
    db.collection("employees")
      .orderBy("createdAt")
      .limit(this.limit)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data = {
            id: doc.id,
            firstName: doc.data().firstName,
            lastName: doc.data().lastName,
            date: this.formatDate(doc.data().date),
            mail: doc.data().mail,
            sex: doc.data().sex,
          };
          this.getimg(doc.data().image, doc.id);
          this.employees.push(data);
          console.log(this.employeesImg[doc.id]);
        });
      });
  },
  methods: {
    getimg(id, docid) {
      try {
        console.log(docid);
        storage
          .child(id)
          .getDownloadURL()
          .then((url) => {
            this.employeesImg[parseInt(docid)] = url;
            this.imagesLoaded++;
            console.log("Loaded images", this.imagesLoaded);
            this.checkIfDoneLoading();
          })
          .catch(() => {
            storage
              .child("profiles/default.png")
              .getDownloadURL()
              .then((url) => {
                this.employeesImg[parseInt(docid)] = url;
                this.imagesLoaded++;
                console.log("Loaded images", this.imagesLoaded);
                this.checkIfDoneLoading();
              });
          });
      } catch {
        storage
          .child("profiles/default.png")
          .getDownloadURL()
          .then((url) => {
            this.employeesImg[parseInt(docid)] = url;
            this.imagesLoaded++;
            console.log("Loaded images", this.imagesLoaded);
            this.checkIfDoneLoading();
          });
      }
    },
    formatDate(date) {
      var d = new Date(date);
      const month = d.toLocaleString("En", { month: "long" });
      const day = d.getDate();
      const year = d.getFullYear();

      return (
        day + " " + month.charAt(0).toUpperCase() + month.slice(1) + " " + year
      );
    },
    setEmployeesToShow(event) {
      let dbRef = db.collection("employees").orderBy("createdAt");
      if (event.target.value != "all") {
        dbRef = dbRef.limit(parseInt(event.target.value));
      }
      this.limit = event.target.value;
      console.log("Value changed to", this.limit);
      console.log("Value:", event.target.value);
      dbRef.get().then((querySnapshot) => {
        this.doneLoadingImages = false;
        this.imagesLoaded = 0;
        this.employees = [];
        this.employeesImg = [];
        querySnapshot.forEach((doc) => {
          const data = {
            id: doc.id,
            firstName: doc.data().firstName,
            lastName: doc.data().lastName,
            date: this.formatDate(doc.data().date),
            mail: doc.data().mail,
            sex: doc.data().sex,
          };
          this.getimg(doc.data().image, doc.id);

          this.employees.push(data);
        });
      });
    },
    checkIfDoneLoading() {
      if (this.imagesLoaded == this.limit) {
        this.doneLoadingImages = true;
      } else {
        this.doneLoadingImages = false;
      }
    },
  },
};
</script>

<style>
.edit {
  padding: 12px 20px;
  margin: 8px 0;
}
.table-head {
  background-color: gray;
  border-radius: 25px;
  padding-bottom: 25px;
  box-shadow: 0 5px 20px 0px rgba(0, 0, 0, 0.5);
  -moz-box-shadow: 0 5px 20px 0px rgba(0, 0, 0, 0.5);
  -webkit-box-shadow: 0 5px 20px 0px rgba(0, 0, 0, 0.5);
  -o-box-shadow: 0 5px 20px 0px rgba(0, 0, 0, 0.5);
  -ms-box-shadow: 0 5px 20px 0px rgba(0, 0, 0, 0.5);
}

.column {
  min-width: 100%;
  width: auto;
  padding-left: 40px;
  font-family: Lato-Regular;
  font-size: 15px;
  color: #808080;
  line-height: 1.4;
  background-color: #222222;
}

table {
  width: 100%;
  border-collapse: collapse;
}

.table-header {
  cursor: pointer;
  font-family: Lato-Bold;
  font-size: 15px;
  color: #00ad5f;
  line-height: 1.4;
  text-transform: uppercase;
  background-color: #393939;
  padding-top: 18px;
  padding-bottom: 18px;
  padding-left: 40px;
  width: auto;
}
</style>
