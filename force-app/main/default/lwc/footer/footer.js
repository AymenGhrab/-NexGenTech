import { LightningElement, track } from 'lwc';
import isUserAuthenticated from '@salesforce/apex/NewsletterController.isUserAuthenticated';
import getAuthenticatedUserDetails from '@salesforce/apex/NewsletterController.getAuthenticatedUserDetails';
import isEmailSubscribed from '@salesforce/apex/NewsletterController.isEmailSubscribed';
import subscribeToNewsletter from '@salesforce/apex/NewsletterController.subscribeToNewsletter';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Footer extends LightningElement {
    @track isAuthenticated = false;
    @track email = '';
    @track isSubmitting = false;
    @track showSuccess = false;
    type = 'ProjectEL';

    connectedCallback() {
        this.checkAuth();
    }

    checkAuth() {
        isUserAuthenticated()
            .then(result => {
                this.isAuthenticated = result;
                if (result) {
                    this.loadUserEmail();
                }
            })
            .catch(error => {
                this.showToast('Error', 'Unable to check login status', 'error');
                console.error(error);
            });
    }

    loadUserEmail() {
        getAuthenticatedUserDetails()
            .then(user => {
                this.email = user.email;
            })
            .catch(error => {
                this.showToast('Error', 'Could not fetch user email', 'error');
                console.error(error);
            });
    }

    handleEmailChange(event) {
        this.email = event.target.value;
    }

    handleSubscribe() {
        if (!this.validateEmail(this.email)) {
            this.showToast('Invalid Email', 'Please enter a valid email address.', 'error');
            return;
        }

        this.isSubmitting = true;
        const name = 'NS-' + new Date().toISOString().replace(/[-:.TZ]/g, '');

        isEmailSubscribed({ email: this.email })
            .then(isSubscribed => {
                if (isSubscribed) {
                    this.showToast('Already Subscribed', 'This email is already subscribed.', 'info');
                } else {
                    subscribeToNewsletter({ email: this.email, type: this.type, name })
                        .then(result => {
                            if (result === 'success') {
                                this.showSuccess = true;
                                this.showToast('Success', 'You have been subscribed!', 'success');
                                if (!this.isAuthenticated) this.email = '';
                            } else {
                                this.showToast('Notice', 'You are already subscribed.', 'info');
                            }
                        })
                        .catch(error => {
                            this.showToast('Error', 'Failed to subscribe.', 'error');
                            console.error(error);
                        });
                }
            })
            .catch(error => {
                this.showToast('Error', 'Could not check subscription.', 'error');
                console.error(error);
            })
            .finally(() => {
                this.isSubmitting = false;
            });
    }

    validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({ title, message, variant })
        );
    }
}
