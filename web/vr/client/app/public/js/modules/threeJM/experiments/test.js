// once everything is loaded, we run our Three.js stuff.
export function testSetup() {
    // var clock = new THREE.Clock();
    // create a scene, that will hold all our elements such as objects, cameras and lights.
    self.scene = new THREE.Scene();
    // create a camera, which defines where we're looking at.
    self.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    // create a render and set the size

    self.renderer = new THREE.WebGLRenderer();
    self.renderer.setSize( window.innerWidth, window.innerHeight );
    // Declare the webglrenderer as a dom element (canvas)
    var element = self.renderer.domElement;
    // Create a webglviewer element
    var container = document.getElementById("webglviewer");
    // Pass the renderer into it.
    container.appendChild(element);

    // webGLRenderer.shadowMapEnabled = true;
    // position and point the camera to the center of the scene
    self.camera.position.x = 0;
    self.camera.position.y = 5;
    self.camera.position.z = 0;
    self.camera.lookAt(new THREE.Vector3(45, 0, 0));
    self.controls = new THREE.FlyControls(self.camera);
    self.controls.movementSpeed = 25;
    self.controls.rollSpeed = Math.PI / 24;
    self.controls.autoForward = false;
    self.controls.dragToLook = false;
    
    render();
    
    function render() {
        
        var delta = self.clock.getDelta();
        self.controls.update(delta);
        self.renderer.clear();
        // render using requestAnimationFrame

        self.renderer.render(self.scene, self.camera)
        requestAnimationFrame(render);
    }
}
