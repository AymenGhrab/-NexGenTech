import { LightningElement, api, track } from 'lwc';
import isProductOutOfStock from '@salesforce/apex/BackInStockController.isProductOutOfStock';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ProductAvailability extends LightningElement {
    @api productId;

    @track isLoading = false;
    @track isOutOfStock = false;
    @track error = null;
    @track hasChecked = false;

    connectedCallback() {
        this.extractProductIdFromUrl();
        if (this.productId) {
            this.checkStock();
        } else {
            console.error('No productId found.');
            this.error = 'Unable to determine the product.';
        }
    }

    extractProductIdFromUrl() {
        if (!this.productId) {
            const urlPath = window.location.pathname;
            const parts = urlPath.split('/');
            this.productId = parts[parts.length - 1];
            console.log('🔎 Extracted productId:', this.productId);
        }
    }

    checkStock() {
        this.isLoading = true;
        this.error = null;

        isProductOutOfStock({ productId: this.productId })
            .then(result => {
                console.log('Stock check result (isOutOfStock):', result);
                this.isOutOfStock = result;
                this.hasChecked = true;
            })
            .catch(error => {
                console.error('Error checking stock:', error);
                this.error = error?.body?.message || error?.message || 'Error checking stock.';
                this.showToast('Error', this.error, 'error');
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    get canRetry() {
        return this.error && !this.isLoading;
    }

    handleRetry() {
        console.log('Retry clicked');
        this.checkStock();
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}
