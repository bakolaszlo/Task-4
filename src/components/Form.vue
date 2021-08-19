<template>
  <form id="myForm" @submit="sendForm($event)">
    <div class="table-head">
      <label for="firstName"> First Name*: </label>

      <input v-model="firstName" placeholder="First Name" />

      <label for="lname"> Last Name*: </label>

      <input v-model="lastName" placeholder="Last Name" />

      <label for="mail"> Mail*: </label>

      <input v-model="mail" placeholder="myemail@domain.com" />

      <label for="sex"> Sex*: </label>

      <select v-model="sex">
        <option
          v-for="option in options"
          v-bind:key="option.value"
          :value="option.value"
        >
          {{ option.text }}
        </option>
      </select>

      <label for="date"> Date*: </label>

      <input
        v-model="date"
        type="date"
        name="date"
        id="date"
        :min="startDate"
        :max="endDate"
      />

      <label for="image"> Image: </label>
      <input type="file" accept="image/*" id="file-input" />
      <div v-if="errors">
        {{ errors }}
      </div>

      <input type="submit" value="Register" />
    </div>
  </form>
</template>

<script>
import db from "../firebase/init";
import storageRef from "../firebase/storage";
export default {
  name: "form",
  data() {
    return {
      sex: "wtf",
      options: [
        {
          text: "Female",
          value: "female",
        },
        {
          text: "Male",
          value: "male",
        },
        { text: "Other", value: "wtf" },
      ],
      startDate: "",
      endDate: "",
      errors: "",
      maxIndex: 0,
    };
  },
  created() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear() - 18;
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    this.endDate = yyyy + "-" + mm + "-" + dd;
    this.startDate = yyyy - 100 + "-" + mm + "-" + dd;

    db.collection("employees")
      .orderBy("createdAt", "desc")
      .limit(1)
      .get()
      .then((doc) => {
        doc.forEach((doc) => {
          this.maxIndex = parseInt(doc.id) + 1;
          console.log("Index set to:", this.maxIndex);
        });
      });
  },
  methods: {
    checkForm(e) {
      e.preventDefault();
      this.errors = "";
      if (!this.firstName || !this.lastName || !this.mail || !this.date) {
        this.errors = "Every starred (*) field is required.";
        return false;
      }
      if (!this.validEmail(this.mail)) {
        this.errors = "Mail is not valid.";
        return false;
      }
      return true;
    },
    validEmail: function (email) {
      var re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    sendForm(event) {
      event.preventDefault();
      if (!this.checkForm(event)) {
        console.log(this.errors);
        return;
      }
      const data = {
        id: this.maxIndex,
        firstName: this.firstName,
        lastName: this.lastName,
        date: this.date,
        mail: this.mail,
        sex: this.sex,
        createdAt: new Date(),
      };
      console.log(event);
      console.log(event.target[5].files[0]);
      console.log(data);
      try {
        if (event.target[5].files[0]) {
          this.uploadImg(event.target[5].files[0]);
          data.image = "profiles/" + this.maxIndex;
        }
      } catch (error) {
        console.log(error);
      }

      console.log(data);
      db.collection("employees").doc(this.maxIndex.toString()).set(data).then();
      this.clearForm(event);
    },
    uploadImg(file) {
      let metadata = {
        contentType: "image/jpeg",
      };

      storageRef //firebase.storage().ref();
        .child("profiles/" + this.maxIndex)
        .put(file, metadata)
        .then(() => {
          console.log("file uploaded?!");
        });
    },
    async clearForm(e) {
      this.firstName = this.lastName = this.mail = this.date = undefined;
      await e.target.reset();
      this.sex = "wtf";
      e.target[5].files = undefined;
    },
  },
};
</script>

<style></style>
