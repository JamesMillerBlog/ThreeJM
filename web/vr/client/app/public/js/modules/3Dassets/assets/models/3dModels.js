export let models = {
	example: {
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
		// ,
		// sound: {
		// 	src: './assets/sounds/reborn.mp3'
		// }
	}
};

 