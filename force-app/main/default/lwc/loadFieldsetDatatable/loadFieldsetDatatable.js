import {LightningElement, track,api, wire } from 'lwc';
import getFieldsAndRecords from '@salesforce/apex/LoadFieldRecordsFromFieldset.getFieldsAndRecords';
import { deleteRecord } from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from "@salesforce/apex";

const actions = [
    {label : 'View',name : 'view'},
    {label : 'Edit',name : 'edit'},
    {label : 'Delete',name : 'delete'},
    {label : 'Create',name : 'create'}
        
];
export default class LoadFieldsetDatatable extends NavigationMixin(LightningElement) {
	@api sfdcObjectApiName; 
	@api fieldSetName; 

	@track columns; //columns for List of fields datatable
	@track tableData; //data for list of fields datatable
	recordCount; 

	items= []; 
	totalRecountCount= 0;
	totalPage = 0;
	pageSize = 10; 
	endingRecord= 0; 
	startingRecord= 1;
	isPageChanged = false;
	page = 1; 
	allSelectedRows= [];

	connectedCallback(){
	}
	@wire (getFieldsAndRecords,{strObjectApiName: '$sfdcObjectApiName' ,strfieldSetName: '$fieldSetName'})
	loadFieldAndFieldData({error,data}){
		if(data) {
			let objStr = JSON.parse(data);
			/* retrieve listOfFields */
			let listOfFields = JSON.parse(Object.values(objStr)[1]);
			//retrieve listOfRecords
			let listOfRecords = JSON.parse(Object.values(objStr)[0]);
			let items = []; 

			listOfRecords.map((item, index) => {
				console.log(item.AccountId)
			});

			listOfFields.map(element => {
			items = [...items, {
				label: element.label,
				fieldName: element.fieldPath,
				type: element.type,
				sortable: true,
			}];
			});
		
			items = [...items, {
				label: "",
				type: 'action',
				typeAttributes: {
				rowActions: actions,
				menuAlignment: 'right'
			}
			}];
			this.columns = items;
			this.tableData = listOfRecords;
			this.recordCount = this.tableData.length;
			this.error = undefined;
			this.processRecords();
		}
		else if (error) {
            this.error = error;
        }
	} 
	processRecords(){
        	this.items = this.tableData;
            this.totalRecountCount = this.tableData.length; 
            this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize); 
            this.tableData = this.items.slice(0,this.pageSize); 
            this.endingRecord = this.pageSize;
    }
	
	previousHandler() {
        this.isPageChanged = true;
        if (this.page > 1) {
            this.page = this.page - 1; //decrease page by 1
            this.displayRecordPerPage(this.page);
        }
          var selectedIds = [];
          for(var i=0; i<this.allSelectedRows.length;i++){
            selectedIds.push(this.allSelectedRows[i].Id);
          }
        this.template.querySelector(
            '[data-id="table"]'
          ).selectedRows = selectedIds;
    }

	displayRecordPerPage(page){
        this.startingRecord = ((page -1) * this.pageSize) ;
        this.endingRecord = (this.pageSize * page);
        this.endingRecord = (this.endingRecord > this.totalRecountCount) 
                            ? this.totalRecountCount : this.endingRecord; 
        this.tableData = this.items.slice(this.startingRecord, this.endingRecord);
        this.startingRecord = this.startingRecord + 1;
    } 

	nextHandler() {
        this.isPageChanged = true;
        if((this.page<this.totalPage) && this.page !== this.totalPage){
            this.page = this.page + 1; //increase page by 1
            this.displayRecordPerPage(this.page);            
        }
          var selectedIds = [];
          for(var i=0; i<this.allSelectedRows.length;i++){
            selectedIds.push(this.allSelectedRows[i].Id);
          }
        this.template.querySelector(
            '[data-id="table"]'
          ).selectedRows = selectedIds;
    }

	handleRowAction(event) {
		const actionName = event.detail.action.name;
		const row = event.detail.row;
		switch (actionName) {
			case 'view':
				this[NavigationMixin.Navigate]({
					type: 'standard__component',
					attributes: {
						componentName: 'CreateOpportunityUsingFieldset'
					},
					state: {
						c__counter: '5'
					}
				});

				/*this[NavigationMixin.Navigate]({
					type: 'standard__recordPage',
					attributes: {
						recordId: row.Id,
						objectApiName: this.sfdcObjectApiName,
						actionName: 'view'
					}
				});*/
				break;
			case 'edit':
				this[NavigationMixin.Navigate]({
					type: 'standard__recordPage',
					attributes: {
						recordId: row.Id,
						objectApiName: this.sfdcObjectApiName,
						actionName: 'edit'
					}
				})
				break;

			case 'create':
				this[NavigationMixin.Navigate]({
					type: 'standard__objectPage',
					attributes: {
						objectApiName: this.sfdcObjectApiName,
						actionName: 'new'
					}
				});
				break;
			case 'delete':
				this.delAccount(row.Id);
				this.refreshData();
				break;
		}
	}
	delAccount(delRecId) {
		deleteRecord(delRecId)
			.then(() => {
				this.dispatchEvent(
					new ShowToastEvent({
						title: 'Success',
						message: 'Record deleted',
						variant: 'success'
					})

				);
			})
			.catch(error => {
				this.dispatchEvent(
					new ShowToastEvent({
						title: 'Error deleting record',
						message: error.body.message,
						variant: 'error'
					})
				);
			});
	}
	refreshData() {
		refreshApex(this.loadFieldAndFieldData);
	}
	@track sortBy;
	@track sortDirection;
	doSorting(event) {
		this.sortBy = event.detail.fieldName;
		this.sortDirection = event.detail.sortDirection;
		this.sortData(this.sortBy, this.sortDirection);
	}
	sortData(fieldname, direction) {
		let parseData = JSON.parse(JSON.stringify(this.tableData));
		// Return the value stored in the field
		let keyValue = (a) => {
			return a[fieldname];
		};
		// cheking reverse direction
		let isReverse = direction === 'asc' ? 1 : -1;
		// sorting data
		parseData.sort((x, y) => {
			x = keyValue(x) ? keyValue(x) : ''; // handling null values
			y = keyValue(y) ? keyValue(y) : '';
			// sorting values based on direction
			return isReverse * ((x > y) - (y > x));
		});
		this.tableData = parseData;
	}
}