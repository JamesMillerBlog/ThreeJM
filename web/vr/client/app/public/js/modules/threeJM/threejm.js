import { mesh, geometry, material, texture } from './assetCreation/mesh/createShape';
import { createLight } from './assetCreation/light/createLight';
import { addSound } from './assetCreation/sound/createSound'
import { setBackground } from './assetCreation/background/setBackground';
import { modelMesh } from './assetCreation/model/loadModel'; // implement compound meshes
import { setup } from './3dEnvironment/scene/setup';
import { VRcameracontrol, ARcameracontrol, MODELcameracontrol, THREESIXTYcameracontrol } from './3dEnvironment/camera/cameraControl';
import { update } from './3dEnvironment/scene/onframe';
import { worldPhysics, addPhysics, setCamPhysics, addPhysicsFloor } from './3dEnvironment/physics/physics';
import { resize } from './3dEnvironment/browser/browser'; 

// import { testSetup } from './experiments/test'; 


export class threejm{
	constructor(settings){
		/*** VARS ***/
		// Scene = Object that all 3d objects / cameras are declared it to be displayed 
		this.scene = null,
		// Camera = POV of the user
		this.camera = null,
		// Renderer = how 3d elements are rendered in html (webgl) 
		this.renderer = null,
		// Effect = The VR viewer (split screen)
		this.effect = null,
		// Device Rendered = Whether the scene is rendered for Desktop or VR Headset
		this.deviceRendered = null,
		// Clock = Keeps track of the time running inside of Vr experience + between frames
		this.clock = new THREE.Clock(),
		// Controls = The controller that operates the camera
		this.controls = null,
		this.ismobile = null;

		this.flyControls = settings.controls.flightmode; //change this to false for fps camera controller or true for flying camera

        // keyboard movment variables
        this.controlsEnabled = false,
        this.moveForward = false,
        this.moveBackward = false,
        this.moveLeft = false,
        this.moveRight = false,
        this.canJump = true,
        this.prevTime = performance.now();
        this.velocity = new THREE.Vector3();

        // Raycaster variables
        this.raycaster = null;
        this.cameraHeight = 0.5;
        this.startUp = false;

		/*** FUNCTIONS ***/
		this.geometry = geometry;
		this.mesh = mesh;
		this.material = material;
		this.texture = texture;

		// this.video = null;
		this.videoTexture = null;

		// track created objects
		this.createdObjects = [];

		// CANNON PHYSICS
		this.time = Date.now();
		this.physicsObjects = []; // store physics objects that will animate when interacted with
		this.physicsMeshes = []; // store meshes of all objects to animate with physics objects
		this.fallHeight = 0;
		this.mode = settings.mode;

		// ar stuff
		this.arToolkitSource = null;
		this.arToolkitContext = null;
		this.onRenderFcts = [];
		this.markerControls = null;
		this.arMarker = settings.AR.arMarker;
		this.lastTimeMsec = null;
		this.arPattern = settings.AR.arPattern;

		// instructions
		this.instructions = settings.UI.instructions;
		// vr mobile movement
		this.cameraMovement = settings.controls.movmement;
		this.videoBackground = settings.AR.video;
		self = this;
		
		this.startThreeJM(this.mode);
		// this.testSetup();
	}

	testSetup(){
		testSetup();
	}
	/*** STARTING THE THREE.JS SCENE IN VR MODE ***/
	startThreeJM(mode) {
		worldPhysics(); // set up physics in the vr environment
		if(!this.flyControls) if(mode == 'vr' || mode == 'ar' || mode == 'threesixty') setCamPhysics(); // set up physics on camera controller
		setup(mode); // setup the threeJS visualiser
		if(mode == 'vr') VRcameracontrol(); // set up vr camera controller
		else if(mode == 'model') MODELcameracontrol(); // setup the model viewer camera controller
		else if(mode == 'threesixty') THREESIXTYcameracontrol(); // setup 360 content camera controller
		else if(mode == 'ar') ARcameracontrol();
		resize(); // resize the threejs scene within the browser
		this.animate(); // animate the threejs scene + physics every frame
	}

	/*** CREATE LIGHTING SET UP ***/
	createLight(light){
		createLight(this, light);
	}

	/*** CREATE SHAPE ***/
	createShape(name ,createdShape) {
		// GEOMETRY
		let shapeGeometry = this.geometry(createdShape.geometry);
		// MATERIAL
		let shapeMaterial = this.material(createdShape.material, createdShape.texture);
		// MESH
		let shapeMesh = this.mesh(shapeGeometry, shapeMaterial, createdShape.mesh);
		if(createdShape.physics && !self.flyControls) {
			addPhysics(createdShape);
			// add physics to global array for animation
	        self.physicsMeshes.push( shapeMesh );
		}
		this.createdObjects.push({
			name: name,
			object: shapeMesh
		});
		if(createdShape.sound) shapeMesh.add( addSound(createdShape.sound) );
		this.scene.add( shapeMesh );
	}

	/*** CREATE SHAPE ***/
	createFloor(createdFloor) {
		// GEOMETRY
		let floorGeometry = this.geometry(createdFloor.geometry);
		// MATERIAL
		let floorMaterial = this.material(createdFloor.material, createdFloor.texture);
		// MESH
		let floorMesh = this.mesh(floorGeometry, floorMaterial, createdFloor.mesh);
		// Add Physics floor
		if(!self.flyControls) addPhysicsFloor(createdFloor);
		// Add floor mesh
		this.scene.add( floorMesh );
	}

	/*** LOAD MODEL ***/
	loadModel(name, loadedModel){
		  // Load in the mesh and add it to the scene.
		  let loader = new THREE.JSONLoader();
		  // loader the model and create a geometry from it
		  loader.load( loadedModel.geometry.src , function(geometry) {
		  	console.log(geometry);
		  	let loadedModelMesh = modelMesh(geometry, loadedModel);
		  	if(loadedModel.physics && !self.flyControls) {
				addPhysics(loadedModel);
				// add physics to global array for animation
		        self.physicsMeshes.push( loadedModelMesh );
			}
			if(loadedModel.sound) loadedModelMesh.add( addSound(loadedModel.sound) );
			self.createdObjects.push({
				name: name,
				object: loadedModelMesh
			});
		  	self.scene.add( loadedModelMesh );
		  });
	}

	/*** SET BACKGROUND ***/
	setBackground(background){
		setBackground(this, background);
	}

	/*** UPDATE ALL VR OBJECTS ON EVERY FRAME ***/
	animate(){
		requestAnimationFrame(self.animate); // recall self function every frame
		// if(!self.flyControls) VRphysics(self);
		// VRphysics(self);
		update(self.clock.getDelta(), self.mode, resize); // update size + pos of all vr elements in browser
	}
}

