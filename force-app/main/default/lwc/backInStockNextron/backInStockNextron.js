import { LightningElement, track, api } from 'lwc';
import isProductOutOfStock from '@salesforce/apex/BackInStockControllerNextron.isProductOutOfStock';
import createStockRequest from '@salesforce/apex/BackInStockControllerNextron.createStockRequest';
import isUserAuthenticated from '@salesforce/apex/BackInStockControllerNextron.isUserAuthenticated';
import getAuthenticatedUserDetails from '@salesforce/apex/BackInStockControllerNextron.getAuthenticatedUserDetails';
import hasActiveAlert from '@salesforce/apex/BackInStockControllerNextron.hasActiveAlert';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class BackInStockNextron extends LightningElement {

     @api productId;
    @track email = '';
    @api productSku;
    @track accountId = '';
    @track showButton = false;
    @track isSubmitting = false;
    @track showSuccess = false;
    @track isAuthenticated = false;
 
    connectedCallback() {
        this.extractProductIdFromUrl();
        if (this.productId) {
            this.checkStock();
        }
        this.checkAuthStatus();
    }
 
    extractProductIdFromUrl() {
        const urlPath = window.location.pathname;
        const pathParts = urlPath.split('/');
        this.productId = pathParts[pathParts.length - 1];
        console.log('Extracted productId:', this.productId);
    }
 
    checkStock() {
        isProductOutOfStock({ productId: this.productId })
            .then(result => {
                this.showButton = result;
            })
            .catch(error => {
                console.error('Error checking stock:', error);
                this.showToast('Error', 'Could not check stock', 'error');
            });
    }
 
    checkAuthStatus() {
        isUserAuthenticated()
            .then(result => {
                this.isAuthenticated = result;
                if (result) {
                    this.loadUserDetails();
                }
            })
            .catch(error => {
                console.error('Auth check failed:', error);
            });
    }
 
    loadUserDetails() {
        getAuthenticatedUserDetails()
            .then(data => {
                this.email = data.email;
                this.accountId = data.accountId;
                this.checkExistingAlert();
            })
            .catch(error => {
                console.error('Failed to load user details:', error);
            });
    }
 
    checkExistingAlert() {
        if (!this.email || !this.productId) return;
 
        hasActiveAlert({ productId: this.productId, email: this.email })
            .then(result => {
                if (result) {
                    this.showButton = false;
                    this.showSuccess = true;
                }
            })
            .catch(error => {
                console.error('Failed to check existing alert:', error);
            });
    }
 
    handleEmailChange(event) {
        this.email = event.target.value;
        this.checkExistingAlert();
    }
 
    handleAuthenticatedSubmit() {
        this.handleSubmit(this.email, this.accountId);
    }
 
    handleGuestSubmit() {
        if (!this.validateEmail()) {
            this.showToast('Error', 'Please enter a valid email address', 'error');
            return;
        }
        this.handleSubmit(this.email, null);
    }
 
    handleSubmit(emailToSubmit, accountIdToSubmit) {
        this.isSubmitting = true;
        createStockRequest({ productId: this.productId, email: emailToSubmit, accountId: accountIdToSubmit })
            .then(() => {
                this.showToast('Success', 'You’ll be notified when the product is back in stock', 'success');
                this.showButton = false;
                this.showSuccess = true;
            })
            .catch(error => {
                this.showToast('Error', error.body?.message || 'Submission failed', 'error');
            })
            .finally(() => {
                this.isSubmitting = false;
            });
    }
 
    validateEmail() {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(this.email);
    }
 
    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}