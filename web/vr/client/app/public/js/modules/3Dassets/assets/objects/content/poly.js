export let lookable = { 
	texture: null,
	material: {
		color: 0xffffff,
		type: "MeshLambertMaterial",
		transparent: true
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
			gazeClick: function(material) {
				console.log("Gaze Clicked " + material + "!");
				material.opacity = 0;
			},
			onGazeOver: function(material) {
				console.log("Gaze Over " + material + "!");
				material.opacity = 0.5;
			}, 
			onGazeOut: function(material) {
				console.log("Gaze Out");
				material.opacity = 1;
			}
		}
	},
	physics: {
		type: "Box",
		mass: 5
	}
	// ,
	// sound: {
	// 	src: './assets/sounds/reborn.mp3'
	// }
}