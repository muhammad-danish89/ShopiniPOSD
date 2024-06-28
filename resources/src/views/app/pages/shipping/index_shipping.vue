
<template>
  <div class="main-content">
    <breadcumb :page="$t('Shipping')" :folder="$t('Tracking Order')"/>

    <div v-if="isLoading" class="loading_page spinner spinner-primary mr-3"></div>
    <b-card class="wrapper" v-if="!isLoading">
      <vue-good-table
        mode="remote"
        :columns="columns"
        :search-options="{
            enabled: true,
            placeholder:'search table'
          }"
        :totalRows="totalRows"
        :rows="shippings"
        @on-page-change="onPageChange"
        @on-per-page-change="onPerPageChange"
        @on-sort-change="onSortChange"
        @on-search="onSearch"
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
        
        <div slot="table-actions" class="mt-2 mb-3">
		
          <b-button
		  @click="Push_ShopiniExpress()"
           
            class="btn-rounded"
            variant="btn btn-primary btn-icon m-1"
          >
            <i class="i-Add"></i>
            {{$t('Push Shopini Express')}}
          </b-button>
        </div>

       
      </vue-good-table>
    </b-card>
   
  </div>
</template>

   
<script>
import NProgress from "nprogress";

export default {
  metaInfo: {
    title: "List"
  }, 
    
        data(){
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
      selectedIds: [],
      totalRows: "",
      search: "",
      limit: "10",
     shippings:[],
    
            }
        },
		 computed: {
    columns() {
      return [
        {
          label: this.$t("OrderNumber"),
          field: "sale_id",
          tdClass: "text-left",
          thClass: "text-left"
        },
        {
          label: this.$t("CustomerName"),
          field: "name",
          tdClass: "text-left",
          thClass: "text-left"
        },
        {
          label: this.$t("OrderDate"),
          field: "date",
          tdClass: "text-left",
          thClass: "text-left"
        },
		 {
          label: this.$t("TotalAmount"),
          field: "total_amount",
          tdClass: "text-left",
          thClass: "text-left"
        },
		 {
          label: this.$t("TrackingNumber"),
          field: "track_id",
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

        methods:{
		
		 //---- update Params Table
    updateParams(newProps) {
      this.serverParams = Object.assign({}, this.serverParams, newProps);
    },

    //---- Event Page Change
    onPageChange({ currentPage }) {
      if (this.serverParams.page !== currentPage) {
        this.updateParams({ page: currentPage });
        this.Get_Shipping(currentPage);
      }
    },

    //---- Event Per Page Change
    onPerPageChange({ currentPerPage }) {
      if (this.limit !== currentPerPage) {
        this.limit = currentPerPage;
        this.updateParams({ page: 1, perPage: currentPerPage });
        this.Get_Shipping(1);
      }
    },

    //---- Event Select Rows
    selectionChanged({ selectedRows }) {
      this.selectedIds = [];
      selectedRows.forEach((row, index) => {
        this.selectedIds.push(row.id);
      });
    },

    //---- Event on SortChange
    onSortChange(params) {
      this.updateParams({
        sort: {
          type: params[0].type,
          field: params[0].field
        }
      });
      this.Get_Shipping(this.serverParams.page);
    },

    //---- Event on Search
    onSearch(value) {
      this.search = value.searchTerm;
      this.Get_Shipping(this.serverParams.page);
    },
	    //------ Toast
    makeToast(variant, msg, title) {
      this.$root.$bvToast.toast(msg, {
        title: title,
        variant: variant,
        solid: true
      });
    },
	
	
	Push_ShopiniExpress(){
	this.isLoading = true;
         
		  axios
        .get("/PushOrders")
        .then(response => {
                this.makeToast(
            "success",
            this.$t("All Orders sent ShopiniExpress Dept."),
            this.$t("Success")
          );
		  this.Get_Shipping(1);
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
	
	
	
	
	
	
 //--------------------------Get ALL currencies ---------------------------\\

    Get_Shipping(page) {
      // Start the progress bar.
      NProgress.start();
      NProgress.set(0.1);
      axios
        .get(
          "shippings?page=" +
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
          this.shippings = response.data.shippings;
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
                   country_id: this.country
                 }
              }).then(function(response){
                    this.states = response.data;
                }.bind(this));
            }
        },
        created: function(){
            this.getCountries();
			 this.Get_Shipping(1);

        }
    }
</script>
