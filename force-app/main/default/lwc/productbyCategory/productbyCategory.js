import { LightningElement, api, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import getProductsByCategory3 from '@salesforce/apex/ProductController.getProductsByCategory3';

export default class ProductList extends LightningElement {
      recordId;
    products = [];
    error;

    @wire(CurrentPageReference)
    getStateParameters(currentPageReference) {
        if (currentPageReference) {
            this.recordId = currentPageReference.state.recordId;
            console.log('Extracted Category ID:', this.recordId);
            if (this.recordId) {
                this.fetchProducts();
            }
        }
    }

    fetchProducts() {
        getProductsByCategory3({ recordId: this.recordId })
            .then(result => {
                this.products = result;
                console.log('Fetched Products:', this.products);
            })
            .catch(error => {
                this.error = error;
                console.error('Error fetching products:', error);
            });
    }
}