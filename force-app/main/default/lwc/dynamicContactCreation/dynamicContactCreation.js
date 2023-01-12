import { LightningElement, track, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import checkEmailExistForAccount from '@salesforce/apex/ContactController.checkEmailExistForAccount';
import checkAllEmailExistForAccount from '@salesforce/apex/ContactController.checkAllEmailExistForAccount';

export default class DynamicContactCreation extends NavigationMixin(LightningElement) {
    EmailAddress;
    AccountRecordId;   
    keyIndex = 0;
    refPage = 0;
    @track itemList = [
        {
            id: 0,
            accId : 'AccounId'+0,
            emailKeyId : 'EmailId'+0
        }
    ];

    checkEmailArray=[];
    meetCriteria;
    async addRow() {
        let foundDuplicateRecord = false;
        foundDuplicateRecord = this.checkDataForDuplicate();

        if(!this.meetCriteria)
            return false;    

        if(!foundDuplicateRecord){
            let resultval = false;
            await checkEmailExistForAccount({EmailId : this.EmailAddress , AccId : this.AccountRecordId})
            .then((result) => {
                resultval= result;
            })
            .catch((error) => {
                this.error = error;
                this.contacts = undefined;
            });
        
        if(!resultval){
            ++this.keyIndex;
            var newItem = [{ id: this.keyIndex ,
                         accId : 'AccounId'+this.keyIndex,
                         emailKeyId : 'EmailId'+this.keyIndex}];
            this.itemList = this.itemList.concat(newItem);
        }
        else{
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Duplicate Record Found',
                    variant: 'error',
                }),
            );   
        }

        }
        else{
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Duplicate Record Found',
                    variant: 'error',
                }),
            );  
        }
    }

   async handleSubmit() {
        let checkDeuplicateContact = false;
        checkDeuplicateContact = this.checkDataForDuplicate()
        let duplicateContacts = [];
        if(!checkDeuplicateContact){
            await checkAllEmailExistForAccount({wrpList : this.checkEmailArray})
            .then((result) => {
                duplicateContacts = result;
                this.error = undefined;
            })
            .catch((error) => {
                this.error = error;
            });       
            duplicateContacts.map((item, index) => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: `Duplicate contact found with ${item.Email} for Account ${item.AccountName}`,
                        variant: 'error',
                    }),
                );    
                checkDeuplicateContact = true;
            });
        }
        
        if(!checkDeuplicateContact){
        var isVal = true;
        await this.template.querySelectorAll('lightning-input-field').forEach(element => {
            isVal = isVal && element.reportValidity();
        });
        if (isVal) {
            await this.template.querySelectorAll('lightning-record-edit-form').forEach(element => {
               element.submit(); 
            });
            await this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Successs',
                    message: 'Contacts successfully created',
                    variant: 'success',
                }),
            );  
            this.keyIndex = 0;  
            this.template.querySelectorAll('lightning-input-field').forEach(element => {
                element.value='';
            });
            this.itemList = [
                {
                    id: 0,
                    accId : 'AccounId'+0,
                    emailKeyId : 'EmailId'+0
                }
            ];  

            setInterval(this.loadUpdatedContact(), 10000);
           
        } else {
             this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error creating record',
                    message: 'Please enter all the required fields',
                    variant: 'error',
                }),
            );
        }
        }
    }

    checkInternalContact(indexVal,accountIdVal,emailIdVal){
       var foundRec = false;
       this.checkEmailArray.map(function (currentItem,index) {
            if((parseInt(index)!==parseInt(indexVal)) && (currentItem.AccountId === accountIdVal && currentItem.Email === emailIdVal)){
                foundRec = true;
            }
        });
        return foundRec;
    }
    
    checkDataForDuplicate(){
        this.checkEmailArray=[];
        this.meetCriteria=true;
        
        for (let index = 0; index <= this.keyIndex ; index++) {
                let emailIdValue = this.template.querySelector(".EmailId"+index).value;
                let accountIdValue = this.template.querySelector(".AccounId"+index).value;
                if(emailIdValue===null || emailIdValue===''){
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error',
                            message: 'Please Enter Email',
                            variant: 'error',
                        }),
                    );  
                    this.meetCriteria = false;
                }  
                if(accountIdValue===null || accountIdValue===''){

                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error',
                            message: 'Please Select Account',
                            variant: 'error',
                        }),
                    );  
                    this.meetCriteria = false;
                }

                if(this.meetCriteria){
                   var arr = [{
                    'Email' : emailIdValue,
                    'AccountId' : accountIdValue}];
                    this.checkEmailArray = this.checkEmailArray.concat(arr);
                }
        }

        let foundDuplicateRecord = false;
            this.checkEmailArray.map((item, index) => {
            if(!foundDuplicateRecord){
                if(this.checkEmailArray.length!==1){
                    foundDuplicateRecord = this.checkInternalContact(index,item.AccountId,item.Email);
                } 
                this.AccountRecordId =''
                this.EmailAddress=''
                this.AccountRecordId = item.AccountId;
                this.EmailAddress = item.Email;  
                
            }
            });
        return false;
    }
   
    loadUpdatedContact() {
        this.refPage += 1;
    }
}