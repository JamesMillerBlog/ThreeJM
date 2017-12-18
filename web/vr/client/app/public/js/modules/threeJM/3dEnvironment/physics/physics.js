export function worldPhysics() {

	self.world = new CANNON.World();
	self.world.quatNormalizeSkip = 0;
    self.world.quatNormalizeFast = false;

    var solver = new CANNON.GSSolver();

    self.world.defaultContactMaterial.contactEquationStiffness = 1e9; 
    self.world.defaultContactMaterial.contactEquationRelaxation = 4; // bouncyness

    solver.iterations = 7;
    solver.tolerance = 0.1;
    var split = true;
    if(split){
        self.world.solver = new CANNON.SplitSolver(solver);
    }
    else{
        self.world.solver = solver;
    }

    self.world.gravity.set(0,-20,0);
    self.world.broadphase = new CANNON.NaiveBroadphase();
    self.world.broadphase.useBoundingBoxes = true;

    // Create a slippery material (friction coefficient = 0.0)
    self.physicsmaterial = new CANNON.Material("slipperyMaterial");
	var physicsContactMaterial = new CANNON.ContactMaterial(self.physicsmaterial,
	                                                        self.physicsmaterial,
	                                                        0.0, // friction coefficient
	                                                        0.3  // restitution
	                                                        );
    // We must add the contact materials to the self.world
    self.world.addContactMaterial(physicsContactMaterial);
}

export function setCamPhysics() {
	// Create gravity for camera
    var mass = 5; 
    if(self.arMarker) mass = 0;
    var radius = 1.3;
	let sphereShape = new CANNON.Sphere(radius);
    self.sphereBody = new CANNON.Body({ mass: mass, material: self.physicsmaterial });
    self.sphereBody.addShape(sphereShape);
    self.sphereBody.position.set(0,5,0);
    self.sphereBody.linearDamping = 0.9; // sliding
    self.world.addBody(self.sphereBody);
}

export function addPhysics(createdShape) {
	// Physics options
	let physicsTypes = [CANNON.Plane, CANNON.Box];
	let physicsStrings = ["Plane", "Box"];

	//for each type of material listed above
	for (let x = 0; x < physicsTypes.length; x++){
		//check if the passed material matches one of them
		if(createdShape.physics.type == physicsStrings[x]) {
            // if physics type is a plane
            if(createdShape.physics.type == "Plane") var physicsShape = new physicsTypes[x]();
			// otherwise create the correct physics with the associated type
            else {
                // Object sizes
                let halfExtents = new CANNON.Vec3(createdShape.geometry.size[0]/2, createdShape.geometry.size[1]/2, createdShape.geometry.size[2]/2);
                var physicsShape = new physicsTypes[x](halfExtents);
            }
            // Create the body that has mass to be touched
			let physicsBody = new CANNON.Body({ mass: createdShape.physics.mass });
            // Add the shape to the mass
            physicsBody.addShape(physicsShape);
            // set other physics options
            physicsBody.position.set(createdShape.mesh.position.x, createdShape.mesh.position.y, createdShape.mesh.position.z);
			if(createdShape.physics.quaternion) physicsBody.quaternion.setFromAxisAngle(new CANNON.Vec3(createdShape.physics.quaternion.x,createdShape.physics.quaternion.y,createdShape.physics.quaternion.z),-Math.PI/2);
            else if(createdShape.mesh.rotation) physicsBody.quaternion.setFromAxisAngle(new CANNON.Vec3(createdShape.mesh.rotation.x,createdShape.mesh.rotation.y,createdShape.mesh.rotation.z),-Math.PI/2);

            // add physics to the scene
		    self.world.addBody(physicsBody);

            // add physics to global array for animation
            self.physicsObjects.push(physicsBody)
		}
	}
}

export function addPhysicsFloor(createdFloor) {
    // declare physics shape type
    let floorShape = new CANNON.Plane();
    // declare mass of physis body
    let floorBody = new CANNON.Body({ mass: createdFloor.physics.mass });
    floorBody.addShape(floorShape);

    // set physics options
    if(createdFloor.physics.quaternion) floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(createdFloor.physics.quaternion.x,createdFloor.physics.quaternion.y,createdFloor.physics.quaternion.z),-Math.PI/2);
    if(createdFloor.physics.fall.height > 0) {
        createFloorEdge(createdFloor, floorBody);
        if(createdFloor.physics.fall.restart) activateFloorRestart(createdFloor, floorBody);
    }
    if(createdFloor.physics.wall) createFloorWalls(createdFloor, floorBody);
    self.world.addBody(floorBody);
}

function createFloorEdge(createdFloor, floorBody) {
    floorBody.position.set(0, -createdFloor.physics.fall.height, 0);
    let halfExtents = new CANNON.Vec3(createdFloor.geometry.size[0]/2, createdFloor.physics.fall.height/2, createdFloor.geometry.size[1]/2);
    let realFloorShape = new CANNON.Box(halfExtents);
    let realFloorBody = new CANNON.Body({ mass: createdFloor.physics.mass });
    realFloorBody.addShape(realFloorShape);
    realFloorBody.position.set(0, -createdFloor.physics.fall.height/2, 0);
    self.world.addBody(realFloorBody);
}

function createFloorWalls(createdFloor, floorBody) {
    for(let x = 0; x < 4; x++) {
        let halfExtents = new CANNON.Vec3(createdFloor.geometry.size[0]/2, createdFloor.physics.fall.height, createdFloor.geometry.size[1]/2);
        let wallShape = new CANNON.Box(halfExtents);
        let wallBody = new CANNON.Body({ mass: createdFloor.physics.mass });
        wallBody.addShape(wallShape);
        // create right wall
        if(x == 0) wallBody.position.set(createdFloor.geometry.size[0], 0, 0);
        // create left wall
        else if(x == 1) wallBody.position.set(-createdFloor.geometry.size[0], 0, 0);
        // create front wall
        else if(x == 2) wallBody.position.set(0, 0, createdFloor.geometry.size[1]);
        // create back wall
        else if(x == 3) wallBody.position.set(0, 0, -createdFloor.geometry.size[1]);
        // push each wall into the scene
        self.world.addBody(wallBody);
    }
}

function activateFloorRestart(createdFloor, floorBody) {
    self.fallHeight = -createdFloor.physics.fall.height/2;
}
