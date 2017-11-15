var camera, scene, renderer;
var geometry, material, mesh;

function initialize() {
	var canvas =  document.getElementById("renderer");

    camera = new THREE.PerspectiveCamera( 70, canvas.offsetWidth / canvas.offsetHeight, 0.01, 10 );
    camera.position.z = 1;

    scene = new THREE.Scene();

    geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
    material = new THREE.MeshNormalMaterial();

    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( canvas.offsetWidth, canvas.offsetHeight );
	canvas.appendChild( renderer.domElement );
	
	animate();
}

function animate() {

    requestAnimationFrame( animate );

    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;

    renderer.render( scene, camera );
}