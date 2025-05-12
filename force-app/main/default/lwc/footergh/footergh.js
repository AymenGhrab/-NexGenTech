import { LightningElement , track} from 'lwc';

export default class Footergh extends LightningElement {

    @track email = '';
    @track message = '';

    handleInputChange(event) {
        this.email = event.target.value;
    }

    subscribe() {
        if (this.validateEmail(this.email)) {
            // In real use: send this.email to backend or external service
            this.message = '✅ Subscription successful!';
            console.log(`Subscribed with email: ${this.email}`);
        } else {
            this.message = '❌ Please enter a valid email address.';
        }
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
}