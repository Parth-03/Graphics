/* CMPSCI 373 Homework 5: Hierarchical Scene */

const width = 800, height = 600;
const fov = 60;
const cameraz = 6;
const aspect = width/height;
const smoothShading = true;
let   animation_speed = .1;

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(fov, aspect, 1, 1000);
camera.position.set(0, 1, cameraz);

let renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(width, height);
renderer.setClearColor(0x202020);
window.onload = function(e) {
	document.getElementById('window').appendChild(renderer.domElement);
}
let orbit = new THREE.OrbitControls(camera, renderer.domElement);	// create mouse control

let light0 = new THREE.DirectionalLight(0xFFFFFF, 1.0);
light0.position.set(camera.position.x, camera.position.y, camera.position.z);	// this light is at the camera
scene.add(light0);

let light1 = new THREE.DirectionalLight(0x800D0D, 1.0); // red light
light1.position.set(-1, 1, 0);
scene.add(light1);

let light2 = new THREE.DirectionalLight(0x0D0D80, 1.0); // blue light
light2.position.set(1, 1, 0);
scene.add(light2);

let amblight = new THREE.AmbientLight(0x202020);	// ambient light
scene.add(amblight);

let material = new THREE.MeshPhongMaterial({color:0x808080, specular:0x101010, shininess: 50, side:THREE.FrontSide});
let models = []; // array that stores all models
let numModelsLoaded = 0;
let numModelsExpected = 0;

// load OBJ models or create shapes
// ===YOUR CODE STARTS HERE===
let material_m= new THREE.MeshPhongMaterial({color:0x564C4C, specular:0x101010, shininess: 50, side:THREE.FrontSide});
let material_f= new THREE.MeshPhongMaterial({color:0xF1948A, specular:0x101010, shininess: 50, side:THREE.FrontSide});
let material_tree= new THREE.MeshPhongMaterial({color:0x27DE20, specular:0x101010, shininess: 50, side:THREE.FrontSide});
let material_buddha= new THREE.MeshPhongMaterial({color:0xFFFE00, specular:0x101010, shininess: 50, side:THREE.FrontSide});
let material_cow= new THREE.MeshPhongMaterial({color:0xFDFEFE, specular:0x101010, shininess: 50, side:THREE.FrontSide});
let material_shoe= new THREE.MeshPhongMaterial({color:0x6E2C00, specular:0x101010, shininess: 50, side:THREE.FrontSide});
let material_camera= new THREE.MeshPhongMaterial({color:0x95A5A6, specular:0x101010, shininess: 50, side:THREE.FrontSide});
let material_axe= new THREE.MeshPhongMaterial({color:0x283747, specular:0x101010, shininess: 50, side:THREE.FrontSide});
let material_computer= new THREE.MeshPhongMaterial({color:0x2E86C1, specular:0x101010, shininess: 50, side:THREE.FrontSide});


loadOBJ('objs/buddha.obj', material_buddha, 'Gen_1');

loadOBJ('objs/male.obj', material_m, 'Gen_2_m_1');
loadOBJ('objs/female.obj', material_f, 'Gen_2_f_1');
loadOBJ('objs/male.obj', material_m, 'Gen_2_m_2');
loadOBJ('objs/female.obj', material_f, 'Gen_2_f_2');
loadOBJ('objs/tree_aspen.obj', material_tree, 'Gen_2_tree');
loadOBJ('objs/cow.obj', material_cow, 'Gen_2_cow');

loadOBJ('objs/male.obj', material_m, 'Gen_3_m_1');
loadOBJ('objs/female.obj', material_f, 'Gen_3_f_1');
loadOBJ('objs/male.obj', material_m, 'Gen_3_m_2');
loadOBJ('objs/female.obj', material_f, 'Gen_3_f_2');
loadOBJ('objs/axe.obj', material_axe, 'Gen_3_axe');
loadOBJ('objs/shoe.obj', material_shoe, 'Gen_3_shoe');

