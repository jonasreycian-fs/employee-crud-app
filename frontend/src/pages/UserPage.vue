<template>
  <q-page padding>
    <div class="row justify-between items-center">
      <h5>Users List</h5>
      <q-btn
        ripple
        color="primary"
        text-color="white"
        label="Add User"
        @click="openDialog(null, UserDialog.CREATE)"
      />
    </div>
    <q-separator />
    <q-table
      title="Users"
      :rows="users.value"
      :columns="columns"
      row-key="name"
      :rows-per-page-options="[5, 10, 20]"
      :filter="searchStr"
      style="margin-top: 30px"
    >
      <template v-slot:top-right>
        <q-input dense debounce="300" v-model="searchStr" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            <span style="float: left">
              {{ col.label }}
            </span>
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td> {{ props.row.id }} </q-td>
          <q-td>
            {{ `${props.row.last_name}, ${props.row.first_name}` }}
          </q-td>
          <q-td> {{ props.row.email }} </q-td>
          <q-td> {{ getPhysicalAddress(props.row.physical_address) }} </q-td>
          <q-td>
            <div class="q-pa-md q-gutter-sm">
              <q-btn
                outline
                color="secondary"
                label="Details"
                size="sm"
                @click="openDialog(props.row, UserDialog.VIEW)"
              />
              <q-btn
                outline
                color="primary"
                label="Edit"
                size="sm"
                @click="openDialog(props.row, UserDialog.UPDATE)"
              />
              <q-btn
                outline
                color="negative"
                label="Delete"
                size="sm"
                @click="deleteUser(props.row.id)"
              />
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <!-- Open this dialog when creating a user -->
    <q-dialog v-model="showDialog" persistent full-width>
      <q-card>
        <q-card-section class="row items-center">
          <div class="text-h6">
            {{ dialog }}
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-form @submit="submitForm">
            <div class="fit row justify-evenly q-gutter-md">
              <q-card flat bordered class="col-md-3">
                <q-card-section>
                  <div class="text-h6">Personal Information</div>
                </q-card-section>
                <q-separator inset />
                <q-card-section>
                  <q-input
                    v-model="user.first_name"
                    label="First Name"
                    filled
                    lazy-rules
                    :disable="dialog === UserDialog.VIEW"
                    :rules="[
                      (val) => val.length > 0 || 'Please enter a first name',
                    ]"
                  />
                  <q-input
                    v-model="user.last_name"
                    label="Last Name"
                    filled
                    lazy-rules
                    :disable="dialog === UserDialog.VIEW"
                    :rules="[
                      (val) => val.length > 0 || 'Please enter a last name',
                    ]"
                  />
                  <q-input
                    v-model="user.email"
                    label="Email"
                    filled
                    lazy-rules
                    :disable="dialog === UserDialog.VIEW"
                    :rules="[
                      (val) => val.length > 0 || 'Please enter an email',
                    ]"
                  />
                </q-card-section>
              </q-card>
              <q-card flat bordered class="col-md-3">
                <q-card-section>
                  <div class="text-h6">Physical Address</div>
                </q-card-section>
                <q-separator inset />
                <q-card-section>
                  <q-input
                    v-model="user.physical_address.landmark"
                    label="Landmark"
                    filled
                    lazy-rules
                    :disable="dialog === UserDialog.VIEW"
                    :rules="[
                      (val) => val.length > 0 || 'Please enter a landmark',
                    ]"
                  />
                  <q-input
                    v-model="user.physical_address.street"
                    label="Street"
                    filled
                    lazy-rules
                    :disable="dialog === UserDialog.VIEW"
                    :rules="[
                      (val) => val.length > 0 || 'Please enter a street',
                    ]"
                  />
                  <q-input
                    v-model="user.physical_address.city"
                    label="City"
                    filled
                    lazy-rules
                    :disable="dialog === UserDialog.VIEW"
                    :rules="[(val) => val.length > 0 || 'Please enter a city']"
                  />
                  <q-input
                    v-model="user.physical_address.country"
                    label="Country"
                    filled
                    lazy-rules
                    :disable="dialog === UserDialog.VIEW"
                    :rules="[
                      (val) => val.length > 0 || 'Please enter a country',
                    ]"
                  />
                </q-card-section>
              </q-card>
              <q-card flat bordered class="col-md-3">
                <q-card-section>
                  <div class="text-h6">Billing Address</div>
                </q-card-section>
                <q-separator inset />
                <q-card-section>
                  <q-input
                    v-model="user.billing_address.landmark"
                    label="Landmark"
                    filled
                    lazy-rules
                    :disable="dialog === UserDialog.VIEW"
                    :rules="[
                      (val) => val.length > 0 || 'Please enter a landmark',
                    ]"
                  />
                  <q-input
                    v-model="user.billing_address.street"
                    label="Street"
                    filled
                    lazy-rules
                    :disable="dialog === UserDialog.VIEW"
                    :rules="[
                      (val) => val.length > 0 || 'Please enter a street',
                    ]"
                  />
                  <q-input
                    v-model="user.billing_address.city"
                    label="City"
                    filled
                    lazy-rules
                    :disable="dialog === UserDialog.VIEW"
                    :rules="[(val) => val.length > 0 || 'Please enter a city']"
                  />
                  <q-input
                    v-model="user.billing_address.country"
                    label="Country"
                    filled
                    lazy-rules
                    :disable="dialog === UserDialog.VIEW"
                    :rules="[(val) => val.length > 0 || 'Please enter a city']"
                  />
                </q-card-section>
              </q-card>
            </div>
          </q-form>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <div class="q-pa-md q-gutter-md">
            <q-btn
              v-if="
                dialog === UserDialog.CREATE || dialog === UserDialog.UPDATE
              "
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
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { api } from "../boot/axios";
import { Notify, Loading, Dialog } from "quasar";
import { ref, onMounted, watchEffect, reactive } from "vue";

