import { api, LightningElement, track, wire } from 'lwc';
import getFieldsFromFieldSet from '@salesforce/apex/OpportunityFieldSet.getFieldsFromFieldSet';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import OPPORTUNITY_OBJECT from '@salesforce/schema/Opportunity';
import { NavigationMixin } from 'lightning/navigation';
export default class RecordEditFormCreateOppUsingFieldset extends NavigationMixin(LightningElement) {
    
    @api recordId;
    objectApiName=OPPORTUNITY_OBJECT;
    @track fields=[];
    opportunityId='';

    @wire(getFieldsFromFieldSet, {fieldSetName: 'OpportunityFieldSet', ObjectName: 'Opportunity'})
    loadFields({ error, data }) {
        if (data) {
            this.error = undefined;
            this.fields = data;
        } else if (error) {
            this.error = error;
            this.fields = undefined;
        }
    }
    handleSuccess(event) {
        this.opportunityId = event.detail.id;
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: this.objectApiName + ' created.',
                variant: 'success',
            })
        ); 
    this[NavigationMixin.Navigate]({ 
            type:'standard__recordPage',
            attributes:{ 
                recordId:this.opportunityId,
                objectApiName:'Opportunity',
                actionName:'view'
            }
        });
    }
}