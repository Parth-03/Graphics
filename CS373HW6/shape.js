/* Intersection structure:
 * t:        ray parameter (float), i.e. distance of intersection point to ray's origin
 * position: position (THREE.Vector3) of intersection point
 * normal:   normal (THREE.Vector3) of intersection point
 * material: material of the intersection object
 */
class Intersection {
	constructor() {
		this.t = 0;
		this.position = new THREE.Vector3();
		this.normal = new THREE.Vector3();
		this.material = null;
	}
	set(isect) {
		this.t = isect.t;
		this.position = isect.position;
		this.normal = isect.normal;
		this.material = isect.material;
	}
}

/* Plane shape
 * P0: a point (THREE.Vector3) that the plane passes through
 * n:  plane's normal (THREE.Vector3)
 */
class Plane {
	constructor(P0, n, material) {
		this.P0 = P0.clone();
		this.n = n.clone();
		this.n.normalize();
		this.material = material;
	}
	// Given ray and range [tmin,tmax], return intersection point.
	// Return null if no intersection.
	intersect(ray, tmin, tmax) {
		let temp = this.P0.clone();
		temp.sub(ray.o); // (P0-O)
		let denom = ray.d.dot(this.n); // d.n
		if(denom==0) { return null;	}
		let t = temp.dot(this.n)/denom; // (P0-O).n / d.n
		if(t<tmin || t>tmax) return null; // check range
		let isect = new Intersection();   // create intersection structure
		isect.t = t;
		isect.position = ray.pointAt(t);
		isect.normal = this.n;
		isect.material = this.material;
		return isect;
	}
}

/* Sphere shape
 * C: center of sphere (type THREE.Vector3)
 * r: radius
 */
class Sphere {
	constructor(C, r, material) {
		this.C = C.clone();
		this.r = r;
		this.r2 = r*r;
		this.material = material;
	}
	intersect(ray, tmin, tmax) 
	{
// ===YOUR CODE STARTS HERE===
		//console.log(ray);
		let a= 1; //|d|^2
		let tempO= ray.o.clone().sub(this.C); // (O-C)
		let temp2O= tempO.clone().multiplyScalar(2);
		let b=temp2O.dot(ray.d); //2(O-C).d
		let c= /*((tempO.x*tempO.x) + (tempO.y*tempO.y) + (tempO.z*tempO.z))*/tempO.lengthSq() - this.r2; // |O-C|^2 - r^2

		let det= (b*b)-(4*a*c); // B^2 - 4AC
		let t1= ((-1*b)+ Math.sqrt(det))/(2*a);
		let t2= ((-1*b)- Math.sqrt(det))/(2*a);
		let t=null;
		if(det<0)
			return null;
		else if(det==0)
		{
			if(t1>0)
				t=t1;
		}
		else
		{
			if(t1>0 && t2<0)
				t=t1;
			else if(t1<0 && t2>0)
				t=t2;
			else if(t1<0 && t2<0)
				return null;
			else
			{
				/*if(t1>t2)
					t=t2;
				else
					t=t1;*/

				/*if(t2<tmin && tmin<=t1 && t1<=tmax)
					t=t1;
				else if(tmin<=t2 && t2<=tmax)
					t=t2;
				else
					return null;*/
				if ( t2 <= tmax && t2 >= tmin){ // we know t2 is smaller check that first
					t = t2
				}else if ( t1 <= tmax && t1 >= tmin){ // if not t2 then check t1
					t = t1
				}else{ // else both fail
					return null
				}
			}
			
		}
		if(t<tmin || t>tmax)
			return null; // check range
		let isect = new Intersection();   // create intersection structure
		isect.t = t;
		isect.position = ray.pointAt(t);
		isect.normal = isect.position.clone();
		isect.normal.sub(this.C);
		isect.normal.normalize();
		isect.material = this.material;
		return isect;


// ---YOUR CODE ENDS HERE---
		//return null;
	}
}

