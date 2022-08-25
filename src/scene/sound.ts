const buttonTonal = new URL('../../assets/button-tonal.wav', import.meta.url).href;
const cameraSnap = new URL('../../assets/camera-snap.ogg', import.meta.url).href;
const swoosh = new URL('../../assets/swoosh.wav', import.meta.url).href;
/*
 * Sounds
 */

class SoundManager {
  private sounds = {
    defaultButton: new Audio(buttonTonal),
    camera: new Audio(cameraSnap),
    slide: new Audio(swoosh),
  }

  /*
 * Default button sound function
 */
  public defaultButtonSoundPlay() {
  // Play the default button sound, if it's already playing,
  // reset so that it will play whenever we click on it
    if (this.sounds.defaultButton.paused) {
      this.sounds.defaultButton.play();
    } else {
      this.sounds.defaultButton.currentTime = 0;
    }
  }

  public slidePlay() {
    // Play the slide sound, if it's already playing, reset so that
    // it will play whenever we move the slides
    if (this.sounds.slide.paused) {
      this.sounds.slide.play();
    } else {
      this.sounds.slide.currentTime = 0;
    }
  }

  public cameraPlay() {
  // Play the camera sound, if it's already playing,
  // reset so that it will play whenever we click on it
    if (this.sounds.camera.paused) {
      this.sounds.camera.play();
    } else {
      this.sounds.camera.currentTime = 0;
    }
  }
}

export default SoundManager;
