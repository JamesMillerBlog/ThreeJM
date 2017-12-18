export let videoSphereOne = { 
		texture: {
			textureImage: "./assets/video/pano.mp4",
			sphere: "video"
		},
		material: {
			type: "MeshBasicMaterial",
			transparent: true,
			opacity: .8,
			depthTest: false,
			depthWrite: false
		},
		geometry: {
			type: "SphereGeometry",
			// size: [5, 32, 32]
			size: [29, 32, 32]
		},
		mesh: {
			rotation: { 
				x: 0,
				y: 0,
				z: 0
			},
			position: {
				x: -50,
				y: 1,
				// z: -100
				z: -80
			},
			scale: {
				x:-1,
				y:1,
				z:1
			},
			clicked: false,
			reticle: {
				display:true,
				scrollColor: 0xff0000,
				gazeClick: function(material, self) {
					videoSphereOne.mesh.clicked = true;
					material.opacity = 1;
					console.log("Video gaze click");
					let targetPosition = videoSphereOne.mesh.position;
					let objectToMove = self.camera.position;
					let duration = 1000;
											
					videoSphereOne.mesh.tween.animate(objectToMove, targetPosition, duration);

					setTimeout(function(){ 
						self.renderer.domElement.addEventListener('click', exitSphere, true);
					}, duration);

					function exitSphere() {
						if(videoSphereOne.mesh.clicked){
							videoSphereOne.mesh.clicked = false;
							material.opacity = .7;
							videoSphereOne.mesh.tween.animate(objectToMove, {x:0,y:0,z:0}, duration);					    
							self.renderer.domElement.removeEventListener('click', exitSphere, false);
						}
						
					}
				},
				onGazeOver: function(material, self) {
					console.log("Video gaze Over " + material + "!");
					material.opacity = 1;
				}, 
				onGazeOut: function(material, self) {
					console.log("Video gaze Out");
					if(!videoSphereOne.mesh.clicked) material.opacity = .7;
				},
				gazeLong: function(material, self) {
					console.log("Video gaze long");
				}
			},
			tween: {
				animate: function(objectToMove, targetPosition, duration){
					var tween = new TWEEN.Tween(objectToMove)
					.to(targetPosition, duration)
					.start();
				}
			},
			visible: true
			// renderOrder: 1
			// functions: {
			// 	tap: function(material, self) {
					
			// 		self.renderer.domElement.addEventListener('click', enterSphere, true);

			// 		function enterSphere() {
			// 			console.log("trigger");
			// 			// objects.sailingScrollSphere.mesh.tween.animate(objectToMove, {x:0,y:0,z:0}, duration);					    
			// 			self.renderer.domElement.removeEventListener('click', enterSphere, false);
			// 		}
			// 		// console tap
			// 		// fix location of object once detected
			// 		// check if detection is true
			// 		// swap camera to device orientation
			// 		// animate camera into object
			// 		// look around 360
			// 		// click again animate to original position
			// 		// swap camera back to original
			// 	}
			// }
		},
	}