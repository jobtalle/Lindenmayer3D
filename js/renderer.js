function Renderer(element) {
	this.width = element.offsetWidth;
	this.height = element.offsetHeight;
	
	this.initializeCamera();
	this.initializeRenderer(element);
	this.initializeScene();
	this.animate();
}

Renderer.prototype = {
	getMesh() {
		var geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
		var material = new THREE.MeshNormalMaterial();
	
		return new THREE.Mesh(geometry, material);
	},
	
	initializeCamera() {
		this.camera = new THREE.PerspectiveCamera( 70, this.width / this.height, 0.01, 10);
		this.camera.position.z = 1;
	},
	
	initializeRenderer(element) {
		this.renderer = new THREE.WebGLRenderer({antialias: true});
		this.renderer.setSize(this.width, this.height);
		
		element.appendChild(this.renderer.domElement);
	},
	
	initializeScene() {
		this.scene = new THREE.Scene();
		this.scene.add(this.getMesh());
	},
	
	animate() {
		requestAnimationFrame(this.animate.bind(this));
		
		this.renderer.render(this.scene, this.camera);
	}
}