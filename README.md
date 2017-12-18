# ThreeJM
This javascript library was made with the intention of turning ThreeJS (a 3D visualiser), Cannon.js (a physics engine), AR.js (an AR + image marker recognition engine) and Reticulum (a 3D targeting library), into a production focused tool - made to produce 3D web experiences. 

ThreeJM currently includes gulp + docker integration and comes built in with positional audio, 3D object creation, 3D model loader (JSON format), physics, gaze detection, 360 video/photo loaders and various camera modes such as FPS (VR) / AR / Model Viewer (Sketchfab-like emulator).

A roadmap of features that have yet to be implemented can be found at the bottom of this page.


## Setup
1. Install Node.js and Docker onto your pc
2. Download ThreeJM from this page
3. Navigate to the downloaded folder within your terminal window
4. Type 'npm install' to install all the associated modules
5. Once installed, start up the application by typing 'docker-compose up' into your terminal window

## How to use

### Instantiating ThreeJM

When you instantiate ThreeJM, you must decide which mode you are going to use it in (see below list). Based on which option you choose, the camera will be set up to view your created 3d models (e.g. 'vr' mode will setup the camera in first person, where as 'model' mode will set up the camera from a 3rd person perspective). 
1. VR
> A first person view, enabling flight mode will disable gravity, example below:

```javascript
let ThreeJm = new threejm({ mode: 'vr', flightmode: false });
```

2. Model
> A third person view of the model, example below:

```javascript
let ThreeJm = new threejm({ mode: 'model' });
```

3. 360 content viewer
> Sets the camera in a static position and allows it to rotate to view 360 content, example below:

```javascript
let ThreeJm = new threejm({ mode: 'threesixty' });
```

### Functions
There are 5 main functions (listed below) that exist within ThreeJm that will allow you to create 3d objects within your browser. These 3d objects will then have physics, gaze functionality and sound attached to them.

1. Set background

```javascript
ThreeJm.setBackground({
	type: "CubeTextureLoader",
	path: './assets/photo/',
	image: {
		left: 'px.jpg',
		right: 'nx.jpg',
		top: 'py.jpg',
		bottom: 'ny.jpg',
		front: 'pz.jpg',
		back: 'nz.jpg'
	}
});
```

2. Create a floor

```javascript
ThreeJm.createFloor({
	texture: {
		textureImage: "./assets/scenery/wood.jpg",
		textureWrap: {
			wrapS: "RepeatWrapping",
			wrapT: "RepeatWrapping",
			textureRepeat: [50,50]
		},
		textureAnisotrophy: true
	},
	material: {
		type: "MeshPhongMaterial",
		color: "0xffffff",
	    specular: "0xffffff",
	    shininess: 5,
	    shading: "FlatShading",
	},
	geometry: {
		type: "PlaneGeometry",
		size: [50, 50]
	},
	mesh: {
		rotation: { 
			x: -Math.PI / 2,
			y: 0,
			z: 0
		},
		position: {
			x: 0,
			y: 0,
			z: 0
		},
		visible: true,
		standable: true,
		reticle: false
	},
	physics: {
		type: "Plane",
		mass: 0,
		quaternion: {
			x: 1,
			y: 0,
			z: 0
		},
		fall: {
			height: 10,
			restart: true
		},
		wall: true
	}
});
```

3. Create a light source

```javascript
ThreeJm.createLight({
	type: "PointLight",
	pos: {
		x: 0,
		y: 15,
		z: 0
	},
	option: [2,100]
});
```

4. Create a shape

```javascript
ThreeJm.createShape('lookable', {
	texture: null,
	material: {
		color: 0xffffff,
		type: "MeshLambertMaterial"
	},
	geometry: {
		type: "BoxGeometry",
		size: [3, .5, 3]
	},
	mesh: {
		name: 'lookable',
		rotation: { 
			x: 0,
			y: 80,
			z: 0
		},
		position: {
			x: 5,
			y: 0,
			z: -5
		},
		visible: true,
		reticle: {
			display:true,
			scrollColor: 0xff0000,
			gazed: function(name) {
				console.log("Gazed at " + name + "!");
			}
		}
	},
	physics: {
		type: "Box",
		mass: 5
	}
	,
	sound: {
		src: './assets/sounds/reborn.mp3'
	}
});
```

5. Model loader 
> Use this function to load a 3d model in JSON format, example below:

```javascript
ThreeJm.loadModel('testModels', {
	material: {
		color: 0x55B663,
		specular: "0xffffff",
	    shininess: 5
	},
	geometry: {
		type: 'JSON',
		src: './assets/models/treehouse_logo.js',
		size: [3, 1, 3]
	},
	mesh: {
		name: "example",
		rotation: {
			x: 0,
			y: 0,
			z: 0
		},
		position: {
			x: 0,
			y: 0,
			z: -10
		},
		scale: {
			x: 1,
			y: 1,
			z: 1				
		},
		reticle: {
			display:true,
			scrollColor: 0xff0000,
			gazed: function(name) {
				console.log("Gazed at " + name + "!");
			}
		}
	},
	physics: {
		type: "Box",
		mass: 5
	}
	,
	sound: {
		src: './assets/sounds/reborn.mp3'
	}
});
```

## Library roadmap
Features to add in the future:

1. First person controls for mobile 
2. Create animation function
3. WEBVR + Polyfill
4. Add in physics "compounds" for complex physics
