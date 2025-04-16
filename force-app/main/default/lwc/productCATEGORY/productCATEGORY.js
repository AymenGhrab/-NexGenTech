import { LightningElement, wire, track } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { NavigationMixin } from 'lightning/navigation';
import getProductsByCategory3 from '@salesforce/apex/ProductController.getProductsByCategory3';

export default class ProductCATEGORY extends NavigationMixin(LightningElement) {
    @track products = [];
    @track isLoading = false;
    @track error;
    currentPageReference;

    @wire(CurrentPageReference)
    handlePageReferenceChange(currentPageReference) {
        if (currentPageReference) {
            this.currentPageReference = currentPageReference;
            this.loadProducts();
        }
    }

    get categoryId() {
        if (!this.currentPageReference) return null;
        const path = window.location.pathname;
        const parts = path.split('/');
        return parts[parts.length - 1];
    }

    loadProducts() {
        if (!this.categoryId) return;
        
        this.isLoading = true;
        this.error = undefined;
        
        getProductsByCategory3({ categoryId: this.categoryId })
            .then(data => {
                this.products = data.map(product => {
                    return {
                        ...product,
                        Image_URL: this.extractImageUrl(product.Image__c)
                    };
                });
            })
            .catch(error => {
                console.error('Error loading products:', error);
                this.error = error;
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    extractImageUrl(imageHtml) {
        if (!imageHtml) return '';
        
        try {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = imageHtml;
            const imgTag = tempDiv.querySelector('img');
            
            if (imgTag) {
                const src = imgTag.getAttribute('src');
                return src.startsWith('/') 
                    ? window.location.origin + src 
                    : src;
            }
            return '';
        } catch (e) {
            console.error('Error parsing image HTML:', e);
            return '';
        }
    }
    navigateToProductDetail(event) {
        // Get the closest product card element in case children are clicked
        const cardElement = event.currentTarget.closest('[data-id]');
        
        if (!cardElement) {
            console.error('No product card element found');
            return;
        }
    
        const productId = cardElement.dataset.id;
        const productName = cardElement.dataset.name;
    
        if (!productId) {
            console.error('Product ID is undefined');
            return;
        }
    
        const encodedName = encodeURIComponent(
            (productName || 'product').replace(/\s+/g, '-').toLowerCase()
        );
    
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: `/product/${encodedName}/${productId}`
            }
        });
    }

    get hasProducts() {
        return this.products && this.products.length > 0;
    }

    get shouldShowLoading() {
        return this.isLoading && !this.error;
    }

    get shouldShowError() {
        return this.error && !this.isLoading;
    }

    get shouldShowProducts() {
        return !this.isLoading && !this.error && this.hasProducts;
    }

    get shouldShowEmptyState() {
        return !this.isLoading && !this.error && !this.hasProducts;
    }
}