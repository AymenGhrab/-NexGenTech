import { LightningElement, wire } from 'lwc';
import getProducts from '@salesforce/apex/ProductController.getProducts';

export default class ProductList extends LightningElement {
    products = [];

    @wire(getProducts)
    wiredProducts({ error, data }) {
        if (data) {
            console.log('Raw Product Data:', data); // Log full data for debugging

            this.products = data.map(product => {
                const imageUrl = this.extractImageUrl(product.Image__c);
                console.log(`Extracted Image URL for ${product.Name}:`, imageUrl); // Log extracted URL

                return {
                    ...product,
                    Image_URL: imageUrl
                };
            });
        } else if (error) {
            console.error('Error fetching products', error);
        }
    }

    extractImageUrl(imageHtml) {
        if (!imageHtml) return ''; // Handle null or undefined values

        // Create a temporary DOM element to parse the HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = imageHtml;
        const imgTag = tempDiv.querySelector('img');

        if (imgTag) {
            const src = imgTag.getAttribute('src');
            // If the URL is relative (starts with '/'), make it absolute
            if (src.startsWith('/')) {
                return window.location.origin + src;
            }
            return src;
        }
        return ''; // Return empty string if no image is found
    }
}