export function createLight(self, light){	
	let lightingTypes = [THREE.PointLight];
	let lightingStrings = ["PointLight"];
	//for each type of light listed above
	for (let x = 0; x < lightingTypes.length; x++){
		//check if the passed light matches one of them
		if(light.type == lightingStrings[x]) {
			//create a light with the associated type
			var lightEffect = new lightingTypes[x]( light.color, light.option[0], light.option[1]);
			lightEffect.position.set(light.pos.x, light.pos.y, light.pos.z)
			self.scene.add(lightEffect);
		}
	}
}