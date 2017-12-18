export function THREESIXTYcameracontrol(){
		self.controls = new PointerLockControls( self.camera, self.sphereBody );
		clickToStart();
		//render full screen experience (desktop)
		self.deviceRendered = self.renderer;
		//once controls have been set, add them to the scene
		self.scene.add( self.controls.getObject() );
}

/*** CONTROLS FOR MOVING THE CAMERA IN MODEL MODE ***/
export function MODELcameracontrol(){
	let blocker = document.getElementById( 'blocker' );
	blocker.style.display = 'none';
	self.camera.position.z = 50;
	self.camera.position.y = 30;
	self.deviceRendered = self.renderer;
	self.controls = new THREE.OrbitControls( self.camera, self.deviceRendered.domElement );
	// self.controls.addEventListener( 'change', render ); // remove when using animation loop
	
	// enable animation loop when using damping or autorotation
	//controls.enableDamping = true;
	//controls.dampingFactor = 0.25;
	self.controls.enableZoom = false;
}


/*** CONTROLS FOR MOVING THE CAMERA IN VR MODE ***/
export function VRcameracontrol(){
	// Pass camera and DOM element into the OrbitControls so that event listeners can be attached
	let blocker = document.getElementById( 'blocker' );
	let havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
	clickToStart();
	if(self.flyControls && !self.ismobile) {
	    self.controls = new THREE.FlyControls(self.camera);
	    self.controls.movementSpeed = 25;
	    self.controls.rollSpeed = Math.PI / 6;
	    self.controls.autoForward = false;
	    self.controls.dragToLook = false;

	    self.deviceRendered = self.renderer;

	    self.controls.mouseMovement = false;
		self.controls.enabled = false;
		self.controlsEnabled = false;
		// blocker.style.display = 'none';
	} else if ( havePointerLock && !self.flyControls) {
	// if ( havePointerLock ) {
		self.controls = new PointerLockControls( self.camera, self.sphereBody );
		// self.controls.mouseMovement = true;
		// self.controls = new PointerLockControls( self.camera, camPhysics );
		// clickToStart();
		//render full screen experience (desktop)
		self.deviceRendered = self.renderer;
		//once controls have been set, add them to the scene
		self.scene.add( self.controls.getObject() );
	} else if(!havePointerLock && !self.ismobile) {

		instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

	} else if(self.ismobile){
		// blocker.style.display = 'none';
		// self.controls = new THREE.FirstPersonControls(self.camera);
		// self.controls.movementSpeed = 1000;

		// onOrientationChange();
		window.addEventListener('touchend', fullscreen); // hide address bar
		window.addEventListener('orientationchange', doOnOrientationChange);
		// window.addEventListener('orientationchange', cardBoardView);
		cardBoardView();

		function doOnOrientationChange() {	
			self.deviceRendered.setSize( window.innerWidth, window.innerHeight );
		}

		function cardBoardView() {	
			// landscape vrMode
		    // if(window.orientation == -90 || window.orientation == 90) self.deviceRendered = self.effect;  
		    // else self.deviceRendered = self.renderer; // portrait full screen mode
		    self.deviceRendered = self.renderer;
		    // Set the camera controller to the orientation of the phone.
		    self.controls = new THREE.DeviceOrientationControls(self.camera, true);
		    self.controls.mouseMovement = false;
		  	// Use DeviceOrientationControls object to set up new camera controls.
		  	self.controls.connect();
		  	// Finish updating the camera controls.
		  	self.camera.position.set(0, self.cameraHeight*30, 30);
		  	self.controls.update();
		  	self.controls.movementSpeed = self.cameraMovement;
		    self.deviceRendered.setSize( window.innerWidth, window.innerHeight );
		}

		/*** FULL SCREEN WHEN ON VR HEADSET ***/
	  	function fullscreen() { //split screen for vr headset on mobile devices
	  		self.video.play();
		    if (self.container.requestFullscreen) {
		      self.container.requestFullscreen();
		    } else if (self.container.msRequestFullscreen) {
		      self.container.msRequestFullscreen();
		    } else if (self.container.mozRequestFullScreen) {
		      self.container.mozRequestFullScreen();
		    } else if (self.container.webkitRequestFullscreen) {
		      self.container.webkitRequestFullscreen();
		    }
		    window.removeEventListener('click', fullscreen, false); // hide address bar
		}

	}
	// Device orientation returns alpha, beta, gamma
	function setOrientationControls(e) {
	  // If alpha values aren't coming through, stop function
	  if (!e.alpha || e.alpha == null || e.alpha === false) return;
	  // Once the camera controller is set up, remove the event listener
	  window.removeEventListener('deviceorientation', setOrientationControls, true);		
	}
	// Detect motion of phone in vr device.
	window.addEventListener('deviceorientation', setOrientationControls, true);
}	



