/*** RE-RENDER ALL CONTENT EVERY FRAME ***/
export function update(dt, mode, resize, nowMsec) {
    // // update the picking ray with the camera and mouse position
    if(mode == 'vr' || mode == 'threesixty') {
        Reticulum.update();
        // // check if fall height has been set (only happens if fall restart has been set to true)
        if(self.fallHeight < 0) {
            if(self.sphereBody.position.y <= self.fallHeight) {
                self.sphereBody.position.y = 5;
                self.sphereBody.position.x = 0;
                self.sphereBody.position.z = 0;
            }
        }
    }
    if(!self.arMarker) if(self.controls.enabled) self.world.step(dt);
    // // Update box positions
    for(let i = 0; i < self.physicsObjects.length; i++) {
        self.physicsMeshes[i].position.copy(self.physicsObjects[i].position);
        self.physicsMeshes[i].quaternion.copy(self.physicsObjects[i].quaternion);
    }
    TWEEN.update();

     // measure time
    self.lastTimeMsec  = self.lastTimeMsec || nowMsec-1000/60
    var deltaMsec = Math.min(200, nowMsec - self.lastTimeMsec)
    self.lastTimeMsec = nowMsec

    self.onRenderFcts.forEach(function(onRenderFct){
        onRenderFct(deltaMsec/1000, nowMsec/1000);
    });
    // animation code that is commented out
    // // if(self.animatingObjects.length > 0) animateObjects(self.animatingObjects);

    // // if(self.flyControls && !self.controls.update) VRcameracontrol();
    // // if(self.flyControls) VRcameracontrol();
    // if(self.ismobile || self.flyControls) {
    //     // self.controls.update(dt);
    //     // self.renderer.clear();
    // }

    window.onresize = function(event) {
        resize();
    };
        
    if(!self.arMarker) {
        if(self.flyControls) {
            self.controls.update(dt);
            self.renderer.clear();
        } else {
            self.controls.update( Date.now() - self.time );
            self.time = Date.now();
        }
    }
    self.deviceRendered.render(self.scene, self.camera);

    self.deviceRendered.setSize( window.innerWidth, window.innerHeight );
    
    // if(markerControls.object3d.visible) vrRedirect(); // remove this for vr code


    // $( "#data" ).html(self.controls.object.position.y);
}