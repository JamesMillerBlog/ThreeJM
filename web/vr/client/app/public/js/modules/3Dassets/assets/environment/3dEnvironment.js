export let environment = {
	floor: { 
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
	},
	backgroundImage: {
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
	}
}
