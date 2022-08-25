/// Zappar for ThreeJS Examples
/// Instant Tracking 3D Model

// In this example we track a 3D model using instant world tracking

import './index.css';
import './splide.min.css';
import World from './scene/world';
import DocumentManager from './dom/elements';
import Renderer from './scene/renderer';
import AnimationHandler from './scene/animator';
/*
 * Common variables
*/

class Experience {
  private instantTrackerPlaced:boolean = false;

  private userFacing:boolean = false;

  private showPhone:boolean = false;

  private renderer = new Renderer();

  private world = new World(this.renderer);

  private DOM = new DocumentManager(this.world, AnimationHandler);

  public constructor() {
    this.world.load().then(() => {
      this.renderer.setAnimationLoop(
        () => this.render(),
      );
      this.DOM.initialiseButtons(
        () => this.togglePlacement(),
        () => this.flipCamera(),
        () => this.togglePhone(),
        () => this.startInstantTracking(),
      );
    });
  }

  /*
  * Initialise instant-tracking scene function
  */
  private startInstantTracking(): void {
    const {
      instantTrackingHeadset, adaptor, controller, anchor,
    } = this.world.models;

    AnimationHandler.splide.on('move', () => AnimationHandler.switchSlide(this.world, this.DOM));
    // Disable face tracking and hide the group
    this.world.trackers.face.enabled = false;
    this.world.trackerGroups.face.visible = false;

    // Start the rear-facing camera
    this.world.camera.start(false);
    this.userFacing = false;

    // Now enable our instant tracking and show the UI
    this.world.trackers.instant.enabled = true;
    this.world.trackerGroups.instant.visible = true;

    this.DOM.instantTrackingState();

    // Reset the position so it's easier to place
    instantTrackingHeadset.position.y = 0.5;
    adaptor.position.y = 0.2;
    controller.position.y = 0.5;
    anchor.position.y = 0.35;
  }

  /*
  * Initialise face-tracking scene function
  */
  private startFaceTracking():void {
    AnimationHandler.splide.off('move');
    // Disable instant world tracking and hide the group
    this.world.trackers.instant.enabled = false;
    this.world.trackerGroups.instant.visible = false;
    this.DOM.faceTrackingState();

    // Start the user-facing camera
    this.world.camera.start(true);
    this.userFacing = true;
    // Now enable our face tracking and show the UIdefaultButtonSoundPlay
    this.world.trackers.face.enabled = true;
  }

  /*
  * Flip Camera function
  */
  private flipCamera():void {
    // Start the button sound
    this.world.soundManager.defaultButtonSoundPlay();
    this.world.enableEnvironmentMap(this.userFacing);
    if (!this.userFacing) {
      this.startFaceTracking();
    } else {
      this.startInstantTracking();
    }
    this.instantTrackerPlaced = false;
  }

  /*
  * Placement button function
  */
  private togglePlacement():void {
    // When the experience loads we'll let the user choose a place in their room for
    // the content to appear using setAnchorPoseFromCameraOffset (see below)
    // The user can confirm the location by tapping on the screen
    this.world.soundManager.defaultButtonSoundPlay();

    // If we haven't placed when the button has been tapped...
    this.DOM.isPlacedUIState(this.instantTrackerPlaced);

    this.instantTrackerPlaced = !this.instantTrackerPlaced;
  }

  /*
  * Toggle phone function
  */
  private togglePhone():void {
    // Start the button sound
    this.world.soundManager.defaultButtonSoundPlay();
    this.DOM.togglePhoneUI(this.showPhone);

    this.world.models.phone.visible = !this.showPhone;
    this.showPhone = !this.showPhone;
  }

  // Use a function to render our scene as usual
  public render() {
    if (!this.instantTrackerPlaced) {
    // If the user hasn't chosen a place in their room yet, update the instant tracker
    // to be directly in front of the user
      this.world.trackerGroups.instant.setAnchorPoseFromCameraOffset(0, 0, -2);
    }
    this.world.update();
    // Draw the ThreeJS scene in the usual way, but using the Zappar camera
    this.renderer.render(this.world.scene, this.world.camera);
  }
}

const experience = new Experience();

console.log(experience);
