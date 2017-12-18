


/*** STARTING THE THREE.JS SCENE ***/
export function setup(mode){
	//creates an object that allows where 3D elements can be rendered + placed
	self.scene = new THREE.Scene();
	// PerspectiveCamera(FOV, aspect, near, far).

	// FOV = the vertical field of view for the camera.
	// Aspect =  the aspect ratio for the camera. Normally width/ height or can also be set to 1.
	// Near + Far = only elements between the near and far values from our camera are rendered.
	if(mode != "ar") {
		self.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100000 );
		self.camera.position.set(0, self.cameraHeight, 0);
	}
	else self.camera = new THREE.Camera();
	// Camera.position.set(x,y,z)
	self.scene.add(self.camera);
	

	if(mode == 'vr' || mode == "ar" || mode == 'threesixty') {
		// --- Reticulum ---
		// initiate Reticulum so it loads up 
		Reticulum.init(self.camera, {
			proximity: false,
			clickevents: true,
			near: null, //near factor of the raycaster (shouldn't be negative and should be smaller than the far property)
			far: null, //far factor of the raycaster (shouldn't be negative and should be larger than the near property)
			reticle: {
				visible: true,
				restPoint: 10, //Defines the reticle's resting point when no object has been targeted
				color: 0xcc00cc,
				innerRadius: 0.0001,
				outerRadius: 0.003,
				hover: {
					color: 0x00cccc,
					innerRadius: 0.02,
					outerRadius: 0.024,
					speed: 5,
					vibrate: 50 //Set to 0 or [] to disable
				}
			},
			fuse: {
				visible: true,
				duration: 2.5,
				color: 0x00fff6,
				innerRadius: 0.045,
				outerRadius: 0.06,
				vibrate: 0, //Set to 0 or [] to disable
				clickCancelFuse: true //If users clicks on targeted object fuse is canceled
			}
		});
	}
	
	// Create an element to render the scene with 3d objects in
	// Two renderes exist: WebGLRenderer and CanvasRenderer
	// WebGL is faster but more complicated?
	// Canvas is slower but easier to work with?
	if(mode != "ar") {
		self.renderer = new THREE.WebGLRenderer({
			antialias: self.videoBackground,
		  	alpha: self.videoBackground
		});
		self.renderer.setSize( window.innerWidth, window.innerHeight );
	    self.renderer.sortObjects = true
		// Declare the webglrenderer as a dom element (canvas)
		var element = self.renderer.domElement;
		// Create a webglviewer element
		var container = document.getElementById("webglviewer");
		// Pass the renderer into it.
		container.appendChild(element);
		if(self.videoBackground) {
			self.arToolkitSource = new THREEx.ArToolkitSource({
			  // to read from the webcam
			  sourceType : 'webcam',
			  // // to read from an image
			  // sourceType : 'image',
			  // sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/images/img.jpg',
			  // to read from a video
			  // sourceType : 'video',
			  // sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/videos/headtracking.mp4',
			});
			self.arToolkitSource.init(function onReady(){
			  onResize();
			});
			  // handle resize
		  	window.addEventListener('resize', function(){
			  onResize();
			});
			function onResize(){
			  self.arToolkitSource.onResize();
			  // self.arToolkitSource.copySizeTo(self.renderer.domElement);
			  // if( self.arToolkitContext.arController !== null ){
			  //     self.arToolkitSource.copySizeTo(self.arToolkitContext.arController.canvas);
			  // }
			}
		}
	}
	else {
		let lastKnownPos, 
		lastSeenPos = false;

		self.renderer  = new THREE.WebGLRenderer({
		  antialias: true,
		  alpha: true
		});
		self.renderer.setClearColor(new THREE.Color('lightgrey'), 0);
		// self.renderer.setSize( 640, 480 );
		self.renderer.setSize( window.innerWidth, window.innerHeight );
		var element = self.renderer.domElement;
		// Create a webglviewer element
		var container = document.getElementById("webglviewer");
		// Pass the renderer into it.
		container.appendChild(element);

		
		// element.style.position = 'absolute';
		// element.style.top = '0px';
		// element.style.left = '0px';


		self.arToolkitSource = new THREEx.ArToolkitSource({
		  // to read from the webcam
		  sourceType : 'webcam',
		  // // to read from an image
		  // sourceType : 'image',
		  // sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/images/img.jpg',
		  // to read from a video
		  // sourceType : 'video',
		  // sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/videos/headtracking.mp4',
		});
		self.arToolkitSource.init(function onReady(){
		  onResize();
		});
		  // handle resize
	  	window.addEventListener('resize', function(){
		  onResize();
		});

		function onResize(){
		  self.arToolkitSource.onResize();
		  self.arToolkitSource.copySizeTo(self.renderer.domElement);
		  if( self.arToolkitContext.arController !== null ){
		      self.arToolkitSource.copySizeTo(self.arToolkitContext.arController.canvas);
		  }
		}



		///////////////////////////////////////////////////////////////////////////////
		//          initialize arToolkitContext
		////////////////////////////////////////////////////////////////////////////////
		// create atToolkitContext


		self.arToolkitContext = new THREEx.ArToolkitContext({
		  cameraParametersUrl: './assets/ar/camera_para.dat',
		  detectionMode: 'mono',
		});
		// initialize it
		self.arToolkitContext.init(function onCompleted(){
		  // copy projection matrix to camera
		  self.camera.projectionMatrix.copy( self.arToolkitContext.getProjectionMatrix() );
		});		
		// update artoolkit on every frame
		self.onRenderFcts.push(function(){
		  if( self.arToolkitSource.ready === false ) return
		  self.arToolkitContext.update( self.arToolkitSource.domElement );
		  // update scene.visible if the marker is seen
		  self.scene.visible = self.camera.visible;

		  // detect if the orb has been shown at least once
		  // display the scene from that point on
		  // display the camera at those co-ords
		  // when updated with new co-ords, update the position
		});
	}


	//Activate VR stereoscopic view, pass the renderer through the StereoEffect object
	self.effect = new THREE.StereoEffect(self.renderer);
	//Keep track of the time running in vr experience and the space between each render
	// self.clock = new THREE.Clock();
	self.ismobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i);
}