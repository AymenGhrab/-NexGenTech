import { LightningElement, api } from 'lwc';

export default class PromoCard extends LightningElement {
    @api title;
    @api description;
    @api ctaLabel;
    @api ctaLink;
    @api background;
    get backgroundStyle() {
        return `background-image: url('${this.background}');`;
    }
}
