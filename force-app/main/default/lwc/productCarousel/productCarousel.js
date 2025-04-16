import { LightningElement } from 'lwc';

export default class ProductCarousel extends LightningElement {
  currentIndex = 0;

  rawSlides = [
    {
      id: 1,
      imageUrl: 'https://i.imgur.com/gmClIgm.png',
      alt: 'iPhone 16 Promo'
    },
    {
      id: 2,
      imageUrl: 'https://i.imgur.com/DYubohp.png',
      alt: 'PS5 WireLess Controller'
    },
    {
        id: 3,
        imageUrl: 'https://i.imgur.com/AWBJWAD.png',
        alt: 'Luxury Smart Watch'
      }
    
  ];

  get slides() {
    return this.rawSlides.map((slide, index) => ({
      ...slide,
      dotClass: index === this.currentIndex ? 'dot active' : 'dot',
      index
    }));
  }

  connectedCallback() {
    this.startAutoSlide();
  }

  disconnectedCallback() {
    clearInterval(this.autoSlideTimer);
  }

  startAutoSlide() {
    this.autoSlideTimer = setInterval(() => {
      this.scrollRight(true);
    }, 5000); // 5 seconds
  }

  scrollLeft() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.rawSlides.length - 1; // loop to end
    }
    this.scrollToCurrentSlide();
  }

  scrollRight(fromTimer = false) {
    if (this.currentIndex < this.rawSlides.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0; // loop to start
    }
    this.scrollToCurrentSlide();
  }

  scrollToCurrentSlide() {
    const track = this.template.querySelector('.carousel-track');
    const slideWidth = track.offsetWidth;
    track.scrollTo({
      left: slideWidth * this.currentIndex,
      behavior: 'smooth'
    });
  }

  goToSlide(event) {
    const index = parseInt(event.target.dataset.index, 10);
    this.currentIndex = index;
    this.scrollToCurrentSlide();
  }

  get isFirstSlide() {
    return this.currentIndex === 0;
  }

  get isLastSlide() {
    return this.currentIndex === this.rawSlides.length - 1;
  }
}
