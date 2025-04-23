import { LightningElement } from 'lwc';

export default class BenefitsSection extends LightningElement {
    benefits = [
        {
            id: 1,
            title: 'FREE AND FAST DELIVERY',
            description: 'Free delivery for all orders over $140',
            icon: 'https://i.imgur.com/IZZwp8o.png' // Replace with your uploaded static resource path
        },
        {
            id: 2,
            title: '24/7 CUSTOMER SERVICE',
            description: 'Friendly 24/7 customer support',
            icon: 'https://i.imgur.com/3O4pBAC.png'
        },
        {
            id: 3,
            title: 'MONEY BACK GUARANTEE',
            description: 'We return money within 30 days',
            icon: 'https://i.imgur.com/qyhaaTf.png'
        }
    ];
}
