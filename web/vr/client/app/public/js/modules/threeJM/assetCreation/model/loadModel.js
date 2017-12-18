
export function modelMesh(geometry, loadedModel) {
	let modelMesh = new THREE.Mesh(geometry, modelMaterial(loadedModel.material) );
    if(loadedModel.mesh.rotation) modelMesh.rotation.x = loadedModel.mesh.rotation.x, modelMesh.rotation.y = loadedModel.mesh.rotation.y, modelMesh.rotation.z = loadedModel.mesh.rotation.z;
    if(loadedModel.mesh.position) modelMesh.position.x = loadedModel.mesh.position.x, modelMesh.position.y = loadedModel.mesh.position.y, modelMesh.position.z = loadedModel.mesh.position.z;
    if(loadedModel.mesh.scale) modelMesh.scale.x = loadedModel.mesh.scale.x, modelMesh.scale.y = loadedModel.mesh.scale.y, modelMesh.scale.z = loadedModel.mesh.scale.z;

    if(loadedModel.mesh.reticle.display) {
		let oldColor = loadedModel.material.color;
		Reticulum.add( modelMesh, {
			onGazeOver: function(){
				// do something when user targets object
				Reticulum.distance = Reticulum.distance*10;
			},
			onGazeOut: function(){
				// do something when user moves reticle off targeted object
				Reticulum.distance = Reticulum.distance/2;
			},
			onGazeLong: function(){
				if(loadedModel.mesh.reticle.gazed) loadedModel.mesh.reticle.gazed( loadedModel.mesh.name );
			},
			onGazeClick: function(){
				if(loadedModel.mesh.reticle.gazed) loadedModel.mesh.reticle.gazed( loadedModel.mesh.name );
			}

		});
	}

	return modelMesh;
}

function modelMaterial(loadedMaterial){
	let material = new THREE.MeshLambertMaterial({
	  	color: loadedMaterial.color,
	  	specular: loadedMaterial.specular,
		shininess: loadedMaterial.shininess
    });
    return material;
}