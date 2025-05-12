import { LightningElement, api } from 'lwc';
import isProductOutOfStock from '@salesforce/apex/BackInStockController.isProductOutOfStock';

export default class ProductAvailability extends LightningElement {
    @api productId;

    isOutOfStock;
    error;
    isLoading = false;

    renderedCallback() {
        if (this.productId && this.isOutOfStock === undefined && !this.isLoading) {
            this.checkAvailability();
        }
    }

    checkAvailability() {
        this.isLoading = true;
        this.error = null;

        isProductOutOfStock({ productId: this.productId })
            .then(result => {
                this.isOutOfStock = result;
                this.error = null;
            })
            .catch(error => {
                this.error = error?.body?.message || error?.message || 'Unknown error';
                console.error('Error fetching product availability:', error);
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    get canRetry() {
        return this.error && !this.isLoading;
    }

    handleRetry() {
        this.error = null;
        this.checkAvailability();
    }
}
