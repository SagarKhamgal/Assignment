import { LightningElement,track,wire } from 'lwc';
import pickListValueDynamically from '@salesforce/apex/LoadFieldsetObjects.pickListValueDynamically';
export default class DynamicPicklistForObjectFieldset extends LightningElement {
    @track picklistVal;
    showDataTable=false;
    fieldSetName='';
    @wire(pickListValueDynamically, {}) 
    selectTargetValues;
    
    selectOptionChanveValue(event){    
        this.picklistVal = event.target.value;
        this.showDataTable = false;
        if(this.picklistVal!=''){
            this.fieldSetName = 'DatatableFields';
            this.showDataTable = true;
        }
    }  
}
