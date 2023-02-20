/* CMPSCI 373 Homework 4: Subdivision Surfaces */

const panelSize = 600;
const fov = 35;
const aspect = 1;
let scene, renderer, camera, material, orbit, light, surface=null;
let nsubdiv = 0;

let coarseMesh = null;	// the original input triangle mesh
let currMesh = null;		// current triangle mesh

let flatShading = true;
let wireFrame = false;

let objNames = [
	'objs/tetra.obj',
	'objs/box.obj',
	'objs/ico.obj',
	'objs/torus.obj',
	'objs/twist.obj',
	'objs/combo.obj',
	'objs/pawn.obj',
	'objs/bunny.obj',
	'objs/head.obj',
	'objs/hand.obj'
];

function id(s) {return document.getElementById(s);}
function message(s) {id('msg').innerHTML=s;}

function subdivide() {
	let currVerts = currMesh.vertices;
	let currFaces = currMesh.faces;
	let newVerts = [];
	let newFaces = [];
	/* You can access the current mesh data through
	 * currVerts and currFaces arrays.
	 * Compute one round of Loop's subdivision and
	 * output to newVerts and newFaces arrays.
	 */
// ===YOUR CODE STARTS HERE===
	console.log("current vertices: ",currVerts);
	console.log("current faces: ",currFaces);

	//Cloning old vertices to newVerts
	for(let i=0; i<currVerts.length; i++)
		newVerts.push(currVerts[i].clone());
	
	//console.log(newVerts);
	let vert_adj= new Map();
	let edge= new Map();
	let n= currVerts.length;
	let key_ab,key_bc,key_ac=null;

	for(let i=0;i<currFaces.length; i++)
	{
		let a = currFaces[i].a;
		let b = currFaces[i].b;
		let c = currFaces[i].c;
		
			
		for(let k=0;k<3;k++)
		{
			//Computing vertice adjacency data structure
			if(vert_adj.has(a))
			{
				vert_adj.get(a).add(b,c);
			}
			else
			{
				vert_adj.set(a, new Set([b, c]));
			}

			//Computing Edge data structure
			key_ab=Math.pow((a+b),0.5)/((a*b)+1);
			if(!edge.has(key_ab))
			{
				edge.set(key_ab, {v0:a, v1:b, n0:c, n1:-1, index: n});
				//newVerts.push(n);
				n++;
			}
			else
				edge.get(key_ab).n1=c;
			
			let temp=a;
			a=b;
			b=c;
			c=temp;

		}
	}
	console.log("vertice adjacency: ",vert_adj);
	console.log("edges: ",edge);
	//console.log(newVerts);

	//Computing new vertice positions
	for([key,value] of edge)
	{
		let newvert= new THREE.Vector3();
		newvert.x= ((3/8)*newVerts[value.v0].x) + ((3/8)*newVerts[value.v1].x) + ((1/8)*newVerts[value.n0].x) +((1/8)*newVerts[value.n1].x);
		newvert.y= ((3/8)*newVerts[value.v0].y) + ((3/8)*newVerts[value.v1].y) + ((1/8)*newVerts[value.n0].y) +((1/8)*newVerts[value.n1].y);
		newvert.z= ((3/8)*newVerts[value.v0].z) + ((3/8)*newVerts[value.v1].z) + ((1/8)*newVerts[value.n0].z) +((1/8)*newVerts[value.n1].z);
		newVerts.push(newvert);
		//newVerts[value.index]= newvert;
		//console.log(value); 
	}
	//console.log(newVerts);

	//Updating old vertice positions
	for([key,value] of vert_adj)
	{
		let vert = new THREE.Vector3();
		let beta =3/16;
		if(value.size>=3)	
			beta= (1/value.size)*((5/8)-Math.pow(((3/8)+((1/4)*Math.cos((2*Math.PI)/value.size))),2));
		//console.log(value.size);
		vert.x+= (1- (value.size*beta))*newVerts[key].x;
		vert.y+= (1- (value.size*beta))*newVerts[key].y;
		vert.z+= (1- (value.size*beta))*newVerts[key].z;
		for(i of value)
		{
			vert.x+= beta*newVerts[i].x;
			vert.y+= beta*newVerts[i].y;
			vert.z+= beta*newVerts[i].z;
			//vert.add(newVerts[i].multiplyScalar(beta));
			//console.log(i);
		}
		
		newVerts[key]=vert;
	}
	console.log("updated vertices: ",newVerts);

	for(i=0;i<currFaces.length;i++)
	{
		let a = currFaces[i].a;
		let b = currFaces[i].b;
		let c = currFaces[i].c;
		key_ab=Math.pow((a+b),0.5)/((a*b)+1);
		key_bc=Math.pow((b+c),0.5)/((b*c)+1);
		key_ac=Math.pow((a+c),0.5)/((a*c)+1);
		let i_ab= edge.get(key_ab).index;
		let i_bc= edge.get(key_bc).index;
		let i_ac= edge.get(key_ac).index;
		newFaces.push(new THREE.Face3(a,i_ab,i_ac));
		newFaces.push(new THREE.Face3(i_ab,b,i_bc));
		newFaces.push(new THREE.Face3(i_bc,c,i_ac));
		newFaces.push(new THREE.Face3(i_ab,i_bc,i_ac));
	}
	console.log("new faces: ",newFaces);
	//console.log((1/6)*((5/8)-Math.pow(((3/8)+((1/4)*Math.cos((2*Math.PI)/6))),2)));

// ---YOUR CODE ENDS HERE---
	/* Overwrite current mesh with newVerts and newFaces */
	currMesh.vertices = newVerts;
	currMesh.faces = newFaces;
	/* Update mesh drawing */
	updateSurfaces();
}

