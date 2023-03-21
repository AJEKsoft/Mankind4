// Major question: do we return new vectors, or is modifying the
// instance the way to go?

class Vec3 extends Float32Array {
    constructor (x = 0.0, y = x, z = y) {
	super ([x, y, z]);
    }

    get x () {
	return this[0];
    }

    set x (value) {
	this[0] = value;
    }

    get y () {
	return this[1];
    }

    set y (value) {
	this[1] = value;
    }

    get z () {
	return this[2];
    }

    set z (value) {
	this[2] = value;
    }

    get length () {
	return Math.sqrt (this.x * this.x + this.y * this.y + this.z * this.z);
    }

    get normalized () {
	if (this.length > 0) {
	    return new Vec3 (this.x / this.length, this.y / this.length, this.z / this.length);
	} else {
	    return new Vec3 ();
	}
    }

    get negated () {
	return this.multiply (new Vec3 (-1));
    }

    add (other) {
	return new Vec3 (this.x + other.x, this.y + other.y, this.z + other.z);
    }

    subtract (other) {
	return new Vec3 (this.x - other.x, this.y - other.y, this.z - other.z);
    }

    multiply (other) {
	return new Vec3 (this.x * other.x, this.y * other.y, this.z * other.z);
    }

    divide (other) {
	return new Vec3 (this.x / other.x, this.y / other.y, this.z / other.z);
    }

    dot (other) {
	return this.x * other.x + this.y * other.y + this.z * other.z;
    }

    cross (other) {
	return new Vec3 (
	    this.y * other.z - this.z * other.y,
	    this.z * other.x - this.x * other.z,
	    this.x * other.y - this.y * other.x
	);
    }
}

class Mat4 extends Float32Array {
    constructor (m00 = 1.0, m01 = 0.0, m02 = 0.0, m03 = 0.0,
		 m10 = 0.0, m11 = 1.0, m12 = 0.0, m13 = 0.0,
		 m20 = 0.0, m21 = 0.0, m22 = 1.0, m23 = 0.0,
		 m30 = 0.0, m31 = 0.0, m32 = 0.0, m33 = 1.0) {
	super ([m00, m10, m20, m30,
		m01, m11, m21, m31,
		m02, m12, m22, m32,
		m03, m13, m23, m33]);
    }
}

function Mat4LookAt (from, to, up) {
    let z = to.subtract (from).normalized.negated
    let x = up.cross (z).normalized;
    let y = z.cross (x);

    return new Mat4 (
	x.x, x.y, x.z, -from.dot (x),
	y.x, y.y, y.z, -from.dot (y),
	z.x, z.y, z.z, -from.dot (z),
    );
}

function Mat4Perspective (vfovdeg, aspect, near, far) {
    let vfovrad = vfovdeg / 180.0 * Math.PI;
    let f = 1.0 / Math.tan (vfovrad / 2.0);
    
    return new Mat4 (
	f / aspect, 0.0, 0.0,                         0.0,
	0.0,        f,   0.0,                         0.0,
	0.0,        0.0, (far + near) / (near - far), (2 * far * near) / (near - far),
	0.0,        0.0, -1.0,                        0.0
    );
}
