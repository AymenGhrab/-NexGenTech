import { LightningElement, track, wire } from 'lwc';
import getProductsByCategory3 from '@salesforce/apex/ProductController.getProductsByCategory3';

export default class ProductCATEGORY extends LightningElement {
    @track categoryId;
    @track products = [];

   
    connectedCallback() {
        this.extractCategoryId();
        

        window.addEventListener('popstate', this.handleURLChange.bind(this));  // For back/forward navigation
        window.addEventListener('hashchange', this.handleURLChange.bind(this));  // For hash changes in the URL
    }


    disconnectedCallback() {
        window.removeEventListener('popstate', this.handleURLChange.bind(this));
        window.removeEventListener('hashchange', this.handleURLChange.bind(this));
    }


    handleURLChange() {
        this.extractCategoryId();
    }

    extractCategoryId() {
        const path = window.location.pathname;
        const parts = path.split('/');
        this.categoryId = parts[parts.length - 1]; // Assuming categoryId is the last segment of the URL
        console.log('Extracted categoryId:', this.categoryId);
    }


    @wire(getProductsByCategory3, { categoryId: '$categoryId' })
    wiredProducts({ error, data }) {
        if (data) {
            this.products = data.map(product => {
                const imageUrl = this.extractImageUrl(product.Image__c);
                return { ...product, Image_URL: imageUrl };
            });
        } else if (error) {
            console.error('Error loading products:', error);
        }
    }

    extractImageUrl(imageHtml) {
        if (!imageHtml) return ''; 
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = imageHtml;
        const imgTag = tempDiv.querySelector('img');
        if (imgTag) {
            const src = imgTag.getAttribute('src');
            if (src.startsWith('/')) {
                return window.location.origin + src;
            }
            return src;
        }
        return ''; 
    }
}
