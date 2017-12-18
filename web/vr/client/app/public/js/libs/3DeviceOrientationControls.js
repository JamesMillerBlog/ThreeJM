/* globals THREE */
/**
 * DeviceOrientationControls - applies device orientation on object rotation
 *
 * @param {Object} object - instance of THREE.Object3D
 * @constructor
 *
 * @author richt / http://richt.me
 * @author WestLangley / http://github.com/WestLangley
 * @author jonobr1 / http://jonobr1.com
 * @author arodic / http://aleksandarrodic.com
 * @author doug / http://github.com/doug
 *
 * W3C Device Orientation control
 * (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
 */

(function() {

  var deviceOrientation = {};
  var screenOrientation = window.orientation || 0;

  function onDeviceOrientationChangeEvent(evt) {
    deviceOrientation = evt;
  }
  window.addEventListener('deviceorientation', onDeviceOrientationChangeEvent, false);

  function getOrientation() {
    switch (window.screen.orientation || window.screen.mozOrientation) {
      case 'landscape-primary':
        return 90;
      case 'landscape-secondary':
        return -90;
      case 'portrait-secondary':
        return 180;
      case 'portrait-primary':
        return 0;
    }
    // this returns 90 if width is greater then height
    // and window orientation is undefined OR 0
    // if (!window.orientation && window.innerWidth > window.innerHeight)
    //   return 90;
    return window.orientation || 0;
  }

  function onScreenOrientationChangeEvent() {
    screenOrientation = getOrientation();
  }
  window.addEventListener('orientationchange', onScreenOrientationChangeEvent, false);


THREE.DeviceOrientationControls = function(object) {

  this.object = object;
  this.target = new THREE.Vector3( 0, 0, 0 );

  this.domElement = document;
  this.autoSpeedFactor = 0.0;
  this.lat = 0;
  this.lon = 0;
  this.phi = 0;
  this.theta = 0;

  this.object.rotation.reorder('YXZ');

  this.freeze = true;

  this.movementSpeed = 5.0;
  this.rollSpeed = 0.005;
  this.autoAlign = true;
  this.autoForward = false;

  this.alpha = 0;
  this.beta = 0;
  this.gamma = 0;
  this.orient = 0;

  this.alignQuaternion = new THREE.Quaternion();
  this.orientationQuaternion = new THREE.Quaternion();


  this.quaternion = new THREE.Quaternion();
  this.quaternionLerp = new THREE.Quaternion();

  this.tempVector3 = new THREE.Vector3();
  var tempMatrix4 = new THREE.Matrix4();
  var tempEuler = new THREE.Euler(0, 0, 0, 'YXZ');
  var tempQuaternion = new THREE.Quaternion();

  var zee = new THREE.Vector3(0, 0, 1);
  var up = new THREE.Vector3(0, 1, 0);
  var v0 = new THREE.Vector3(0, 0, 0);
  this.euler = new THREE.Euler();
  var q0 = new THREE.Quaternion(); // - PI/2 around the x-axis
  var q1 = new THREE.Quaternion(- Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));

  this.mouseMovement = null;




  this.moveStraight = function() {
    this.moveForward = true;
  }
  this.moveStop = function() {
    this.moveForward = false;
  }
  // window.addEventListener('mousedown', this.onMouseDown, false);
  this.domElement.addEventListener( 'touchstart', bind( this, this.moveStraight ), false );
  this.domElement.addEventListener( 'touchend', bind( this, this.moveStop ), false );
  // this.onMouseDown();

  this.update = (function(delta) {

    return function(delta) {

      if (this.freeze) return;

      if(this.mouseMovement){
        // should not need this
        //var orientation = getOrientation();
        //if (orientation !== this.screenOrientation) {
          //this.screenOrientation = orientation;
          //this.autoAlign = true;
        //}

        this.alpha = deviceOrientation.gamma ?
          THREE.Math.degToRad(deviceOrientation.alpha) : 0; // Z
        this.beta = deviceOrientation.beta ?
          THREE.Math.degToRad(deviceOrientation.beta) : 0; // X'
        this.gamma = deviceOrientation.gamma ?
          THREE.Math.degToRad(deviceOrientation.gamma) : 0; // Y''
        this.orient = screenOrientation ?
          THREE.Math.degToRad(screenOrientation) : 0; // O

        // The angles alpha, beta and gamma
        // form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

        // 'ZXY' for the device, but 'YXZ' for us
        this.euler.set(this.beta, this.alpha, - this.gamma, 'YXZ');

        this.quaternion.setFromEuler(this.euler);
        this.quaternionLerp.slerp(this.quaternion, 0.5); // interpolate

        // orient the device
        if (this.autoAlign) this.orientationQuaternion.copy(this.quaternion); // interpolation breaks the auto alignment
        else this.orientationQuaternion.copy(this.quaternionLerp);

        // camera looks out the back of the device, not the top
        this.orientationQuaternion.multiply(q1);

        // adjust for screen orientation
        this.orientationQuaternion.multiply(q0.setFromAxisAngle(zee, - this.orient));

        this.object.quaternion.copy(this.alignQuaternion);
        this.object.quaternion.multiply(this.orientationQuaternion);

        if (this.autoForward) {

          this.tempVector3
            .set(0, 0, -1)
            .applyQuaternion(this.object.quaternion, 'ZXY')
            .setLength(this.movementSpeed / 50); // TODO: why 50 :S

          this.object.position.add(this.tempVector3);
        }

        if (this.autoAlign && this.alpha !== 0) {

          this.autoAlign = false;

          this.align();

        }

        var actualMoveSpeed = delta * this.movementSpeed;

        if ( this.moveForward ) this.object.translateZ( - actualMoveSpeed );
        
      }

      
    };

  })();
    function bind( scope, fn ) {
      return function () {

        fn.apply( scope, arguments );

      };

    };

  // //debug
  // window.addEventListener('click', (function(){
  //   this.align();
  // }).bind(this));

  this.align = function() {

    this.tempVector3
      .set(0, 0, -1)
      .applyQuaternion( tempQuaternion.copy(this.orientationQuaternion).inverse(), 'ZXY' );

    tempEuler.setFromQuaternion(
      tempQuaternion.setFromRotationMatrix(
        tempMatrix4.lookAt(this.tempVector3, v0, up)
     )
   );
    tempEuler.set(0, 0, 0);
    this.alignQuaternion.setFromEuler(tempEuler);

  };

  this.connect = function() {
    this.freeze = false;
  };

  this.disconnect = function() {
    this.freeze = true;
  };

};

})();