loadOBJ('objs/male.obj', material_m, 'Gen_4_m');
loadOBJ('objs/computer.obj', material_computer, 'Gen_4_computer');
loadOBJ('objs/female.obj', material_f, 'Gen_4_f');
loadOBJ('objs/camera.obj', material_camera, 'Gen_4_camera');

let gen_1_group= new THREE.Group();

let gen_2_group_1= new THREE.Group();
let gen_2_group_2= new THREE.Group();

let gen_3_group_1= new THREE.Group();
let gen_3_group_2= new THREE.Group();

let gen_4_group_1= new THREE.Group();
let gen_4_group_2= new THREE.Group();
// ---YOUR CODE ENDS HERE---
//loadOBJ('objs/bunny.obj', material, 'sun');
//loadOBJ('objs/bunny.obj', material, 'earth');

// 'label' is a unique name for the model for accessing it later
function loadOBJ(fileName, material, label) {
	numModelsExpected++;
	loadOBJAsMesh(fileName, function(mesh) { // callback function for non-blocking load
		mesh.computeFaceNormals();
		if(smoothShading) mesh.computeVertexNormals();
		models[label] = new THREE.Mesh(mesh, material);
		numModelsLoaded++;
	}, function() {}, function() {});
}

let initialized = false;
function animate() {
	requestAnimationFrame( animate );
	if(numModelsLoaded == numModelsExpected) {	// all models have been loaded
		if(!initialized) {
			initialized = true;
			// construct the scene
// ===YOUR CODE STARTS HERE===
			var axesHelper = new THREE.AxesHelper( 5 );
			//scene.add( axesHelper );

			//Generation 1
			models['Gen_1'].position.x=0;
			models['Gen_1'].scale.set(2,2,2);
			gen_1_group.add(models['Gen_1']);
			gen_1_group.position.y=-5;
			scene.add(gen_1_group);
						
			//Generation 2
			gen_1_group.add(gen_2_group_1);
			gen_1_group.add(gen_2_group_2);

			models['Gen_2_m_1'].position.x=-1;
			models['Gen_2_f_1'].position.x=1;

			models['Gen_2_m_2'].position.x=-1.25;
			models['Gen_2_f_2'].position.x=1.25;

			models['Gen_2_tree'].position.y=1;
			models['Gen_2_tree'].scale.set(2,2,2);
			models['Gen_2_cow'].scale.set(1.25,1.25,1.25);

			gen_2_group_1.add(models['Gen_2_m_1']);
			gen_2_group_1.add(models['Gen_2_f_1']);
			gen_2_group_1.add(models['Gen_2_tree']);
			gen_2_group_1.position.x=5;
			gen_2_group_1.position.y=3;

			gen_2_group_2.add(models['Gen_2_m_2']);
			gen_2_group_2.add(models['Gen_2_f_2']);
			gen_2_group_2.add(models['Gen_2_cow']);
			gen_2_group_2.position.x=-5;
			gen_2_group_2.position.y=3;


			//Generation 3
			gen_2_group_1.add(gen_3_group_1);
			gen_2_group_2.add(gen_3_group_2);

			models['Gen_3_m_1'].position.x=-1;
			models['Gen_3_f_1'].position.x=1;

			models['Gen_3_m_2'].position.x=-1;
			models['Gen_3_f_2'].position.x=1;

			models['Gen_3_axe'].scale.set(0.75,0.75,0.75);
			models['Gen_3_shoe'].scale.set(0.5,0.5,0.5);

			gen_3_group_1.add(models['Gen_3_m_1']);
			gen_3_group_1.add(models['Gen_3_f_1']);
			gen_3_group_1.add(models['Gen_3_axe']);
			gen_3_group_1.position.x=5;
			gen_3_group_1.position.y=5;

			gen_3_group_2.add(models['Gen_3_m_2']);
			gen_3_group_2.add(models['Gen_3_f_2']);
			gen_3_group_2.add(models['Gen_3_shoe']);
			gen_3_group_2.position.x=5;
			gen_3_group_2.position.y=5;

			//Generation 4
			gen_3_group_1.add(gen_4_group_1);
			gen_3_group_2.add(gen_4_group_2);

			models['Gen_4_m'].position.x=0;
			models['Gen_4_f'].position.x=0;


			models['Gen_4_computer'].position.x=1;
			models['Gen_4_camera'].position.x=1;
			models['Gen_4_computer'].scale.set(0.75,0.75,0.75);
			models['Gen_4_camera'].scale.set(0.5,0.5,0.5);

			gen_4_group_1.add(models['Gen_4_m']);
			//gen_4_group_1.add(models['Gen_4_f_1']);
			gen_4_group_1.add(models['Gen_4_computer']);
			gen_4_group_1.position.x=3;
			gen_4_group_1.position.y=3;

			//gen_4_group_2.add(models['Gen_4_m_2']);
			gen_4_group_2.add(models['Gen_4_f']);
			gen_4_group_2.add(models['Gen_4_camera']);
			gen_4_group_2.position.x=-3;
			gen_4_group_2.position.y=3;
// ---YOUR CODE ENDS HERE---
			//scene.add(models['sun']);
			//models['earth'].position.x=3;
			//scene.add(models['earth']);
		}
		// animate the scene
// ===YOUR CODE STARTS HERE===
		gen_1_group.rotation.y+=0.01*animation_speed;
		models['Gen_1'].rotation.y+=0.1*animation_speed;

		gen_2_group_1.rotation.y+=0.05*animation_speed;
		gen_2_group_2.rotation.y+=0.05*animation_speed;
		models['Gen_2_m_1'].rotation.y+=0.1*animation_speed;
		models['Gen_2_f_1'].rotation.y+=0.1*animation_speed;

		models['Gen_2_m_2'].rotation.y+=0.1*animation_speed;
		models['Gen_2_f_2'].rotation.y+=0.1*animation_speed;

		models['Gen_2_tree'].rotation.y+=0.05*animation_speed;
		models['Gen_2_cow'].rotation.y+=0.05*animation_speed;

		gen_3_group_1.rotation.y+=0.1*animation_speed;
		gen_3_group_2.rotation.y+=0.1*animation_speed;
		models['Gen_3_m_1'].rotation.y+=0.15*animation_speed;
		models['Gen_3_f_1'].rotation.y+=0.15*animation_speed;

		models['Gen_3_m_2'].rotation.y+=0.15*animation_speed;
		models['Gen_3_f_2'].rotation.y+=0.15*animation_speed;

		models['Gen_3_axe'].rotation.y+=0.1*animation_speed;
		models['Gen_3_shoe'].rotation.y+=0.1*animation_speed;

		gen_4_group_1.rotation.y+=0.15*animation_speed;
		gen_4_group_2.rotation.y+=0.15*animation_speed;
		models['Gen_4_m'].rotation.y+=0.2*animation_speed;
		models['Gen_4_f'].rotation.y+=0.2*animation_speed;

		models['Gen_4_computer'].rotation.y+=0.15*animation_speed;
		models['Gen_4_camera'].rotation.y+=0.15*animation_speed;
// ---YOUR CODE ENDS HERE---
		//models['sun'].rotation.y+=0.01*animation_speed;
		//models['earth'].rotation.y+=0.05*animation_speed;
	}
	light0.position.set(camera.position.x, camera.position.y, camera.position.z); // light0 always follows camera position
	renderer.render(scene, camera);
}

animate();

function onKeyDown(event) {
	switch(event.key) {
		case 'w':
		case 'W':
			material.wireframe = !material.wireframe;
			break;
		case '=':
		case '+':
			animation_speed += 0.05;
			document.getElementById('msg').innerHTML = 'animation_speed = '+animation_speed.toFixed(2);
			break;
		case '-':
		case '_':
			if(animation_speed>0) animation_speed-=0.05;
			document.getElementById('msg').innerHTML = 'animation_speed = '+animation_speed.toFixed(2);
			break;
		case 'r':
		case 'R':
			orbit.reset();
			break;
	}
}

window.addEventListener('keydown', onKeyDown, false); // as key control if you need
