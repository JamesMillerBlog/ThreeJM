export function addSound(shapeSound) {
	//Create an AudioListener and add it to the camera
	var listener = new THREE.AudioListener();
	self.camera.add( listener );

	//Create the PositionalAudio object (passing in the listener)
	var sound = new THREE.PositionalAudio( listener );

	//Load a sound and set it as the PositionalAudio object's buffer
	var audioLoader = new THREE.AudioLoader();
	audioLoader.load( shapeSound.src, function( buffer ) {
		sound.setBuffer( buffer );
		sound.setRefDistance( .1 );
		sound.play();
	});

	//Finally add the sound to the mesh
	return sound;
}