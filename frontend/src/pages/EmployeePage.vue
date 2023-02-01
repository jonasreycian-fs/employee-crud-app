<template>
  <q-page padding>
    <div class="h5">Employee Page</div>
    <div>
      <q-card flat bordered class="bg-grey-1">
        <q-card-section>
          <q-input v-model="employee.name" label="Full Name" stack-label />
          <q-input v-model="employee.age" label="Age" stack-label />

          <q-btn
            style="margin-top: 20px"
            color="primary"
            text-color="white"
            label="Add Employee"
          />
          <q-btn
            style="margin-top: 20px"
            color="secondary"
            text-color="white"
            label="Update Employee"
          />
        </q-card-section>
      </q-card>
    </div>
    <div>
      <q-table
        title="Employee Records"
        :rows="employees.value"
        :columns="columns"
        row-key="name"
        :rows-per-page-options="[5, 10, 15]"
        :filter="filter"
        style="margin-top: 30px"
      >
        <template v-slot:top-right>
          <q-input dense debounce="300" v-model="filter" placeholder="Search">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
          <!-- Button to add new employee -->
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
                size="sm"
                color="primary"
                text-color="white"
                label="Edit"
              />
              <q-btn
                class="q-ml-md"
                size="sm"
                color="negative"
                text-color="white"
                label="Delete"
              />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <!-- Dialog for adding or updating a user -->
    <q-dialog v-model="editingEmployee" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <div class="text-h6">Add Employee</div>
        </q-card-section>

        <q-card-section>
          <q-form>
            <q-input
              v-model="employee.name"
              label="Full Name"
              stack-label
              :rules="[(val) => val.length > 0 || 'Please enter a name']"
            />
            <q-input
              v-model="employee.age"
              label="Age"
              stack-label
              :rules="[(val) => val.length > 0 || 'Please enter an age']"
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            label="Add"
            color="primary"
            v-close-popup
            :loading="loading"
            @click="addEmployee"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, onMounted, watchEffect, reactive } from "vue";
import { api } from "../boot/axios";
import { Loading, useQuasar } from "quasar";

const columns = [
  {
    name: "id",
    label: "ID",
    field: "id",
    sortable: true,
  },
  {
    name: "name",
    label: "Full Name",
    field: "name",
    sortable: true,
  },
  {
    name: "age",
    label: "Age",
    field: "age",
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
  name: "EmployeePage",
  setup() {
    const $q = useQuasar();
    const editingEmployee = ref(false);
    const loading = ref(false);
    const employees = reactive([]);
    const employee = ref({
      id: 0,
      name: "",
      age: 0,
    });
    const filter = ref("");

    onMounted(() => {});

    watchEffect(() => {
      console.log(employee);
    });

    return {
      employees,
      columns,
      filter,
      employee,
    };
  },
};
</script>
