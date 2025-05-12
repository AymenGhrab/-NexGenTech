import { LightningElement , track } from 'lwc';

export default class Customlogin extends LightningElement {
    @track email = '';
    @track password = '';

    handleEmailChange(event) {
        this.email = event.target.value;
    }

    handlePasswordChange(event) {
        this.password = event.target.value;
    }

    handleLogin() {
        window.location.href = '/secur/login_page.jsp?un=' + encodeURIComponent(this.email);
    }
}