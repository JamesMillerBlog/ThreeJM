export function mesh (shapeGeometry, shapeMaterial, mesh) {
	let shapeMesh = new THREE.Mesh(shapeGeometry, shapeMaterial);
	if(mesh.rotation) shapeMesh.rotation.x = mesh.rotation.x, shapeMesh.rotation.y = mesh.rotation.y, shapeMesh.rotation.z = mesh.rotation.z;
	if(mesh.position) shapeMesh.position.x = mesh.position.x, shapeMesh.position.y = mesh.position.y, shapeMesh.position.z = mesh.position.z;
	if(mesh.scale) shapeMesh.scale.x = mesh.scale.x, shapeMesh.scale.y = mesh.scale.y, shapeMesh.scale.z = mesh.scale.z;
	if(mesh.visible) shapeMesh.visible = mesh.visible;

	if(mesh.reticle.display) {
		Reticulum.add( shapeMesh, {
			onGazeOver: function(){
				// do something when user targets object
				// console.log(this.material.emissive);
				if(mesh.reticle.onGazeOver) mesh.reticle.onGazeOver(shapeMaterial, self);
				// shapeMaterial.color.setHex( mesh.reticle.scrollColor );
				// shapeMaterial.color = "0xff0000" ;
				Reticulum.distance = Reticulum.distance*10;
			},
			onGazeOut: function(){
				if(mesh.reticle.onGazeOut) mesh.reticle.onGazeOut(shapeMaterial, self);
				// do something when user moves reticle off targeted object
				// console.log(this.material.emissive);
				// Reticulum.distance = Reticulum.distance/2;
			},
			onGazeLong: function(){
				if(mesh.reticle.gazeLong) mesh.reticle.gazeLong( shapeMaterial, self );
			},
			onGazeClick: function(){
				if(mesh.reticle.gazeClick) mesh.reticle.gazeClick( shapeMaterial, self );
				// console.log(tween);
				// if(mesh.tween) mesh.tween.animation.start();
			}

		});
	}
	if(mesh.renderOrder) shapeMesh.renderOrder = mesh.renderOrder;

	if(mesh.functions) {
			
		var bespokeFunctions = (Object.getOwnPropertyNames(mesh.functions).filter(function (p) {
		     if(typeof mesh.functions[p] === 'function') mesh.functions[p](shapeMaterial, self);
		}));
	}
	return shapeMesh;
}

export function geometry(geometry){
	// GEOMETRY
	let geometryTypes = [THREE.PlaneBufferGeometry, THREE.BoxGeometry, THREE.SphereGeometry, THREE.PlaneGeometry];
	let geometryStrings = ["PlaneBufferGeometry", "BoxGeometry", "SphereGeometry", "PlaneGeometry"];
	//for each type of material listed above
	for (let x = 0; x < geometryTypes.length; x++){
		//check if the passed material matches one of them
		if(geometry.type == geometryStrings[x]) {
			//create a material with the associated type
			var shapeGeometry = new geometryTypes[x]( geometry.size[0], geometry.size[1], geometry.size[2]);
			return shapeGeometry;
		}
	}
}

export function material(material, texture){
	if(material) {
		let materialTypes = [THREE.MeshPhongMaterial, THREE.MeshLambertMaterial, THREE.MeshBasicMaterial];
		let materialStrings = ["MeshPhongMaterial", "MeshLambertMaterial", "MeshBasicMaterial"];
		let shadingTypes = [THREE.FlatShading];
		let shadingStrings = ["FlatShading"];

		//for each type of material listed above
		for (let x = 0; x < materialTypes.length; x++) {
			//check if the passed material matches one of them
			if(material.type == materialStrings[x]) {
				//create a material with the associated type
				var shapeMaterial = new materialTypes[x]({
					color: material.color || null,
					specular: material.specular || null,
					shininess: material.shininess || null,
					opacity: material.opacity || null,
					transparent: material.transparent || null
				});

				if(material.depthTest) {
					console.log(material);
					shapeMaterial.depthTest = material.depthTest;
				}
				if(material.depthWrite) shapeMaterial.depthWrite = material.depthWrite;
				if( texture ) shapeMaterial.map = this.texture(texture);
			}
		}
		if(material.shading){
			//for each type of shading listed above
			for (let x = 0; x < shadingTypes.length; x++){
				//check if the passed material matches one of them
				if(material.shading == shadingStrings[x]) shapeMaterial.shading = shadingTypes[x];
			}
		}
		return shapeMaterial;
	}

}

function createVideo(videoSRC){
	// create the video element
    let video = document.createElement( 'video' );
    // var video = document.getElementById( "video" );
    video.setAttribute('controls','playsinline', 'webkit-playsinline');

    $(video).attr('controls',''); 
    $(video).attr('webkit-playsinline',''); 
    $(video).attr('playsinline',''); 

    video.width = 640;
    video.height = 360;
    video.autoplay = true;
    video.loop = true;
    video.src = videoSRC;
    video.play();
    return video;
}

export function texture(texture){
	let video;
	if(texture) {
		var shapeTexture;
		if(texture.sphere == "photo") {
			shapeTexture = THREE.ImageUtils.loadTexture(texture.textureImage);
			console.log("loading photo sphere texture");
		}
		else if(texture.sphere == "video") {
			shapeTexture = new THREE.VideoTexture(createVideo(texture.textureImage));
			shapeTexture.minFilter = THREE.LinearFilter;
	        shapeTexture.magFilter = THREE.LinearFilter;
	        shapeTexture.format = THREE.RGBFormat;
		} else if(!texture.sphere) {
			shapeTexture = new THREE.TextureLoader().load(texture.textureImage);
		}
		
		if(texture.textureWrap) {
			shapeTexture.wrapS = THREE.RepeatWrapping;
			shapeTexture.wrapT = THREE.RepeatWrapping;
			shapeTexture.repeat = new THREE.Vector2(texture.textureWrap.textureRepeat[0],texture.textureWrap.textureRepeat[1]);
		}
		if(texture.textureAnisotrophy) shapeTexture.anisotropy = this.renderer.getMaxAnisotropy();
		return shapeTexture;
	}
}