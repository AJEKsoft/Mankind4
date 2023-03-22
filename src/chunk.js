class Voxel {
    // Whether the voxel is visible or not, enabled or not, whether it
    // exists.
    active = false;
    // The color of the voxel; a Vec3 that gets converted to one of
    // the data types we use in the chunk mesh.
    color = new Vec3;
    // How bright the voxel is. A number from 0–1. Gets put into some
    // specified range further down the line.
    light = 0;
}

class Chunk {
    // The array of voxels — a one dimensional array for now.
    voxels = new Array;
    // The length, or the size of a single dimension of the chunk.
    get length () { return 32; }
    // The size, or the overall number of voxels (active or not) in
    // the chunk.
    get size () { return this.length * this.length * this.length; }

    constructor () {
	for (let i = 0; i < this.size; ++i) {
	    this.voxels[i] = new Voxel;
	}
    }

    makeSphere () {
	for (let z = 0; z < this.length; ++z) {
	    for (let y = 0; y < this.length; ++y) {
		for (let x = 0; x < this.length; ++x) {
		    if (Math.sqrt ((x - this.length / 2) * (x - this.length / 2) + (y - this.length / 2) * (y - this.length / 2) + (z - this.length / 2) * (z - this.length / 2)) <= this.length / 2) {
			this.getAt (x, y, z).active = true;
			this.getAt (x, y, z).color = new Vec3 (0.0, Math.random () * (1.0 - 0.5) + 0.5, 0.0);
			this.getAt (x, y, z).light = 1.0;
		    }
		}
	    }
	}
    }

    getAt (x, y, z) {
	return this.voxels[x + this.length * (y + this.length * z)];
    }
}