/*** CONTROLS FOR MOVING THE CAMERA IN VR MODE ***/
export function ARcameracontrol(){
	// Pass camera and DOM element into the OrbitControls so that event listeners can be attached
	let blocker = document.getElementById( 'blocker' );
	let havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
	clickToStart();
	if(self.flyControls) {
	    self.controls = new THREE.FlyControls(self.camera);
	    self.controls.movementSpeed = 25;
	    self.controls.rollSpeed = Math.PI / 6;
	    self.controls.autoForward = false;
	    self.controls.dragToLook = false;

	    self.deviceRendered = self.renderer;

	    self.controls.mouseMovement = false;
		self.controls.enabled = false;
		self.controlsEnabled = false;
		// blocker.style.display = 'none';
	} else if ( havePointerLock && !self.flyControls && !self.arMarker) {
	// if ( havePointerLock ) {
		self.controls = new PointerLockControls( self.camera, self.sphereBody );
		// self.controls.mouseMovement = true;
		// self.controls = new PointerLockControls( self.camera, camPhysics );
		// clickToStart();
		//render full screen experience (desktop)
		self.deviceRendered = self.renderer;
		//once controls have been set, add them to the scene
		self.scene.add( self.controls.getObject() );
	} else if(!havePointerLock && !self.ismobile) {

		instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

	} else if(self.ismobile && !self.arMarker){
		// blocker.style.display = 'none';
		// self.controls = new THREE.FirstPersonControls(self.camera);
		// self.controls.movementSpeed = 1000;

		// onOrientationChange();
		window.addEventListener('touchend', fullscreen); // hide address bar
		window.addEventListener('orientationchange', doOnOrientationChange);
		// window.addEventListener('orientationchange', cardBoardView);
		cardBoardView();

		function doOnOrientationChange() {	
			self.deviceRendered.setSize( window.innerWidth, window.innerHeight );
		}

		function cardBoardView() {	
			// landscape vrMode
		    // if(window.orientation == -90 || window.orientation == 90) self.deviceRendered = self.effect;  
		    // else self.deviceRendered = self.renderer; // portrait full screen mode
		    self.deviceRendered = self.renderer;
		    // Set the camera controller to the orientation of the phone.
		    self.controls = new THREE.DeviceOrientationControls(self.camera, true);
		    self.controls.mouseMovement = false;
		  	// Use DeviceOrientationControls object to set up new camera controls.
		  	self.controls.connect();
		  	// Finish updating the camera controls.
		  	self.camera.position.set(0, self.cameraHeight*30, 30);
		  	self.controls.update();
		    self.deviceRendered.setSize( window.innerWidth, window.innerHeight );
		}

		/*** FULL SCREEN WHEN ON VR HEADSET ***/
	  	function fullscreen() { //split screen for vr headset on mobile devices
	  		self.video.play();
		    if (self.container.requestFullscreen) {
		      self.container.requestFullscreen();
		    } else if (self.container.msRequestFullscreen) {
		      self.container.msRequestFullscreen();
		    } else if (self.container.mozRequestFullScreen) {
		      self.container.mozRequestFullScreen();
		    } else if (self.container.webkitRequestFullscreen) {
		      self.container.webkitRequestFullscreen();
		    }
		    window.removeEventListener('click', fullscreen, false); // hide address bar
		} 

	} else if(self.arMarker) {
		////////////////////////////////////////////////////////////////////////////////
		//          Create a ArMarkerControls
		////////////////////////////////////////////////////////////////////////////////
		// init controls for camera
		self.markerControls = new THREEx.ArMarkerControls(self.arToolkitContext, self.camera, {
		  type : 'pattern',
		  // patternUrl : './assets/ar/patt.hiro',
	  	  patternUrl : self.arPattern,
		  // patternUrl : THREEx.ArToolkitContext.baseURL + '../data/data/patt.kanji',
		  // as we controls the camera, set changeMatrixMode: 'cameraTransformMatrix'
		  changeMatrixMode: 'cameraTransformMatrix'
		});
		// as we do changeMatrixMode: 'cameraTransformMatrix', start with invisible scene
		self.scene.visible = false;
		self.deviceRendered = self.renderer;
	}
	// Device orientation returns alpha, beta, gamma
	function setOrientationControls(e) {
	  // If alpha values aren't coming through, stop function
	  if (!e.alpha || e.alpha == null || e.alpha === false) return;
	  // Once the camera controller is set up, remove the event listener
	  window.removeEventListener('deviceorientation', setOrientationControls, true);		
	}
	// Detect motion of phone in vr device.
	window.addEventListener('deviceorientation', setOrientationControls, true);
}	


function clickToStart(){
	let instructions = document.getElementById( 'instructions' );
	let element = document.body;

	document.onkeypress = function (e) {
		if(!self.arMarker) {
		    e = e || window.event;
		    if(isInt(e.key)) flyLockChange();
		    // use e.keyCode
		} else {
			blocker.style.display = '';
		}
	};

	let pointerlockchange = function ( event ) {
		if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
			console.log("controls enabled");
			self.controlsEnabled = true;
			self.controls.enabled = true;
			blocker.style.display = 'none';
			instructions.style.display = 'none';
		} else {
			console.log("controls disabled");
			self.controls.enabled = false;
			self.controlsEnabled = false;
			blocker.style.display = '-webkit-box';
			blocker.style.display = '-moz-box';
			blocker.style.display = '';
			instructions.style.display = '';
		}
	};

	function flyLockChange(){
		if(!self.controls.mouseMovement) blocker.style.display = 'none';
		else blocker.style.display = '';
		self.controlsEnabled = true;
		self.controls.mouseMovement = !self.controls.mouseMovement;
	}




	var pointerlockerror = function ( event ) {
		instructions.style.display = '';
	};
 	// Hook pointer lock state change events
	document.addEventListener( 'pointerlockchange', pointerlockchange, false );
	document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
	document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

	document.addEventListener( 'pointerlockerror', pointerlockerror, false );
	document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
	document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

	if(!self.instructions) {
		blocker.style.display='none';
		instructions.style.display='none';
	}
	else {
		instructions.addEventListener( 'click', function ( event ) {
			// Ask the browser to lock the pointer
			if(self.flyControls) {
				flyLockChange();
			} else if (self.arMarker){
				blocker.style.display = 'none';
			} else {
				element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
				element.requestPointerLock();
			}
		}, false );
	}
}

function isInt(value) {

    var er = /^-?[0-9]+$/;

    return er.test(value);
}