class Triangle {
	/* P0, P1, P2: three vertices (type THREE.Vector3) that define the triangle
	 * n0, n1, n2: normal (type THREE.Vector3) of each vertex */
	constructor(P0, P1, P2, material, n0, n1, n2) {
		this.P0 = P0.clone();
		this.P1 = P1.clone();
		this.P2 = P2.clone();
		this.material = material;
		if(n0) this.n0 = n0.clone();
		if(n1) this.n1 = n1.clone();
		if(n2) this.n2 = n2.clone();

		// below you may pre-compute any variables that are needed for intersect function
		// such as the triangle normal etc.
// ===YOUR CODE STARTS HERE===
		this.normal= this.P1.clone().sub(this.P0).cross(this.P2.clone().sub(this.P0)).normalize();
// ---YOUR CODE ENDS HERE---
	} 

	intersect(ray, tmin, tmax) 
	{
// ===YOUR CODE STARTS HERE===
		let mat = new THREE.Matrix3();
		mat.set(ray.d.x, ray.d.y, ray.d.z, 
				this.P2.x- this.P0.x, this.P2.y- this.P0.y, this.P2.z- this.P0.z, 
				this.P2.x- this.P1.x, this.P2.y- this.P1.y, this.P2.z- this.P1.z);
		
		if(mat.determinant()==0)
			return null;
		
		let A= new THREE.Matrix3();
		A.set(this.P2.x- ray.o.x, this.P2.y- ray.o.y, this.P2.z- ray.o.z, 
			this.P2.x- this.P0.x, this.P2.y- this.P0.y, this.P2.z- this.P0.z, 
			this.P2.x- this.P1.x, this.P2.y- this.P1.y, this.P2.z- this.P1.z);

		let B = new THREE.Matrix3();
		B.set(ray.d.x, ray.d.y, ray.d.z, 
			this.P2.x- ray.o.x, this.P2.y- ray.o.y, this.P2.z- ray.o.z, 
			this.P2.x- this.P1.x, this.P2.y- this.P1.y, this.P2.z- this.P1.z);
		
		let C = new THREE.Matrix3();
		C.set(ray.d.x, ray.d.y, ray.d.z, 
			this.P2.x- this.P0.x, this.P2.y- this.P0.y, this.P2.z- this.P0.z, 
			this.P2.x- ray.o.x, this.P2.y- ray.o.y, this.P2.z- ray.o.z);

		let t= A.determinant()/mat.determinant();
		let alpha= B.determinant()/mat.determinant();
		let beta= C.determinant()/mat.determinant();
			
		if(alpha>=0 && beta>=0 && t>=0 && (alpha+beta)<=1)
		{
			if(t<tmin || t>tmax) // check range
				return null; 
			let isect = new Intersection();   // create intersection structure
			isect.t = t;
			isect.position = ray.pointAt(t);
			if(this.n0 && this.n1 && this.n2)
			{
				isect.normal= this.n0.clone().multiplyScalar(alpha);
				isect.normal.add(this.n1.clone().multiplyScalar(beta));
				isect.normal.add(this.n2.clone().multiplyScalar(1-alpha-beta));
				isect.normal.normalize();
			}
			else
				isect.normal= this.normal;
			isect.material = this.material;
			return isect;
		}
// ---YOUR CODE ENDS HERE---
		return null;
	}
}

function shapeLoadOBJ(objname, material, smoothnormal) {
	loadOBJAsMesh(objname, function(mesh) { // callback function for non-blocking load
		if(smoothnormal) mesh.computeVertexNormals();
		for(let i=0;i<mesh.faces.length;i++) {
			let p0 = mesh.vertices[mesh.faces[i].a];
			let p1 = mesh.vertices[mesh.faces[i].b];
			let p2 = mesh.vertices[mesh.faces[i].c];
			if(smoothnormal) {
				let n0 = mesh.faces[i].vertexNormals[0];
				let n1 = mesh.faces[i].vertexNormals[1];
				let n2 = mesh.faces[i].vertexNormals[2];
				shapes.push(new Triangle(p0, p1, p2, material, n0, n1, n2));
			} else {
				shapes.push(new Triangle(p0, p1, p2, material));
			}
		}
	}, function() {}, function() {});
}

/* ========================================
 * You can define additional Shape classes,
 * as long as each implements intersect function.
 * ======================================== */
