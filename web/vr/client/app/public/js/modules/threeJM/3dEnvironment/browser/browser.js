/*** RESIZE 3D OBJECTS BASED ON BROWSER SIZE EVERY FRAME ***/
export function resize() {
    if(!self.arMarker) {
	    self.camera.aspect = window.innerWidth / window.innerHeight;
	    // updates the camera object with the new aspect ratios
	    self.camera.updateProjectionMatrix();
	    self.deviceRendered.setSize(window.innerWidth, window.innerHeight);
    }
}

window.onresize = function(event) {
    resize();
};