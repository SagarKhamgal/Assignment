import { api, LightningElement, track, wire } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import UPDATED_CONTACTS from '@salesforce/messageChannel/Updated_Contacts__c';
import NAME_FIELD from '@salesforce/schema/Contact.Name';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import ACCOUNT_NAME_FIELD from '@salesforce/schema/Contact.Account.Name';
import getContacts from '@salesforce/apex/ContactController.getDynamicContacts';

const columns = [
  { 
      label: 'Contact Name',
      fieldName: 'ContactName',
      type:'string',
  },
  {
       label: 'Email',
      fieldName: 'Email',
      type:'string',
  },
  {
      label: 'Account Name',
      fieldName: 'AccountName',
      type:'string',
  }
];

export default class LoadUpdatedRecords extends LightningElement {
@track columns = columns;
@track error;
@track data ;
@api searchkey;
@wire(getContacts,{searchKey:'$searchkey'})
wiredConacts({error, data}) {
  if (data) {
      console.log(data);
      this.data = data;
  } else if (error) {
      this.error = error;
  }
} 
}   