/* eslint-disable no-case-declarations */
import Splide from '@splidejs/splide';
import Hammer from 'hammerjs';
import { gsap } from 'gsap';
import DocumentManager from '../dom/elements';
import World from './world';
/*
 * Splide slideshow
 */
const splide = new Splide('.splide', { arrows: false, pagination: true });
// Hide pagination on mount
splide.on('pagination:mounted', (data) => {
  data.list.classList.add('splide__pagination--custom');
});
// Add our slideshow functionality
splide.mount();

function switchSlide(world: World, DOM: DocumentManager) {
// Play the slide sound, if it's already playing, reset so that
  // it will play whenever we move the slides
  world.soundManager.slidePlay();

  // Show or hide the reset button depending on the slide we're on
  DOM.toggleResetButton(splide.index > 0);

  const {
    instantTrackingHeadset, adaptor, controller, anchor,
  } = world.models;

  // Slide behaviour
  switch (splide.index) {
    case 0:
    case 1:
    case 2:
      // Show the headset for the first information slide
      instantTrackingHeadset.visible = true;

      // Hide the elements for slides we don't see
      adaptor.visible = false;
      controller.visible = false;
      anchor.visible = false;

      // Tween headset
      let y = 0;
      if (splide.index === 0) {
        y = 4;
      } else if (splide.index === 1) {
        y = 2.3;
      } else if (splide.index === 2) {
        y = 3.16;
      }

      gsap.to(instantTrackingHeadset.position, { x: 0.3, duration: 0.5, ease: 'power2.Out' });
      gsap.to(instantTrackingHeadset.rotation, { y, duration: 0.5, ease: 'power2.Out' });

      break;
    case 3:
      /*
        * Live hinged phone grips
      */
      // Show the headset for the third information slide
      instantTrackingHeadset.visible = true;

      // Hide the elements for slides we don't see
      controller.visible = false;
      anchor.visible = false;

      // Tween out adaptor to right then make it disappear
      gsap.fromTo(adaptor.position, { x: 0.1 }, { x: 10, duration: 0.5, ease: 'power2.Out' });
      setTimeout(() => { adaptor.visible = false; }, 500);

      // Tween headset to center and make sure it has rotated
      gsap.to(instantTrackingHeadset.position, { x: 0.3, duration: 0.5, ease: 'power2.Out' });
      gsap.to(instantTrackingHeadset.rotation, { y: 3.9, duration: 0.5, ease: 'power2.Out' });

      break;
    case 4:
      /*
             * Camera adaptor
             */
      // Show the adaptor for the fourth information slide
      adaptor.visible = true;
      // Tween in adaptor from right to center
      gsap.to(adaptor.position, { x: 0.1, duration: 0.5, ease: 'power2.Out' });

      // Hide the elements for slides we don't see
      controller.visible = false;
      anchor.visible = false;

      // Tween out headset to left then make it disappear
      gsap.fromTo(instantTrackingHeadset.position, { x: 0.3 }, { x: -10, duration: 1, ease: 'power2.Out' });
      setTimeout(() => { instantTrackingHeadset.visible = false; }, 500);

      // Tween out controller to right then make it disappear
      gsap.fromTo(controller.position, { x: -0.5 }, { x: 10, duration: 0.5, ease: 'power2.Out' });
      setTimeout(() => {
        controller.visible = false;
      }, 500);

      break;
    case 5:
      /*
             * Reinvented controllers
             */
      // Show the controller for the fifth information slide
      controller.visible = true;
      // Tween in controller from right to center
      gsap.to(controller.position, { x: -0.25, duration: 0.5, ease: 'power2.Out' });

      // Hide the elements for slides we don't see
      instantTrackingHeadset.visible = false;
      anchor.visible = false;

      // Tween out adaptor to left then make it disappear
      gsap.fromTo(adaptor.position, { x: 0.1 }, { x: -10, duration: 0.5, ease: 'power2.Out' });
      setTimeout(() => { adaptor.visible = false; }, 500);

      // Tween out anchor center to right then make it disappear
      gsap.fromTo(anchor.position, { x: 0 }, { x: 10, duration: 0.5, ease: 'power2.Out' });
      setTimeout(() => { anchor.visible = false; }, 500);

      break;
    case 6:
      /*
             * World anchors
             */
      // Show the anchor for the sixth information slide
      anchor.visible = true;
      // Tween in anchor from right to center
      gsap.to(anchor.position, { x: 0, duration: 0.5, ease: 'power2.Out' });

      // Hide the elements for slides we don't see
      adaptor.visible = false;
      instantTrackingHeadset.visible = false;

      // Tween out controller to left then make it disappear
      gsap.fromTo(controller.position, { x: -0.5 }, { x: -10, duration: 0.5, ease: 'power2.Out' });
      setTimeout(() => { controller.visible = false; }, 500);

      break;
    default:
      break;
  }
}

splide.on('pagination:updated', (data) => {
  // Show or hide the pagination bullets depending on the slide we're on
  if (splide.index > 0) {
    data.list.classList.remove('splide__pagination--custom');
  } else {
    data.list.classList.add('splide__pagination--custom');
  }
});

// Swipe screen, not just slides
const hammer = new Hammer(document.body);
hammer.on('swipeleft', () => {
  // Increase our slide index by one when we slipe left
  splide.go(splide.index + 1);
});
hammer.on('swiperight', () => {
  // Decrease our slide index by one when we slipe left
  splide.go(splide.index - 1);
});

export default {
  switchSlide,
  splide,
  gsap,
};
