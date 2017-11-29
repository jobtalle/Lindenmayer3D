function Renderer(element) {
	this.width = element.offsetWidth;
	this.height = element.offsetHeight;
	this.scene = null;
	
	this.initializeCamera();
	this.initializeRenderer(element);
}

Renderer.prototype = {
	CAMERA_SPEED: 0.008,
	CAMERA_ANGLE: 70,
	ZNEAR: 0.1,
	ZFAR: 10000,
	
	getGeometry(symbols, constants) {
		var geometry = new THREE.Geometry();
		
		geometry.vertices.push(new THREE.Vector3(0, 0, 0));
		geometry.vertices.push(new THREE.Vector3(1, 0, 0));
		geometry.vertices.push(new THREE.Vector3(0, 1, 0));
		geometry.vertices.push(new THREE.Vector3(1, 1, 1));
		
		geometry.faces.push(new THREE.Face3(0, 1, 2));
		geometry.faces.push(new THREE.Face3(2, 1, 3));
		
		geometry.computeFaceNormals();
		
		return geometry;
	},
	
	getMesh(symbols, constants) {
		return new THREE.Mesh(this.getGeometry(symbols, constants), new THREE.MeshNormalMaterial());
	},
	
	initializeCamera() {
		this.camera = new THREE.PerspectiveCamera(
			this.CAMERA_ANGLE,
			this.width / this.height,
			this.ZNEAR,
			this.ZFAR);
		this.cameraRotation = Math.PI / 4;
		this.cameraPitch = Math.PI / 4;
		this.cameraZoom = 5;
		
		this.placeCamera();
	},
	
	placeCamera() {
		this.camera.position.x = Math.cos(this.cameraRotation) * this.cameraZoom * Math.sin(this.cameraPitch);
		this.camera.position.z = Math.sin(this.cameraRotation) * this.cameraZoom * Math.sin(this.cameraPitch);
		this.camera.position.y = Math.cos(this.cameraPitch) * this.cameraZoom;
		this.camera.lookAt(0, 0, 0);
	},
	
	initializeRenderer(element) {
		this.renderer = new THREE.WebGLRenderer({antialias: true});
		this.renderer.setSize(this.width, this.height);
		
		element.appendChild(this.renderer.domElement);
	},
	
	buildScene(symbols, constants) {
		this.scene = new THREE.Scene();
		this.scene.add(this.getMesh(symbols, constants));
	},
	
	moveView(x, y) {
		if(this.scene == null)
			return;
		
		this.cameraRotation += x * this.CAMERA_SPEED;
		this.cameraPitch -= y * this.CAMERA_SPEED;
		
		this.placeCamera();
		this.renderer.render(this.scene, this.camera);
	},
	
	render(symbols, constants) {
		this.buildScene(symbols, constants);
		
		this.renderer.render(this.scene, this.camera);
	}
}