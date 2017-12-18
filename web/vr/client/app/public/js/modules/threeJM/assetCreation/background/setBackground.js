/*** 360 BACKGROUND ***/
export function	setBackground(self, background){
	let backgroundTypes = [THREE.CubeTextureLoader];
	let backgroundStrings = ["CubeTextureLoader"];
	//for each type of light listed above
	for (let x = 0; x < backgroundTypes.length; x++){
		//check if the passed light matches one of them
		if(background.type == backgroundStrings[x]) {
			//create a background with the associated type
			self.scene.background = new backgroundTypes[x]()
				.setPath( background.path )
				.load( [ background.image.left, background.image.right, background.image.top, background.image.bottom, background.image.front, background.image.back ] );
		}
	}
}