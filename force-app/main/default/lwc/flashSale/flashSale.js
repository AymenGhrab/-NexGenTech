import { LightningElement, wire } from 'lwc';
import getProducts from '@salesforce/apex/ProductController.getProducts';

export default class FlashSales extends LightningElement {
    products = [];
    countdown = '';

    connectedCallback() {
        this.startCountdown();
    }

    startCountdown() {
        const targetTime = new Date();
        targetTime.setHours(23, 59, 59, 999); // End of day

        const interval = setInterval(() => {
            const now = new Date();
            const distance = targetTime - now;

            if (distance <= 0) {
                this.countdown = '00:00:00';
                clearInterval(interval);
                return;
            }

            const hours = String(Math.floor((distance / (1000 * 60 * 60)) % 24)).padStart(2, '0');
            const minutes = String(Math.floor((distance / (1000 * 60)) % 60)).padStart(2, '0');
            const seconds = String(Math.floor((distance / 1000) % 60)).padStart(2, '0');

            this.countdown = `${hours}:${minutes}:${seconds}`;
        }, 1000);
    }

    @wire(getProducts)
    wiredProducts({ error, data }) {
        if (data) {
            this.products = data.map((product, index) => {
                const discounts = [40, 35, 30, 25, 25];
                const discount = discounts[index % discounts.length];
                const price = product.Price__c;
                const originalPrice = (price / (1 - discount / 100)).toFixed(2);

                return {
                    ...product,
                    discount,
                    discountedPrice: price,
                    originalPrice,
                    rating: (4 + (index % 2) + Math.random() * 0.5).toFixed(1),
                    ratingCount: Math.floor(70 + Math.random() * 30),
                    actionLabel: index === 1 ? 'Add To Cart' : ''
                };
            });
        } else if (error) {
            console.error(error);
        }
    }
}
