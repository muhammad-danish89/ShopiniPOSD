<template>
  <div class="main-content">
    <breadcumb :page="$t('Warehouses')" :folder="$t('Settings')"/>

    <div v-if="isLoading" class="loading_page spinner spinner-primary mr-3"></div>
    <b-card class="wrapper" v-if="!isLoading">
      <vue-good-table
        mode="remote"
        :columns="columns"
        :totalRows="totalRows"
        :rows="warehouses"
        @on-page-change="onPageChange"
        @on-per-page-change="onPerPageChange"
        @on-sort-change="onSortChange"
        @on-search="onSearch"
        :search-options="{
        enabled: true,
        placeholder: $t('Search_this_table'),  
      }"
        :select-options="{ 
          enabled: true ,
          clearSelectionText: '',
        }"
        @on-selected-rows-change="selectionChanged"
        :pagination-options="{
        enabled: true,
        mode: 'records',
        nextLabel: 'next',
        prevLabel: 'prev',
      }"
        styleClass="table-hover tableOne vgt-table"
      >
        <div slot="selected-row-actions">
          <button class="btn btn-danger btn-sm" @click="delete_by_selected()">{{$t('Del')}}</button>
        </div>
        <div slot="table-actions" class="mt-2 mb-3">
          <b-button
            @click="New_Warehouse()"
            class="btn-rounded"
            variant="btn btn-primary btn-icon m-1"
          >
            <i class="i-Add"></i>
            {{$t('Add')}}
          </b-button>
        </div>

        <template slot="table-row" slot-scope="props">
          <span v-if="props.column.field == 'actions'">
            <a @click="Edit_Warehouse(props.row)" title="Edit" v-b-tooltip.hover>
              <i class="i-Edit text-25 text-success"></i>
            </a>
            <a title="Delete" v-b-tooltip.hover @click="Remove_Warehouse(props.row.id)">
              <i class="i-Close-Window text-25 text-danger"></i>
            </a>
          </span>
        </template>
      </vue-good-table>
    </b-card>

    <validation-observer ref="Create_Warehouse">
      <b-modal hide-footer size="lg" id="New_Warehouse" :title="editmode?$t('Edit'):$t('Add')">
        <b-form @submit.prevent="Submit_Warehouse">
          <b-row>
            <!-- Name -->
            <b-col md="6">
              <validation-provider
                name="Name"
                :rules="{ required: true}"
                v-slot="validationContext"
              >
                <b-form-group :label="$t('Name')">
                  <b-form-input
                    :placeholder="$t('Enter_Name_Warehouse')"
                    :state="getValidationState(validationContext)"
                    aria-describedby="Name-feedback"
                    label="Name"
                    v-model="warehouse.name"
                  ></b-form-input>
                  <b-form-invalid-feedback id="Name-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                </b-form-group>
              </validation-provider>
            </b-col>

            <!-- Phone -->
			<b-col md="6" sm="12">
          
 <b-form-group :label="$t('Mobile')">
  <b-input-group>
    <template #prepend>
       <v-select
                         
                            v-model="warehouse.mobile1"
                           :rules="{ required: true}"
                            :reduce="label => label.value"
                            :placeholder="$t('PleaseSelect')"
                            :options="
                              [
                              {label: '079', value: '079'},
                              {label: '078', value: '079'},
                              {label: '077', value: '077'},
                              {label: '076', value: '076'},
                              {label: '075', value: '075'},
                              {label: '074', value: '074'},
                              ]"
                          ></v-select>
    </template>

    <b-form-input
                    label="Phone"
                    v-model="warehouse.mobile"
                  ></b-form-input>
               
   
  </b-input-group>
   </b-form-group>
  </b-col>
          
           

          <template>
		  
			<div class="col-md-6">
              <span><fieldset class="form-group" id="__BVID__111">
					   <legend tabindex="-1" class="bv-no-focus-ring col-form-label pt-0" id="__BVID__111__BV_label_">Select City:</legend>
					   <div>
                            <select class="form-control" v-model='city_id' @change='getStates()'>
                              <option value='0' >Select city</option>
                              <option v-for='data in countries' :value='data.id'>{{ data.city_name_english }}</option>
                            </select>
                        </div></fieldset></span>
						</div>
<div class="col-md-6">
                       <span><fieldset class="form-group" id="__BVID__111">
					   <legend tabindex="-1" class="bv-no-focus-ring col-form-label pt-0" id="__BVID__111__BV_label_">Select Province:</legend>
					   <div>
					  
                         
                            <select class="form-control" v-model='state'>
                              <option value='0' >Select State</option>
                              <option v-for='data in states' :value='data.province_id'>{{ data.province_name_eng }}</option>
                            </select>
                        </div></fieldset></span>
						</div>
                  