window.onload = function(e) {
	// create scene, camera, renderer and orbit controls
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 100 );
	camera.position.set(-1, 1, 3);
	
	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize(panelSize, panelSize);
	renderer.setClearColor(0x202020);
	id('surface').appendChild(renderer.domElement);	// bind renderer to HTML div element
	orbit = new THREE.OrbitControls(camera, renderer.domElement);
	
	light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
	light.position.set(camera.position.x, camera.position.y, camera.position.z);	// right light
	scene.add(light);

	let amblight = new THREE.AmbientLight(0x202020);	// ambient light
	scene.add(amblight);
	
	// create materials
	material = new THREE.MeshPhongMaterial({color:0xCC8033, specular:0x101010, shininess: 50});
	
	// create current mesh object
	currMesh = new THREE.Geometry();
	
	// load first object
	loadOBJ(objNames[0]);
}

function updateSurfaces() {
	currMesh.verticesNeedUpdate = true;
	currMesh.elementsNeedUpdate = true;
	currMesh.computeFaceNormals(); // compute face normals
	if(!flatShading) currMesh.computeVertexNormals(); // if smooth shading
	else currMesh.computeFlatVertexNormals(); // if flat shading
	
	if (surface!=null) {
		scene.remove(surface);	// remove old surface from scene
		surface.geometry.dispose();
		surface = null;
	}
	material.wireframe = wireFrame;
	surface = new THREE.Mesh(currMesh, material); // attach material to mesh
	scene.add(surface);
}

function loadOBJ(name) {
	loadOBJAsMesh(name, function(mesh) {
		coarseMesh = mesh;
		currMesh.vertices = mesh.vertices;
		currMesh.faces = mesh.faces;
		updateSurfaces();
		nsubdiv = 0;
	},
	function() {},
	function() {});
}

function onKeyDown(event) { // Key Press callback function
	switch(event.key) {
		case 'w':
		case 'W':
			wireFrame = !wireFrame;
			message(wireFrame ? 'wireframe rendering' : 'solid rendering');
			updateSurfaces();
			break;
		case 'f':
		case 'F':
			flatShading = !flatShading;
			message(flatShading ? 'flat shading' : 'smooth shading');
			updateSurfaces();
			break;
		case 's':
		case 'S':
		case ' ':
			if(nsubdiv>=5) {
				message('# subdivisions at maximum');
				break;
			}
			subdivide();
			nsubdiv++;
			updateSurfaces();
			message('# subdivisions = '+nsubdiv);
			break;
		case 'e':
		case 'E':
			currMesh.vertices = coarseMesh.vertices;
			currMesh.faces = coarseMesh.faces;
			nsubdiv = 0;
			updateSurfaces();
			message('# subdivisions = '+nsubdiv);
			break;
		case 'r':
		case 'R':
			orbit.reset();
			break;
			
	}
	if(event.key>='0' && event.key<='9') {
		let index = 9;
		if(event.key>'0')	index = event.key-'1';
		if(index<objNames.length) {
			loadOBJ(objNames[index]);
			message('loaded file '+objNames[index]);
		}
	}
}

window.addEventListener('keydown',  onKeyDown,  false);

function animate() {
	requestAnimationFrame( animate );
	//if(orbit) orbit.update();
	if(scene && camera)	{
		light.position.set(camera.position.x, camera.position.y, camera.position.z);
		renderer.render(scene, camera);
	}
}

animate();
