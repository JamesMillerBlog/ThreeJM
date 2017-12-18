export let space = { 
	texture: {
		textureImage: "./assets/photo/space.png",
		sphere: "photo"
	},
	material: {
		type: "MeshBasicMaterial",
		depthTest: true,
		depthWrite: true
	},
	geometry: {
		type: "SphereGeometry",
		size: [5000, 32, 32]
	},
	animate: {
		position: {
			direction: '+=',
			x: .01
		}
	},
	mesh: {
		rotation: { 
			x: 0,
			y: 0,
			z: 0
		},
		position: {
			x: 60,
			y: 15,
			z: -30
		},
		scale: {
			x:-1,
			y:1,
			z:1
		},
		reticle: {
			display:false
		},
		visible: true
	}
}

export let photoSphereOne = { 
	texture: {
		textureImage: "./assets/photo/bergsjostolen.jpg",
		sphere: "photo"
	},
	material: {
		type: "MeshBasicMaterial",
		depthTest: false,
		depthWrite: false
	},
	geometry: {
		type: "SphereGeometry",
		size: [30, 32, 32]
	},
	animate: {
		position: {
			direction: '+=',
			x: .01
		}
	},
	mesh: {
		rotation: { 
			x: 0,
			y: 0,
			z: 0
		},
		position: {
			x: 60,
			y: 15,
			z: -30
		},
		scale: {
			x:-1,
			y:1,
			z:1
		},
		reticle: {
			display:false
		},
		visible: true
	}
}

export let sailingScrollSphere = { 
	material: {
		type: "MeshBasicMaterial",
		color: 0xffffff,
		opacity: .5,
		transparent: true,
		depthTest: false,
		depthWrite: false
	},
	geometry: {
		type: "SphereGeometry",
		size: [29, 32, 32]
		// size: [1, 32, 32]
	},
	mesh: {
		rotation: { 
			x: 0,
			y: 0,
			z: 0
		},
		position: {
			// x: 0,
			// y: 1,
			// z: 0
			x: -40,
			y: 10,
			z: -60
		},
		scale: {
			x:1,
			y:1,
			z:1
		},
		visible: true,
		reticle: {
			display:true,
			scrollColor: 0xff0000,

			gazeClick: function(material, self) {

				// material.opacity = 0;

				let targetPosition = objects.sailingScrollSphere.mesh.position;
				let objectToMove = self.camera.position;
				let duration = 1000;
				objects.sailingScrollSphere.mesh.tween.animate(objectToMove, targetPosition, duration);

				self.renderer.domElement.addEventListener('click', exitSphere, true);

				function exitSphere() {
					objects.sailingScrollSphere.mesh.tween.animate(objectToMove, {x:0,y:0,z:0}, duration);					    
					self.renderer.domElement.removeEventListener('click', exitSphere, false);
				}
			},
			onGazeOver: function(material, self) {
				console.log("Gaze Over " + material + "!");
				material.opacity = 0;
			}, 
			onGazeOut: function(material, self) {
				console.log("Gaze Out");
				material.opacity = .5;
			},
			gazeLong: function(material, self) {
				
			}
		},
		tween: {
			animate: function(objectToMove, targetPosition, duration){
				var tween = new TWEEN.Tween(objectToMove)
				.to(targetPosition, duration)
				.start();
			}
		}
		// renderOrder: 2,
	}
}