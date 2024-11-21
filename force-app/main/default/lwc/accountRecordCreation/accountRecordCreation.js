import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';

import createAccount from '@salesforce/apex/AccountClass.createAccount';
import Rating from '@salesforce/schema/Account.Rating';
import Type from '@salesforce/schema/Account.Type';
import CustomerPriority from '@salesforce/schema/Account.CustomerPriority__c';
import SLA from '@salesforce/schema/Account.SLA__c';

import thankYouImageResource from '@salesforce/resourceUrl/ThankYouImage';

export default class AccountRecordCreation extends LightningElement {
    @track accountTypes = [];
    @track accountRating = [];
    @track accountCustomerPriorityOptions = [];
    @track accountSLAOptions = [];
    @track accountName = '';
    @track accountPhone = '';
    @track Type = '';
    @track Rating = '';
    @track accountDOB;
    @track accountEmail = '';
    @track accountCustomerPriority = '';
    @track accountSLA = '';
    @track accountSLAExpirationDate = '';
    @track isOtherSelected = false;
    @track typeDescription = '';
    @track showThankYouScreen = false;

    thankYouImage = thankYouImageResource;

    @wire(getPicklistValues, { recordTypeId: '012000000000000AAA', fieldApiName: Type })
    handleAccountTypes({ error, data }) {
        if (data) {
            this.accountTypes = data.values;
        } else if (error) {
            this.accountTypes = [];
            console.error(error);
        }
    }

    @wire(getPicklistValues, { recordTypeId: '012000000000000AAA', fieldApiName: Rating })
    handleAccountRating({ error, data }) {
        if (data) {
            this.accountRating = data.values;
        } else if (error) {
            this.accountRating = [];
            console.error(error);
        }
    }

    @wire(getPicklistValues, { recordTypeId: '012000000000000AAA', fieldApiName: CustomerPriority })
    handle2({ error, data }) {
        if (data) {
            this.accountCustomerPriorityOptions = data.values;
        } else if (error) {
            this.accountCustomerPriorityOptions = [];
            console.error(error);
        }
    }

    @wire(getPicklistValues, { recordTypeId: '012000000000000AAA', fieldApiName: SLA })
    handle1({ error, data }) {
        if (data) {
            this.accountSLAOptions = data.values;
        } else if (error) {
            this.accountSLAOptions = [];
            console.error(error);
        }
    }

    handleNameChange(event) {
        this.accountName = event.target.value;
    }

    handlePhoneChange(event) {
        this.accountPhone = event.target.value;
    }

    handleTypeChange(event) {
        this.Type = event.target.value;
        this.isOtherSelected = (this.Type === 'Other');
    }

    handleRatingChange(event) {
        this.Rating = event.target.value;
    }

    handleDOBChange(event) {
        const selectedDOB = event.target.value;
        const today = new Date();
        const dobDate = new Date(selectedDOB);
        if (dobDate > today) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Date of Birth cannot be a future date.',
                    variant: 'error'
                })
            );
            this.accountDOB = null; // Clear the invalid date
        } else {
            this.accountDOB = selectedDOB;
        }
    }

    handleEmailChange(event) {
        this.accountEmail = event.target.value;
    }

    handleCustomerPriorityChange(event) {
        this.accountCustomerPriority = event.target.value;
    }

    handleSLAChange(event) {
        this.accountSLA = event.target.value;
    }

    handleSLAExpirationDateChange(event) {
        const selectedDate = event.target.value;
        const today = new Date();
        const slaDate = new Date(selectedDate);
        if (slaDate < today) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'SLA Expiration Date cannot be in the past.',
                    variant: 'error'
                })
            );
            this.accountSLAExpirationDate = null; // Clear the invalid date
        } else {
            this.accountSLAExpirationDate = selectedDate;
        }
    }

    handleDescriptionChange(event) {
        this.typeDescription = event.target.value; // Capture the "Other" description
    }


    handleSaveAccount() {
        if (!this.accountName || !this.accountPhone || !this.Type || !this.Rating) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Please fill all required fields before submitting.',
                    variant: 'error'
                })
            );
            return;
        }
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(this.accountPhone)) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Phone number must be exactly 10 digits.',
                    variant: 'error'
                })
            );
            return;
        }

        createAccount({
            Name: this.accountName,
            Phone: this.accountPhone,
            Type: this.Type,
            Rating: this.Rating,
            DOB: this.accountDOB,
            Email: this.accountEmail,
            CustomerPriority: this.accountCustomerPriority,
            SLA: this.accountSLA,
            SLAExpirationDate: this.accountSLAExpirationDate,
            TypeDescription: this.typeDescription
        })
            .then(() => {
                this.showThankYouScreen = true;
                this.resetFormFields();

                setTimeout(() => {
                    this.showThankYouScreen = false;
                }, 5000);
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }
    resetFormFields() {
        this.accountName = '';
        this.accountPhone = '';
        this.Type = '';
        this.Rating = '';
        this.accountDOB = '';
        this.accountEmail = '';
        this.accountCustomerPriority = '';
        this.accountSLA = '';
        this.accountSLAExpirationDate = '';
        this.typeDescription = '';
        this.isOtherSelected = false;
    }
}