import { LightningElement, track, wire } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import Rating from '@salesforce/schema/Account.Rating';
import Type from '@salesforce/schema/Account.Type';
import createAccount from '@salesforce/apex/multiStepFormWithNavigation.createAccount';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createContact from '@salesforce/apex/multiStepFormWithNavigation.createContact';
import Thankyouimage from '@salesforce/resourceUrl/ThankYouImage';

export default class MultiStepFormWithNavigation extends LightningElement {
    @track firstScreen = true;
    @track secondScreen = false;
    @track thirdScreen = false;
    @track fourthscreen=false;

    @track accountName = '';
    @track accountPhone = '';
    @track Rating = '';
    @track Type = '';
    @track ratingOptions = [];
    @track typeOptions = [];
    @track createdAccountId;

    @track firstName = '';
    @track lastName = '';
    @track contactPhone = '';
    @track contactEmail = '';
    thankyou=Thankyouimage;

    // Handle Account Inputs
    handleAccountNameChange(event) {
        this.accountName = event.target.value;
    }

    handleAccountPhoneChange(event) {
        this.accountPhone = event.target.value;
    }

    handleRatingChange(event) {
        this.Rating = event.target.value;
    }

    handleTypeChange(event) {
        this.Type = event.target.value;
    }

    // Handle Contact Inputs
    handleContactFirstNameChange(event) {
        this.firstName = event.target.value;
    }

    handleContactLastNameChange(event) {
        this.lastName = event.target.value;
    }

    handleContactPhoneChange(event) {
        this.contactPhone = event.target.value;
    }

    handleContactEmailChange(event) {
        this.contactEmail = event.target.value;
    }

    // Validate form before proceeding
    isInputValid() {
        let isValid = true;
        const inputFields = this.template.querySelectorAll('lightning-input, lightning-combobox');
        
        inputFields.forEach(inputField => {
            if (!inputField.checkValidity()) {
                inputField.reportValidity();
                isValid = false;
            }
        });

        return isValid;
    }

    // Proceed to second screen after account info
    handleFirstScreenNext() {
        // Validate first screen
        if (!this.isInputValid()) {
            return;
        }

        this.firstScreen = false;
        this.secondScreen = true;
    }

    // Go back to the first screen
    handleSecondScreenPrevious() {
        this.firstScreen = true;
        this.secondScreen = false;
    }

    // Proceed to third (preview) screen after contact info
    handleSecondScreenNext() {
        // Validate second screen
        if (!this.isInputValid()) {
            return;
        }

        this.firstScreen = false;
        this.secondScreen = false;
        this.thirdScreen = true;
    }
    handleThirdScreenPrevious() {
        this.firstScreen = false;
        this.secondScreen = true;
        this.thirdScreen = false;
    }

    // Final Submit (create both account and contact records)
    handleFinalSubmit() {
        // Validate final details before creating the records
        if (!this.isInputValid()) {
            return;
        }
        this.firstScreen = false;
        this.secondScreen = false;
        this.thirdScreen = false;
        this.fourthscreen=true;
    
        // Create the Account first
        createAccount({
            Name: this.accountName,
            phone: this.accountPhone,
            Rating: this.Rating,
            Type: this.Type
        }).then(result => {
            this.createdAccountId = result; // Get the Account Id after creation
            this.showToast('Success', 'Account Created Successfully', 'success');
    
            // Now, create the Contact and link it to the created Account
            return createContact({
                FirstName: this.firstName,
                LastName: this.lastName,
                Phone: this.contactPhone,
                Email: this.contactEmail,
                createdAccountId: this.createdAccountId // Pass the created Account Id
            });
        }).then(() => {
            // this.resetForm();

                // setTimeout(() => {
                //     this.fourthscreen = false;
                //     this.firstScreen = true;
                // }, 5000);
                
            this.showToast('Success', 'Contact Created Successfully', 'success');
           

        
        }).catch(error => {
            this.showToast('Error', 'Error in creating Account or Contact', 'error');
        });
    }
    

    // Reset the form after successful submission
    resetForm() {
        this.accountName = '';
        this.accountPhone = '';
        this.Rating = '';
        this.Type = '';
        this.firstName = '';
        this.lastName = '';
        this.contactPhone = '';
        this.contactEmail = '';

        // this.firstScreen = true;
        // this.secondScreen = false;
        // this.thirdScreen = false;
    }

    // Picklist for Rating
    @wire(getPicklistValues, {
        recordTypeId: '012000000000000AAA',
        fieldApiName: Rating
    })
    picklistResults1({ error, data }) {
        if (data) {
            this.ratingOptions = data.values;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.ratingOptions = undefined;
        }
    }

    // Picklist for Type
    @wire(getPicklistValues, {
        recordTypeId: '012000000000000AAA',
        fieldApiName: Type
    })
    picklistResults2({ error, data }) {
        if (data) {
            this.typeOptions = data.values;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.typeOptions = undefined;
        }
    }

    // Show Toast Message
    showToast(title, message, variant) {
        const toastEvent = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(toastEvent);
    }
}