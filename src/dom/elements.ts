/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
import * as ZapparThree from '@zappar/zappar-threejs';
import World from '../scene/world';

class DocumentManager {
  private static loadingTextScene:HTMLElement = document.getElementById('loading-text-section')!;

  private static splashScreenScene:HTMLElement = document.getElementById('splash-screen-scene')!;

  private static instantTrackingScene:HTMLElement = document.getElementById('instant-tracking-scene')!;

  private static faceTrackingScene:HTMLElement = document.getElementById('face-tracking-scene')!;

  private static launchBtn:HTMLElement = document.getElementById('launch-btn')!;

  private static placementUI:HTMLElement = document.getElementById('zappar-placement-ui')!;

  private static replacementUI:HTMLElement = document.getElementById('zappar-replacement-ui')!;

  private static resetBtn:HTMLElement = document.getElementById('reset-btn')!;

  private static tryOnBtn:HTMLElement = document.getElementById('try-on-btn')!;

  private static backBtn:HTMLElement = document.getElementById('back-btn')!;

  private static snapshotBtn:HTMLElement = document.getElementById('snapshot-btn')!;

  private static phoneToggleBtn:HTMLElement = document.getElementById('phone-toggle-btn')!;

  constructor(private world: World, private AnimationHandler: any) {
    window.onload = () => {
      DocumentManager.splashScreenScene.classList.remove('hidden');
      DocumentManager.splashScreenScene.classList.add('visible');
    };
    // Handle unsupported browsers.
    this.compatibilityCheck();
  }

  public compatibilityCheck():void {
    // The SDK is supported on many different browsers, but there are some that
    // don't provide camera access. This function detects if the browser is supported
    // For more information on support, check out the readme over at
    // https://www.npmjs.com/package/@zappar/zappar-threejs
    if (ZapparThree.browserIncompatible()) {
      // The browserIncompatibleUI() function shows a full-page dialog that informs the user
      // they're using an unsupported browser, and provides a button to 'copy' the current page
      // URL so they can 'paste' it into the address bar of a compatible alternative.
      ZapparThree.browserIncompatibleUI();

      // If the browser is not compatible, we can avoid setting up the rest of the page
      // so we throw an exception here.
      throw new Error('Unsupported browser');
    }
  }

  public isPlacedUIState(hasPlaced: boolean) {
    if (!hasPlaced) {
      DocumentManager.placementUI.classList.remove('visible');
      DocumentManager.placementUI.classList.add('hidden');
      DocumentManager.replacementUI.classList.add('visible');
      DocumentManager.replacementUI.classList.remove('hidden');
    } else {
      DocumentManager.placementUI.classList.add('visible');
      DocumentManager.placementUI.classList.remove('hidden');
      DocumentManager.replacementUI.classList.add('hidden');
      DocumentManager.replacementUI.classList.remove('visible');
    }
  }

  public faceTrackingState():void {
    DocumentManager.instantTrackingScene.classList.remove('visible');
    DocumentManager.instantTrackingScene.classList.add('hidden');

    DocumentManager.placementUI.classList.remove('visible');
    DocumentManager.placementUI.classList.add('hidden');
    DocumentManager.placementUI.classList.remove('visible');
    DocumentManager.placementUI.classList.add('hidden');

    DocumentManager.faceTrackingScene.classList.remove('hidden');
    DocumentManager.faceTrackingScene.classList.add('visible');
  }

  public instantTrackingState():void {
    // Disable face tracking and hide the group
    DocumentManager.faceTrackingScene.classList.remove('visible');
    DocumentManager.faceTrackingScene.classList.add('hidden');

    // Show the placement UI
    DocumentManager.replacementUI.classList.remove('visible');
    DocumentManager.replacementUI.classList.add('hidden');
    DocumentManager.placementUI.classList.remove('hidden');
    DocumentManager.placementUI.classList.add('visible');

    DocumentManager.instantTrackingScene.classList.remove('hidden');
    DocumentManager.instantTrackingScene.classList.add('visible');
  }

  public togglePhoneUI(showPhone: boolean):void {
    if (!showPhone) {
      DocumentManager.phoneToggleBtn.classList.remove('half-opacity');
      DocumentManager.phoneToggleBtn.classList.add('full-opacity');
    } else {
      DocumentManager.phoneToggleBtn.classList.remove('full-opacity');
      DocumentManager.phoneToggleBtn.classList.add('half-opacity');
    }
  }

  public launchButtonPressed() : void {
    DocumentManager.loadingTextScene.style.display = 'flex';
    DocumentManager.instantTrackingScene.style.display = 'block';

    DocumentManager.splashScreenScene.classList.remove('visible');
    DocumentManager.splashScreenScene.classList.add('hidden');
  }

  public hideLaunchScreen() : void {
    DocumentManager.splashScreenScene.style.display = 'none';
  }

  public initialiseButtons(
    placement: ()=> void,
    flipCamera: ()=> void,
    togglePhone: () => void,
    onPermissionGranted: () => void,
  ) {
    /*
  * Placement buttons
  */
    DocumentManager.placementUI?.addEventListener('click', () => {
      placement();
    });
    DocumentManager.replacementUI?.addEventListener('click', () => {
      placement();
    });

    /*
  * Try on button
  */
    DocumentManager.tryOnBtn?.addEventListener('click', () => {
      flipCamera();
    });

    /*
  * Back Button
  */
    DocumentManager.backBtn?.addEventListener('click', () => {
      flipCamera();
    });

    /*
  * Snapshot button
  */
    DocumentManager.snapshotBtn?.addEventListener('click', () => {
      this.world.takeSnapshot();
    });

    /*
  * Phone toggle button
  */
    DocumentManager.phoneToggleBtn?.addEventListener('click', () => {
      togglePhone();
    });

    /*
  * Reset button
  */
    DocumentManager.resetBtn?.addEventListener('click', () => {
      // Start the button sound
      this.world.soundManager.defaultButtonSoundPlay();
      // Take us to the first slide
      this.AnimationHandler.splide.go(0);
    });

    DocumentManager.launchBtn?.addEventListener('click', () => {
      // Start the button sound
      this.world.soundManager.defaultButtonSoundPlay();

      // In order to use camera and motion data, we need to ask the users for permission
      // The Zappar library comes with some UI to help with that, so let's use it
      ZapparThree.permissionRequestUI().then((granted) => {
        // If the user granted us the permissions we need then we can start the camera
        // Otherwise let's them know that it's necessary with Zappar's permission denied UI
        if (granted) onPermissionGranted();
        else ZapparThree.permissionDeniedUI();
      });

      this.launchButtonPressed();

      setTimeout(() => {
        this.hideLaunchScreen();
      }, 500);
    });
  }

  public toggleResetButton(active: boolean) : void {
    if (active) {
      DocumentManager.resetBtn.classList.remove('hidden');
      DocumentManager.resetBtn.classList.add('visible');
    } else {
      DocumentManager.resetBtn.classList.remove('visible');
      DocumentManager.resetBtn.classList.add('hidden');
    }
  }
}

export default DocumentManager;
