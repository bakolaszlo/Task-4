<template>
  <div>
    <center>
      <button id="prevBtn" @click="pagePrev()" :disabled="prevBtn != 'enabled'">
        Prev
      </button>
      <button id="nextBtn" @click="pageNext()" :disabled="nextBtn != 'enabled'">
        Next
      </button>

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
    <span v-else>
      <div>
        <label>{{ dataLoadMessage }}</label>
      </div>
      <div class="lds-roller">
        <div class="null-div"></div>
        <div class="null-div"></div>
        <div class="null-div"></div>
        <div class="null-div"></div>
        <div class="null-div"></div>
        <div class="null-div"></div>
        <div class="null-div"></div>
        <div class="null-div"></div></div
    ></span>
  </div>
</template>

<script>
import db from "../firebase/init";
import storage from "../firebase/storage";
import loadingMsg from "../loading/loading_messages";
export default {
  name: "dashboard",
  data() {
    return {
      employees: [],
      employeesImg: [],
      limit: 5,
      doneLoadingImages: false,
      imagesLoaded: 0,
      isAllSelected: false,
      dataLoadMessage: "Loading data...",
      field: "createdAt",
      firstElement: "",
      lastElement: "",
      collection: "employees",
      bFirst: true,
      prevBtn: "disabled",
      nextBtn: "disabled",
      nextPageSize: -1,
      prevPageSize: -1,
    };
  },
  created() {
    db.collection(this.collection)
      .orderBy(this.field)
      .limit(this.limit)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (this.bFirst) {
            this.firstElement = doc.data();
            this.bFirst = false;
          }
          this.lastElement = doc.data();
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
        this.isPrevPageAvailable();
        this.isNextPageAvailable();
        this.bFirst = true;
      });
  },
  methods: {
    getimg(id, docid) {
      if (this.isAllSelected) {
        this.limit++;
      }
      try {
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
      this.nextPageSize = -1;
      this.prevPageSize = -1;
      let dbRef = db.collection(this.collection).orderBy(this.field);
      this.dataLoadMessage =
        loadingMsg[Math.floor(Math.random() * loadingMsg.length)];
      if (event.target.value != "all") {
        dbRef = dbRef.limit(parseInt(event.target.value));
        this.isAllSelected = false;
        this.limit = event.target.value;
        this.pageSize = event.target.value;
        this.nextBtn = "enabled";
      } else {
        this.prevBtn = "disabled";
        this.nextBtn = "disabled";
        this.isAllSelected = true;
        this.limit = 0;
      }
      dbRef.get().then((querySnapshot) => {
        this.clearTable();
        querySnapshot.forEach((doc) => {
          if (this.bFirst) {
            this.firstElement = doc.data();
            this.bFirst = false;
          }
          this.lastElement = doc.data();

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
        this.bFirst = true;
        this.isPrevPageAvailable();
        this.isNextPageAvailable();
      });
    },

    clearTable() {
      this.doneLoadingImages = false;
      this.imagesLoaded = 0;
      this.employees = [];
      this.employeesImg = [];
    },
    checkIfDoneLoading() {
      if (this.nextPageSize != -1 || this.prevPageSize != -1) {
        if (
          this.nextPageSize == this.imagesLoaded ||
          this.prevPageSize == this.imagesLoaded
        ) {
          this.doneLoadingImages = true;
          return;
        }
      }
      if (this.imagesLoaded == this.limit) {
        this.doneLoadingImages = true;
      } else {
        this.doneLoadingImages = false;
      }
    },
    pagePrev() {
      this.dataLoadMessage =
        loadingMsg[Math.floor(Math.random() * loadingMsg.length)];
      let dbRef = db
        .collection(this.collection)
        .orderBy(this.field)
        .endBefore(this.firstElement[this.field]);
      if (this.prevPageSize == -1) {
        dbRef = dbRef.limitToLast(this.limit);
      } else {
        dbRef = dbRef.limitToLast(this.prevPageSize);
      }
      dbRef.get().then((querySnapshot) => {
        this.clearTable();
        querySnapshot.forEach((doc) => {
          if (this.bFirst) {
            this.firstElement = doc.data();
            this.bFirst = false;
          }
          this.lastElement = doc.data();
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
        this.isNextPageAvailable();
        this.isPrevPageAvailable();
        this.bFirst = true;
      });
    },
    pageNext() {
      this.dataLoadMessage =
        loadingMsg[Math.floor(Math.random() * loadingMsg.length)];
      let dbRef = db
        .collection(this.collection)
        .orderBy(this.field)
        .startAfter(this.lastElement[this.field]);
      if (this.nextPageSize == -1) {
        dbRef = dbRef.limit(this.limit);
      } else {
        dbRef = dbRef.limit(this.nextPageSize);
      }
      dbRef.get().then((querySnapshot) => {
        this.clearTable();
        querySnapshot.forEach((doc) => {
          if (this.bFirst) {
            this.firstElement = doc.data();
            this.bFirst = false;
          }
          this.lastElement = doc.data();
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
        this.isNextPageAvailable();
        this.isPrevPageAvailable();
        this.bFirst = true;
      });
    },
    isPrevPageAvailable() {
      db.collection(this.collection)
        .orderBy(this.field)
        .endBefore(this.firstElement[this.field])
        .limitToLast(this.limit)
        .get()
        .then((querySnapshot) => {
          if (parseInt(querySnapshot.size) === 0) {
            this.prevBtn = "disabled";
          } else {
            console.log(querySnapshot.size);
            if (parseInt(querySnapshot.size) != this.limit) {
              this.prevPageSize = parseInt(querySnapshot.size);
              this.nextPageSize = -1;
            } else {
              this.prevPageSize = -1;
            }
            this.prevBtn = "enabled";
          }
        });
    },
    isNextPageAvailable() {
      db.collection(this.collection)
        .orderBy(this.field)
        .startAfter(this.lastElement[this.field])
        .limit(this.limit)
        .get()
        .then((querySnapshot) => {
          if (parseInt(querySnapshot.size) === 0) {
            this.nextBtn = "disabled";
          } else {
            if (parseInt(querySnapshot.size) != this.limit) {
              this.nextPageSize = parseInt(querySnapshot.size);
              this.prevPageSize = -1;
            } else {
              this.nextPageSize = -1;
            }
            this.nextBtn = "enabled";
          }
        });
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

@keyframes ldio-h1rzyy8ble5-1 {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(-45deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
@keyframes ldio-h1rzyy8ble5-2 {
  0% {
    transform: rotate(180deg);
  }
  50% {
    transform: rotate(225deg);
  }
  100% {
    transform: rotate(180deg);
  }
}
.ldio-h1rzyy8ble5 > div:nth-child(2) {
  transform: translate(-15px, 0);
}
.ldio-h1rzyy8ble5 > div:nth-child(2) div {
  position: absolute;
  top: 40px;
  left: 40px;
  width: 120px;
  height: 60px;
  border-radius: 120px 120px 0 0;
  background: #2c8c14;
  animation: ldio-h1rzyy8ble5-1 1s linear infinite;
  transform-origin: 60px 60px;
}
.ldio-h1rzyy8ble5 > div:nth-child(2) div:nth-child(2) {
  animation: ldio-h1rzyy8ble5-2 1s linear infinite;
}
.ldio-h1rzyy8ble5 > div:nth-child(2) div:nth-child(3) {
  transform: rotate(-90deg);
  animation: none;
}
@keyframes ldio-h1rzyy8ble5-3 {
  0% {
    transform: translate(190px, 0);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  100% {
    transform: translate(70px, 0);
    opacity: 1;
  }
}
.ldio-h1rzyy8ble5 > div:nth-child(1) {
  display: block;
}
.ldio-h1rzyy8ble5 > div:nth-child(1) div {
  position: absolute;
  top: 92px;
  left: -8px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #0a4308;
  animation: ldio-h1rzyy8ble5-3 1s linear infinite;
}
.ldio-h1rzyy8ble5 > div:nth-child(1) div:nth-child(1) {
  animation-delay: -0.67s;
}
.ldio-h1rzyy8ble5 > div:nth-child(1) div:nth-child(2) {
  animation-delay: -0.33s;
}
.ldio-h1rzyy8ble5 > div:nth-child(1) div:nth-child(3) {
  animation-delay: 0s;
}
.loadingio-spinner-bean-eater-e1rm019nrig {
  width: 200px;
  height: 200px;
  display: inline-block;
  overflow: hidden;
  background: #f1f2f3;
}
.ldio-h1rzyy8ble5 {
  width: 100%;
  height: 100%;
  position: relative;
  transform: translateZ(0) scale(1);
  backface-visibility: hidden;
  transform-origin: 0 0; /* see note above */
}
.ldio-h1rzyy8ble5 div {
  box-sizing: content-box;
}
/* generated by https://loading.io/ */

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

.lds-roller {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-roller div {
  animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  transform-origin: 40px 40px;
}
.lds-roller div:after {
  content: " ";
  display: block;
  position: absolute;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #fff;
  margin: -4px 0 0 -4px;
}
.lds-roller div:nth-child(1) {
  animation-delay: -0.036s;
}
.lds-roller div:nth-child(1):after {
  top: 63px;
  left: 63px;
}
.lds-roller div:nth-child(2) {
  animation-delay: -0.072s;
}
.lds-roller div:nth-child(2):after {
  top: 68px;
  left: 56px;
}
.lds-roller div:nth-child(3) {
  animation-delay: -0.108s;
}
.lds-roller div:nth-child(3):after {
  top: 71px;
  left: 48px;
}
.lds-roller div:nth-child(4) {
  animation-delay: -0.144s;
}
.lds-roller div:nth-child(4):after {
  top: 72px;
  left: 40px;
}
.lds-roller div:nth-child(5) {
  animation-delay: -0.18s;
}
.lds-roller div:nth-child(5):after {
  top: 71px;
  left: 32px;
}
.lds-roller div:nth-child(6) {
  animation-delay: -0.216s;
}
.lds-roller div:nth-child(6):after {
  top: 68px;
  left: 24px;
}
.lds-roller div:nth-child(7) {
  animation-delay: -0.252s;
}
.lds-roller div:nth-child(7):after {
  top: 63px;
  left: 17px;
}
.lds-roller div:nth-child(8) {
  animation-delay: -0.288s;
}
.lds-roller div:nth-child(8):after {
  top: 56px;
  left: 12px;
}
@keyframes lds-roller {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.null-div {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
</style>
