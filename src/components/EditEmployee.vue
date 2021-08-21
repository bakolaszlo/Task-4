<template>
  <form id="myForm" @submit="sendForm($event)" @resetForm="resetForm()">
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

      <label for="image"> Current Image: </label>
      <div>
        <img :src="imageSrc" width="200" height="200" />
      </div>

      <label for="image"> Overwrite image: </label>
      <input type="file" accept="image/*" id="file-input" />
      <div v-if="errors">
        {{ errors }}
      </div>

      <div v-if="submited">Succesfully submited.</div>
      <input type="submit" value="Submit" />
      <button class="resetBtn" @click="resetForm()">Reset</button>
      <button class="resetBtn" @click="test()">Test</button>
    </div>
  </form>
</template>

<script>
import db from "../firebase/init";
import storageRef from "../firebase/storage";
export default {
  name: "EditEmployee",
  data() {
    return {
      employee_id: null,
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
      firstName: "",
      lastName: "",
      date: "",
      mail: "",
      imageSrc: "",
      createdAt: "",
      backup: "",
      submited: false,
    };
  },

  created() {
    db.collection("employees")
      .doc(this.$route.params.employee_id)
      .get()
      .then((doc) => {
        console.log("From Query", doc.data());
        this.firstName = doc.data().firstName;
        this.lastName = doc.data().lastName;
        this.sex = doc.data().sex;
        this.mail = doc.data().mail;
        this.date = doc.data().date;
        this.imageSrc = doc.data().image;
        this.createdAt = doc.data().createdAt;

        this.backup = {
          firstName: doc.data().firstName,
          lastName: doc.data().lastName,
          sex: doc.data().sex,
          mail: doc.data().mail,
          date: doc.data().date,
          imageSrc: doc.data().image,
          createdAt: doc.data().createdAt,
        };
        storageRef
          .child(this.imageSrc)
          .getDownloadURL()
          .then((url) => {
            this.imageSrc = url;
            this.backup.url = url;
          })
          .catch(() => {
            storageRef
              .child("profiles/default.png")
              .getDownloadURL()
              .then((url) => {
                this.imageSrc = url;
                this.backup.url = url;
              });
          });
      })
      .catch(() => {
        storageRef
          .child("profiles/default.png")
          .getDownloadURL()
          .then((url) => {
            this.imageSrc = url;
            this.backup.url = url;
          });
      });

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
  },
  methods: {
    test() {
      this.submited = !this.submited;
    },
    resetForm() {
      this.firstName = this.backup.firstName;
      this.lastName = this.backup.lastName;
      this.sex = this.backup.sex;
      this.mail = this.backup.mail;
      this.date = this.backup.date;
      this.imageSrc = this.backup.image;
      this.createdAt = this.backup.createdAt;
      this.imageSrc = this.backup.url;
      console.log("Form reset", this.backup);
    },
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
        id: this.$route.params.employee_id,
        firstName: this.firstName,
        lastName: this.lastName,
        date: this.date,
        mail: this.mail,
        sex: this.sex,
        createdAt: this.createdAt,
      };
      console.log(event);
      console.log(event.target[5].files[0]);
      console.log(data);
      try {
        if (event.target[5].files[0]) {
          this.uploadImg(event.target[5].files[0]);
          data.image = "profiles/" + this.$route.params.employee_id;
        }
      } catch (error) {
        console.log(error);
      }

      console.log(data);
      db.collection("employees")
        .doc(this.$route.params.employee_id.toString())
        .set(data)
        .then();
      this.clearForm(event);
    },
    uploadImg(file) {
      let metadata = {
        contentType: "image/jpeg",
      };

      storageRef //firebase.storage().ref();
        .child("profiles/" + this.$route.params.employee_id)
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

<style>
.resetBtn {
  width: 100%;
  background-color: #393939;
  color: #00ad5f;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.resetBtn:hover {
  background-color: #00ad5f;
  color: #393939;
}
</style>
