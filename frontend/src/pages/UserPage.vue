<template>
  <q-page padding>
    <div class="row justify-between items-center">
      <h5>Users List</h5>
      <q-btn
        ripple
        color="primary"
        text-color="white"
        label="Add User"
        @click="openDialog(Dialog.CREATE)"
      />
    </div>
    <q-separator />
    <q-table
      title="Users"
      :rows="users.value"
      :columns="columns"
      row-key="name"
      :rows-per-page-options="[10, 25, 50]"
      :filter="filter"
      style="margin-top: 30px"
    >
      <template v-slot:top-right>
        <q-input dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th
            auto-width
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
          </q-td>
          <q-td auto-width>
            <q-btn
              color="primary"
              text-color="white"
              label="Edit"
              @click="editUser(props.row.id)"
            />
            <q-btn
              color="secondary"
              text-color="white"
              label="Delete"
              @click="deleteUser(props.row.id)"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <!-- Open this dialog when creating a user -->
    <q-dialog v-model="showDialog" persistent>
      <q-card class="width: 80vw">
        <q-card-section class="row items-center">
          <div class="text-h6">
            {{ Dialog === Dialog.CREATE ? "Add User" : "Update User" }}
          </div>
        </q-card-section>
        <q-card-section>
          <q-form @submit="submitForm" class="q-gutter-md">
            <q-input
              v-model="user.first_name"
              label="First Name"
              filled
              lazy-rules
              :rules="[(val) => val.length > 0 || 'Please enter a first name']"
            />
            <q-input
              v-model="user.last_name"
              label="Last Name"
              filled
              lazy-rules
              :rules="[(val) => val.length > 0 || 'Please enter a last name']"
            />
            <q-input
              v-model="user.email"
              label="Email"
              filled
              lazy-rules
              :rules="[(val) => val.length > 0 || 'Please enter an email']"
            />
            <q-input
              v-model="user.physical_address.landmark"
              label="Landmark"
              filled
              lazy-rules
              :rules="[(val) => val.length > 0 || 'Please enter a landmark']"
            />
            <q-input
              v-model="user.physical_address.street"
              label="Street"
              filled
              lazy-rules
              :rules="[(val) => val.length > 0 || 'Please enter a street']"
            />
            <q-input
              v-model="user.physical_address.city"
              label="City"
              filled
              lazy-rules
              :rules="[(val) => val.length > 0 || 'Please enter a city']"
            />
            <q-input
              v-model="user.physical_address.zip"
              label="Zip"
              filled
              lazy-rules
              :rules="[(val) => val.length > 0 || 'Please enter a zip']"
            />
            <q-input
              v-model="user.billing_address.landmark"
              label="Landmark"
              filled
              lazy-rules
              :rules="[(val) => val.length > 0 || 'Please enter a landmark']"
            />
            <q-input
              v-model="user.billing_address.street"
              label="Street"
              filled
              lazy
              :rules="[(val) => val.length > 0 || 'Please enter a street']"
            />
          </q-form>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            color="primary"
            text-color="white"
            label="Submit"
            type="submit"
            @click="submitForm"
          />
          <q-btn
            color="secondary"
            text-color="white"
            label="Cancel"
            @click="closeDialog"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { api } from "../boot/axios";
import { Notify, Loading } from "quasar";
import { ref, reactive, onMounted, watchEffect } from "vue";

const Dialog = Object.freeze({
  CREATE: "createUser",
  UPDATE: "updateUser",
});

let address = {
  landmark: "",
  street: "",
  city: "",
  zip: "",
};

let userTemplate = {
  id: "",
  first_name: "",
  last_name: "",
  email: "",
  physical_address: { ...address },
  billing_address: { ...address },
};

const columns = [
  {
    name: "id",
    label: "ID",
    field: "id",
    sortable: true,
  },
  {
    name: "first_name",
    label: "First Name",
    field: "first_name",
    sortable: true,
  },
  {
    name: "last_name",
    label: "Last Name",
    field: "last_name",
    sortable: true,
  },
  {
    name: "email",
    label: "Email",
    field: "email",
    sortable: true,
  },
  {
    name: "actions",
    label: "Actions",
    field: "actions",
    sortable: false,
  },
];

export default {
  name: "UserPage",
  setup() {
    const users = ref([]);
    const user = ref(userTemplate);
    const isLoading = ref(false);
    const isEditing = ref(false);
    const filter = ref("");
    const showDialog = ref(false);

    const createUser = async () => {
      api
        .post("/api/users", user.value)
        .then(() => {
          readUsers(filter.value);
          user.value = userTemplate;
        })
        .catch((err) => {
          Notify.create({
            message: err.response.data.message,
            color: "negative",
          });
        })
        .finally(() => {
          Loading.hide();
        });
    };

    const readUsers = async (str) => {
      Loading.show();
      await api
        .get(`/api/users?filter=${str}`)
        .then((res) => {
          users.value = res.data;
          console.log(users.value);
        })
        .catch((err) => {
          Notify.create({
            message: err.response.data.message,
            color: "negative",
          });
        })
        .finally(() => {
          Loading.hide();
        });
    };

    const updateUser = async () => {
      api
        .put(`/api/users/${user.value.id}`, user.value)
        .then(() => {
          readUsers(filter.value);
          user.value = userTemplate;
        })
        .catch((err) => {
          Notify.create({
            message: err.response.data.message,
            color: "negative",
          });
        })
        .finally(() => {
          Loading.hide();
        });
    };

    const deleteUser = (id) => {
      isLoading.value = true;
      Loading.show();
      api
        .delete(`/api/users/${id}`)
        .then(() => {
          readUsers(filter.value);
        })
        .catch((err) => {
          Notify.create({
            message: err.response.data.message,
            color: "negative",
          });
        })
        .finally(() => {
          Loading.hide();
        });
    };

    const openDialog = (dialog) => {
      isEditing.value = dialog === Dialog.UPDATE;
      showDialog.value = true;
    };

    const closeDialog = () => {
      showDialog.value = false;
      user.value = userTemplate;
    };

    const submitForm = () => {
      if (isEditing.value) {
        updateUser();
      } else {
        createUser();
      }
    };

    watchEffect(() => {
      readUsers(filter.value);
    });

    onMounted(() => {
      readUsers(filter.value);
    });

    return {
      users,
      user,
      isLoading,
      isEditing,
      filter,
      columns,
      Dialog,
      showDialog,
      submitForm,
      openDialog,
      closeDialog,
      readUsers,
      createUser,
      updateUser,
      deleteUser,
    };
  },
};
</script>
