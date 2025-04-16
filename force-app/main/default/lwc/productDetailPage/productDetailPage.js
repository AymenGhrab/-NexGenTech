import { LightningElement, api, wire, track } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { getRecord } from 'lightning/uiRecordApi';
import getProductDetails from '@salesforce/apex/ProductController.getProductDetails';


const PRODUCT_FIELDS = [
    'Product2.Name',
    'Product2.Description__c',
    'Product2.Image__c',
    'Product2.Price__c'

];

export default class ProductDetailPage extends LightningElement {
    @api recordId;
    @track product;
    @track error;
    @track selectedColor;
    @track selectedSize;
    @track quantity = 1;
    @track showAddedToCart = false;

    // Tier pricing from your example
    tierPricing = [
        { min: 20, max: 60, discount: 60 },
        { min: 61, max: 100, discount: 60 },
        { min: 101, max: 200, discount: 70 }
    ];

    @wire(getProductDetails, { productId: '$recordId' })
    wiredProduct({ error, data }) {
        if (data) {
            this.product = {
                ...data,
                displayPrice: this.calculateDisplayPrice(data.Price__c, data.Discount__c),
                imageUrl: this.extractImageUrl(data.Image__c)
            };
        } else if (error) {
            this.error = error;
        }
    }

    calculateDisplayPrice(basePrice, discount) {
        if (!discount) return basePrice;
        const discountedPrice = basePrice * (1 - (discount/100));
        return discountedPrice.toFixed(2);
    }

    extractImageUrl(imageHtml) {
        if (!imageHtml) return '';
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = imageHtml;
        const imgTag = tempDiv.querySelector('img');
        return imgTag ? imgTag.src : '';
    }

    handleColorChange(event) {
        this.selectedColor = event.target.value;
    }

    handleSizeChange(event) {
        this.selectedSize = event.target.value;
    }

    handleQuantityChange(event) {
        this.quantity = parseInt(event.target.value, 10);
    }

    addToCart() {
        // Implement cart integration here
        this.showAddedToCart = true;
        setTimeout(() => {
            this.showAddedToCart = false;
        }, 3000);
    }

    get tieredPricingTable() {
        return this.tierPricing.map(tier => ({
            ...tier,
            pricePerUnit: (this.product.Price__c * (1 - (tier.discount/100))).toFixed(2)
        }));
    }

    get hasVariants() {
        return this.selectedColor || this.selectedSize;
    }

    get isAddToCartDisabled() {
        return !this.hasVariants || !this.quantity;
    }
}