const UserDialog = Object.freeze({
  CREATE: "Create User",
  UPDATE: "Update User",
  VIEW: "View User",
});

let address = {
  landmark: "",
  street: "",
  city: "",
  zip: "",
};

const userTemplate = {
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
    name: "full_name",
    label: "Full Name",
    field: "full_name",
    sortable: true,
  },
  {
    name: "email",
    label: "Email",
    field: "email",
    sortable: true,
  },
  {
    name: "p_address",
    label: "Physical Address",
    field: "p_address",
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
    const users = reactive([]);
    const user = ref(userTemplate);
    const isEditing = ref(false);
    const searchStr = ref("");
    const showDialog = ref(false);
    const dialog = ref(UserDialog.CREATE);

    const createUser = async () => {
      Loading.show();
      api
        .post("/api/users", user.value)
        .then(() => {
          readUsers(searchStr.value);
          user.value = userTemplate;
          Notify.create({
            message: "User created successfully",
            color: "positive",
          });
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
        .get(`/api/users?name=${str}`)
        .then((res) => {
          users.value = res.data;
          console.log(JSON.stringify(res.data));
        })
        .catch(({ response }) => {
          Notify.create({
            message: response.message,
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
          readUsers(searchStr.value);
          user.value = userTemplate;
          Notify.create({
            message: "User updated successfully",
            color: "positive",
          });
        })
        .catch(({ response }) => {
          Notify.create({
            message: response.data.message,
            color: "negative",
          });
        })
        .finally(() => {
          Loading.hide();
        });
    };

    const deleteUser = (id) => {
      Dialog.create({
        title: "Delete User",
        message: "Are you sure you want to delete this user?",
        cancel: true,
        persistent: true,
      }).onOk(() => {
        Loading.show();

        setTimeout(() => {
          api
            .delete(`/api/users/${id}`)
            .then(() => {
              readUsers(searchStr.value);
              Notify.create({
                message: "User deleted successfully",
                color: "positive",
              });
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
        }, 3000);
      });
    };

    const openDialog = (data, type) => {
      dialog.value = type;
      console.log(type);
      if (type === UserDialog.CREATE) {
        user.value = userTemplate;
      } else if (type === UserDialog.UPDATE || type === UserDialog.VIEW) {
        user.value = data;
      }
      showDialog.value = true;
    };

    const closeDialog = () => {
      showDialog.value = false;
      user.value = userTemplate;
      readUsers(searchStr.value);
    };

    const submitForm = () => {
      if (dialog.value == UserDialog.UPDATE) {
        updateUser();
      } else {
        createUser();
      }
      closeDialog();
    };

    watchEffect(() => {
      console.log("searchStr", searchStr.value);
      readUsers(searchStr.value);
    });

    onMounted(() => {
      readUsers(searchStr.value);
    });

    return {
      users,
      user,
      isEditing,
      searchStr,
      columns,
      dialog,
      UserDialog,
      showDialog,
      submitForm,
      openDialog,
      closeDialog,
      readUsers,
      createUser,
      updateUser,
      deleteUser,
      getPhysicalAddress: (data) => {
        let address = [];

        if (!data) return "No physical address is set!";
        if (data.landmark) address.push(data.landmark);
        if (data.street) address.push(data.street);
        if (data.city) address.push(data.city);
        if (data.country) address.push(data.country);

        return address.join(", ");
      },
    };
  },
};
</script>
