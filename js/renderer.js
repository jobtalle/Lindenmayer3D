function Renderer(element) {
	this.width = element.offsetWidth;
	this.height = element.offsetHeight;
	this.scene = null;
	
	this.initializeCamera();
	this.initializeView();
	this.initializeLight();
	this.initializeRenderer(element);
}

Renderer.prototype = {
	CAMERA_SPEED: 0.01,
	CAMERA_ANGLE: 70,
	CAMERA_PITCH_MIN: 0.0001,
	CAMERA_PITCH_MAX: Math.PI - 0.0001,
	CAMERA_ZOOM_SPEED: 0.2,
	CAMERA_ZOOM_MIN: 0.1,
	CAMERA_ZOOM_MAX: 6,
	CAMERA_ROTATION_INITIAL: Math.PI / 4,
	CAMERA_PITCH_INITIAL: Math.PI / 4,
	LIGHT_ANGLE_OFFSET: Math.PI / 4,
	LIGHT_ANGLE_PITCH: Math.PI / 4,
	ZNEAR: 0.1,
	ZFAR: 1000,
	
	getScene(symbols, constants, angle) {
		var geometry = new Geometry(symbols, constants, angle);
		var scene = geometry.build(this.light);
		this.camera.center = geometry.getCenter();
		this.cameraRadius = geometry.getRadius();
		
		return scene;
	},
	
	initializeCamera() {
		this.camera = new THREE.PerspectiveCamera(
			this.CAMERA_ANGLE,
			this.width / this.height,
			this.ZNEAR,
			this.ZFAR);
	},
	
	initializeView() {
		this.cameraRotation = this.CAMERA_ROTATION_INITIAL;
		this.cameraPitch = this.CAMERA_PITCH_INITIAL;
		this.cameraZoom = 1.7;
		this.camera.center = null;
	},
	
	initializeLight() {
		this.light = new THREE.DirectionalLight(0xffffff);
	},
	
	placeCamera() {
		if(this.camera.center == null)
			return;
		
		this.camera.position.x = this.camera.center.x + Math.cos(this.cameraRotation) * this.cameraRadius * this.cameraZoom * Math.sin(this.cameraPitch);
		this.camera.position.z = this.camera.center.z + Math.sin(this.cameraRotation) * this.cameraRadius * this.cameraZoom * Math.sin(this.cameraPitch);
		this.camera.position.y = this.camera.center.y + Math.cos(this.cameraPitch) * this.cameraRadius * this.cameraZoom;
		this.camera.lookAt(this.camera.center.x, this.camera.center.y, this.camera.center.z);
		
		this.light.position.set(
			Math.cos(this.cameraRotation + this.LIGHT_ANGLE_OFFSET) * Math.sin(this.LIGHT_ANGLE_PITCH),
			Math.cos(this.LIGHT_ANGLE_PITCH),
			Math.sin(this.cameraRotation + this.LIGHT_ANGLE_OFFSET) * Math.sin(this.LIGHT_ANGLE_PITCH));
	},
	
	initializeRenderer(element) {
		this.renderer = new THREE.WebGLRenderer({antialias: true});
		this.renderer.setSize(this.width, this.height);
		
		element.appendChild(this.renderer.domElement);
	},
	
	moveView(x, y) {
		if(this.scene == null)
			return;
		
		this.cameraRotation += x * this.CAMERA_SPEED;
		this.cameraPitch -= y * this.CAMERA_SPEED;
		
		if(this.cameraPitch < this.CAMERA_PITCH_MIN)
			this.cameraPitch = this.CAMERA_PITCH_MIN;
		else if(this.cameraPitch > this.CAMERA_PITCH_MAX)
			this.cameraPitch = this.CAMERA_PITCH_MAX;
		
		this.paint();
	},
	
	zoomIn() {
		this.cameraZoom *= 1 - this.CAMERA_ZOOM_SPEED;
		
		if(this.cameraZoom < this.CAMERA_ZOOM_MIN)
			this.cameraZoom = this.CAMERA_ZOOM_MIN;
		
		this.paint();
	},
	
	zoomOut() {
		this.cameraZoom *= 1 + this.CAMERA_ZOOM_SPEED;
		
		if(this.cameraZoom > this.CAMERA_ZOOM_MAX)
			this.cameraZoom = this.CAMERA_ZOOM_MAX;
		
		this.paint();
	},
	
	render(symbols, constants, angle) {
		// TODO: Free scene
		this.scene = this.getScene(symbols, constants, angle);
		this.paint();
	},
	
	paint() {
		this.placeCamera();
		this.renderer.render(this.scene, this.camera);
	}
}