</template>   
            <!-- Email -->
            <b-col md="6">
              <b-form-group :label="$t('Email')">
                <b-form-input
                  :placeholder="$t('Enter_Email_Warehouse')"
                  label="Email"
                  v-model="warehouse.email"
                ></b-form-input>
              </b-form-group>
            </b-col>

            <!-- Zip Code -->
            <b-col md="6">
              <b-form-group :label="$t('ZipCode')">
                <b-form-input
                  :placeholder="$t('Enter_ZipCode_Warehouse')"
                  label="ZipCode"
                  v-model="warehouse.zip"
                ></b-form-input>
              </b-form-group>
            </b-col>

            <b-col md="12" class="mt-3">
              <b-button variant="primary" type="submit">{{$t('submit')}}</b-button>
            </b-col>
          </b-row>
        </b-form>
      </b-modal>
    </validation-observer>
  </div>
</template>

<script>
import NProgress from "nprogress";

export default {
  metaInfo: {
    title: "Warehouse"
  },
  data() {
    return {
      isLoading: true,
      serverParams: {
        columnFilters: {},
        sort: {
          field: "id",
          type: "desc"
        },
        page: 1,
        perPage: 10
      },
	   country: 0,
	   city_id:0,
                countries: [],
                state: 0,
                states: [],
      selectedIds: [],
      totalRows: "",
      search: "",
      limit: "10",
      warehouses: [],
      editmode: false,
      warehouse: {
        id: "",
        name: "",
        mobile: "",
		mobile1:"",
        email: "",
        zip: "",
        state: "",
        city_id: ""
      }
    };
  },

  computed: {
    columns() {
      return [
        {
          label: this.$t("Name"),
          field: "name",
          tdClass: "text-left",
          thClass: "text-left"
        },
        {
          label: this.$t("Phone"),
          field: "mobile",
          tdClass: "text-left",
          thClass: "text-left"
        },
        {
          label: this.$t("Country"),
          field: "country",
          tdClass: "text-left",
          thClass: "text-left"
        },
        {
          label: this.$t("City"),
          field: "city",
          tdClass: "text-left",
          thClass: "text-left"
        },
        {
          label: this.$t("Email"),
          field: "email",
          tdClass: "text-left",
          thClass: "text-left"
        },
        {
          label: this.$t("ZipCode"),
          field: "zip",
          tdClass: "text-left",
          thClass: "text-left"
        },
        {
          label: this.$t("Action"),
          field: "actions",
          html: true,
          tdClass: "text-right",
          thClass: "text-right",
          sortable: false
        }
      ];
    }
  },

  methods: {
    //---- update Params Table
    updateParams(newProps) {
      this.serverParams = Object.assign({}, this.serverParams, newProps);
    },

    //---- Event Page Change
    onPageChange({ currentPage }) {
      if (this.serverParams.page !== currentPage) {
        this.updateParams({ page: currentPage });
        this.Get_Warehouses(currentPage);
      }
    },

    //---- Event Per Page Change
    onPerPageChange({ currentPerPage }) {
      if (this.limit !== currentPerPage) {
        this.limit = currentPerPage;
        this.updateParams({ page: 1, perPage: currentPerPage });
        this.Get_Warehouses(1);
      }
    },

    //---- Event Select Rows
    selectionChanged({ selectedRows }) {
      this.selectedIds = [];
      selectedRows.forEach((row, index) => {
        this.selectedIds.push(row.id);
      });
    },

    //---- Event Sort Change

    onSortChange(params) {
      this.updateParams({
        sort: {
          type: params[0].type,
          field: params[0].field
        }
      });
      this.Get_Warehouses(this.serverParams.page);
    },

    //---- Event Search
    onSearch(value) {
      this.search = value.searchTerm;
      this.Get_Warehouses(this.serverParams.page);
    },

    //---- Validation State Form
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },

    //------------- Submit Validation Create & Edit Warehouse
    Submit_Warehouse() {
      this.$refs.Create_Warehouse.validate().then(success => {
        if (!success) {
          this.makeToast(
            "danger",
            this.$t("Please_fill_the_form_correctly"),
            this.$t("Failed")
          );
        } else {
          if (!this.editmode) {
            this.Create_Warehouse();
          } else {
            this.Update_Warehouse();
          }
        }
      });
    },

    //------ Toast
    makeToast(variant, msg, title) {
      this.$root.$bvToast.toast(msg, {
        title: title,
        variant: variant,
        solid: true
      });
    },

    //------------------------------ Modal (create Warehouse) -------------------------------\\
    New_Warehouse() {
      this.reset_Form();
      this.editmode = false;
      this.$bvModal.show("New_Warehouse");
    },

    //------------------------------ Modal (Update Warehouse) -------------------------------\\
    Edit_Warehouse(warehouse) {
      this.Get_Warehouses(this.serverParams.page);
      this.reset_Form();
      this.warehouse = warehouse;
      this.editmode = true;
      this.$bvModal.show("New_Warehouse");
    },

    //--------------------------Get ALL warehouses ---------------------------\\

    Get_Warehouses(page) {
      // Start the progress bar.
      NProgress.start();
      NProgress.set(0.1);
      axios
        .get(
          "warehouses?page=" +
            page +
            "&SortField=" +
            this.serverParams.sort.field +
            "&SortType=" +
            this.serverParams.sort.type +
            "&search=" +
            this.search +
            "&limit=" +
            this.limit
        )
        .then(response => {
          this.warehouses = response.data.warehouses;
          this.totalRows = response.data.totalRows;

          // Complete the animation of theprogress bar.
          NProgress.done();
          this.isLoading = false;
        })
        .catch(response => {
          // Complete the animation of theprogress bar.
          NProgress.done();
          setTimeout(() => {
            this.isLoading = false;
          }, 500);
        });
    },


getCountries: function(){
              axios.get('/api/getCountries')
              .then(function (response) {
                 this.countries = response.data;
              }.bind(this));
         
            },
            getStates: function() {
                axios.get('/api/getStates',{
                 params: {
                   country_id: this.city_id
                 }
              }).then(function(response){
                    this.states = response.data;
                }.bind(this));
            },
    //------------------------------- Create Warehouse ------------------------\\
    Create_Warehouse() {
      axios
        .post("warehouses", {
          name: this.warehouse.name,
          mobile: this.warehouse.mobile1+this.warehouse.mobile,
          email: this.warehouse.email,
          zip: this.warehouse.zip,
		  
          city_id: this.city_id,
		   province_id: this.state,
        
        })
        .then(response => {
          Fire.$emit("Event_Warehouse");
          this.makeToast(
            "success",
            this.$t("Create.TitleWarhouse"),
            this.$t("Success")
          );
        })
        .catch(error => {
          this.makeToast("danger", this.$t("InvalidData"), this.$t("Failed"));
        });
    },

    //------------------------------- Update Warehouse ------------------------\\
    Update_Warehouse() {
      axios
        .put("warehouses/" + this.warehouse.id, {
          name: this.warehouse.name,
          mobile: this.warehouse.mobile1+this.warehouse.mobile,
          email: this.warehouse.email,
          zip: this.warehouse.zip,
          country: this.warehouse.country,
          city: this.warehouse.city
        })
        .then(response => {
          Fire.$emit("Event_Warehouse");

          this.makeToast(
            "success",
            this.$t("Update.TitleWarhouse"),
            this.$t("Success")
          );
        })
        .catch(error => {
          this.makeToast("danger", this.$t("InvalidData"), this.$t("Failed"));
        });
    },

    //------------------------------- reset Form ------------------------\\
    reset_Form() {
      this.warehouse = {
        id: "",
        name: "",
        mobile: "",
		mobile1: "",
        email: "",
        zip: "",
        country: "",
        city: ""
      };
    },

    //------------------------------- Delete Warehouse ------------------------\\
    Remove_Warehouse(id) {
      this.$swal({
        title: this.$t("Delete.Title"),
        text: this.$t("Delete.Text"),
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: this.$t("Delete.cancelButtonText"),
        confirmButtonText: this.$t("Delete.confirmButtonText")
      }).then(result => {
        if (result.value) {
          axios
            .delete("warehouses/" + id)
            .then(() => {
              this.$swal(
                this.$t("Delete.Deleted"),
                this.$t("Delete.WarehouseDeleted"),
                "success"
              );

              Fire.$emit("Delete_Warehouse");
            })
            .catch(() => {
              this.$swal(
                this.$t("Delete.Failed"),
                this.$t("Delete.Therewassomethingwronge"),
                "warning"
              );
            });
        }
      });
    },

    //---- Delete units by selection

    delete_by_selected() {
      this.$swal({
        title: this.$t("Delete.Title"),
        text: this.$t("Delete.Text"),
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: this.$t("Delete.cancelButtonText"),
        confirmButtonText: this.$t("Delete.confirmButtonText")
      }).then(result => {
        if (result.value) {
          // Start the progress bar.
          NProgress.start();
          NProgress.set(0.1);
          axios
            .post("warehouses/delete/by_selection", {
              selectedIds: this.selectedIds
            })
            .then(() => {
              this.$swal(
                this.$t("Delete.Deleted"),
                this.$t("Delete.WarehouseDeleted"),
                "success"
              );

              Fire.$emit("Delete_Warehouse");
            })
            .catch(() => {
              // Complete the animation of theprogress bar.
              setTimeout(() => NProgress.done(), 500);
              this.$swal(
                this.$t("Delete.Failed"),
                this.$t("Delete.Therewassomethingwronge"),
                "warning"
              );
            });
        }
      });
    }
  },

  //----------------------------- Created function-------------------\\

  created: function() {
    this.Get_Warehouses(1);
 this.getCountries();
    Fire.$on("Event_Warehouse", () => {
      setTimeout(() => {
        this.Get_Warehouses(this.serverParams.page);
        this.$bvModal.hide("New_Warehouse");
      }, 500);
    });

    Fire.$on("Delete_Warehouse", () => {
      setTimeout(() => {
        this.Get_Warehouses(this.serverParams.page);
      }, 500);
    });
  }
};
</script>