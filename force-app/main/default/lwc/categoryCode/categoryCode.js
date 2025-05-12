import { LightningElement } from 'lwc';

export default class CategoryCode extends LightningElement {
    categories = [
        {
          label: 'Computing & Gaming',
          image: 'https://i.imgur.com/7Csk3BP.png', 
          link: '/category/computing-gaming/0ZGQy0000002v73OAA'
        },
        {
          label: 'Smartphones & Accessories',
          image: 'https://i.imgur.com/IyQCcAh.png',
          link: '/category/smartphones-accessories/0ZGQy0000002vjlOAA'
        },
        {
          label: 'Multimedia',
          image: 'https://i.imgur.com/Wkjh7Ow.png',
          link: '/category/multimedia/0ZGQy0000002vmzOAA'
        },
        {
          label: 'Home Appliances',
          image: 'https://i.imgur.com/fb3tyZs.png',
          link: '/category/home-appliances/0ZGQy0000003GGLOA2'
        }
      ];
}