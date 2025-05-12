import { LightningElement, track } from 'lwc';
import getReviewsForProduct from '@salesforce/apex/ProductController.getReviewsForProduct';
import submitReviewApex from '@salesforce/apex/ProductController.submitReview';

export default class ProductReview extends LightningElement {
    @track reviews = [];
    @track error = false;
    @track errorMessage = '';
    recordId;

    title = '';
    rating = 5;
    currentPage = 1;
    pageSize = 3;

    connectedCallback() {
        const path = window.location.pathname;
        const segments = path.split('/');
        const lastPart = segments[segments.length - 1];
        if (lastPart.startsWith('01t')) {
            this.recordId = lastPart;
            this.loadReviews();
        } else {
            this.error = true;
            this.errorMessage = 'No valid product ID found in URL';
        }
    }

    loadReviews() {
        getReviewsForProduct({ productId: this.recordId })
            .then(data => {
                this.reviews = data.map(r => {
                    const stars = Array.from({ length: 5 }, (_, i) => ({
                        cssClass: i < r.ProductRating__c ? 'star-filled' : 'star-empty',
                        id: `${r.Id}_${i}`
                    }));
                    return { ...r, stars };
                });
                this.error = false;
            })
            .catch(() => {
                this.error = true;
                this.errorMessage = 'Error loading reviews';
            });
    }

    handleTitleChange(event) {
        this.title = event.target.value;
    }

    handleStarClick(event) {
        const index = parseInt(event.target.dataset.index, 10);
        this.rating = index + 1;
    }

    submitReview() {
        submitReviewApex({
            productId: this.recordId,
            title: this.title,
            rating: this.rating
        })
        .then(() => {
            const newReview = {
                Name: this.title,
                ProductRating__c: this.rating,
                CreatedDate: new Date().toISOString(),
                Id: 'local_' + Date.now(),
                stars: Array.from({ length: 5 }, (_, i) => ({
                    cssClass: i < this.rating ? 'star-filled' : 'star-empty',
                    id: `local_${i}`
                }))
            };

            this.reviews = [newReview, ...this.reviews];
            this.title = '';
            this.rating = 5;
            this.error = false;
            this.currentPage = 1;
        })
        .catch(error => {
            this.error = true;
            this.errorMessage = error.body?.message || 'Error submitting review';
        });
    }

    get starArray() {
        return [0, 1, 2, 3, 4].map(i => ({
            key: `star_${i}`,
            index: i,
            cssClass: i < this.rating ? 'star-filled' : 'star-empty'
        }));
    }

    get paginatedReviews() {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        return this.reviews.slice(start, end);
    }

    get isFirstPage() {
        return this.currentPage === 1;
    }

    get isLastPage() {
        return this.reviews && this.currentPage >= Math.ceil(this.reviews.length / this.pageSize);
    }

    nextPage() {
        if (!this.isLastPage) {
            this.currentPage++;
        }
    }

    prevPage() {
        if (!this.isFirstPage) {
            this.currentPage--;
        }
    }
}
