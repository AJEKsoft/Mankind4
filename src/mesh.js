class VertexMesh {
    // Reference to current GL context.
    #gl;
    // Vertex Array Object.
    #vao;
    // A buffer object holding the vertex positions.
    #vbo;
    // An array holding the vertex positions.
    vertices = new Array ();
    
    constructor (gl) {
	this.#gl = gl;
	this.#vao = this.#gl.createVertexArray ();
	this.#vbo = this.#gl.createBuffer ();

	this.#gl.bindBuffer (this.#gl.ARRAY_BUFFER, this.#vbo);
	this.#gl.bindVertexArray (this.#vao);
	this.#gl.enableVertexAttribArray (0);
	this.#gl.vertexAttribPointer (0, 3, this.#gl.FLOAT, false, 0, 0);
    }

    realize () {
	this.#gl.bindBuffer (this.#gl.ARRAY_BUFFER, this.#vbo);
	this.#gl.bufferData (this.#gl.ARRAY_BUFFER, new Float32Array (this.vertices), this.#gl.STATIC_DRAW);
    }

    render () {
	this.#gl.bindVertexArray (this.#vao);
	this.#gl.drawArrays (this.#gl.TRIANGLES, 0, this.vertices.length / 3);
    }
}

const CHUNK_DIM = 32;
const CHUNK_SIZE = CHUNK_DIM * CHUNK_DIM * CHUNK_DIM;

function color8 (r, g, b) {
    return ((r & 0x7) << 0) | ((g & 0x7) << 3) | ((b & 0x3) << 6);
}

class ChunkMesh {
    // Reference to current GL context.
    #gl;
    // Vertex Array Object.
    #vao;
    // A buffer holding the vertices of a single quad.
    #qvbo;
    // Same, but indices.
    #qebo;			// nafide
    // A buffer holding the colors, per-voxel.
    #vcbo;
    // A buffer holding extra information, per-voxel.
    #vebo;
    
    // All of the following should be in a seperate chunk class, as it
    // really has more to do with a Chunk than with its mesh. The mesh
    // should merely pack all of this data into suitable buffers (or a
    // single buffer).
    
    // Here, we begin the per-voxel information. First, every voxel
    // has its colour: for now, we stick to an 8-bit color — red,
    // green and blue packed into a single byte.
    colors = new Array;
    // We use another byte to store other information. How this
    // particular byte is used is as follows (each point in the list
    // is a bit):
    //
    // 1. whether the voxel is visible or not, either true or false
    // 2. reserved for lighting level
    // 3. - || -
    // 4. - || -
    // 5. - || -
    // 6. - || -
    // 7. - || -
    // 8. - || -
    visible = new Array;
    lighting = new Array;
    
    constructor (gl) {
	this.#gl = gl;
	this.#vao = this.#gl.createVertexArray ();
	this.#qvbo = this.#gl.createBuffer ();
	this.#qebo = this.#gl.createBuffer ();
	this.#vcbo = this.#gl.createBuffer ();
	this.#vebo = this.#gl.createBuffer ();

	this.debugFill ();
	
	this.#gl.bindVertexArray (this.#vao);
	// Generate the quad buffer — this is the "voxel". First, we
	// start with the vertices.
	this.#gl.bindBuffer (this.#gl.ARRAY_BUFFER, this.#qvbo);
	this.#gl.bufferData (this.#gl.ARRAY_BUFFER, new Int8Array ([
	    -1, -1,  -1, 1,  1, 1,  1, -1
	]), this.#gl.STATIC_DRAW);
	// The vertex positions of a single quad — every instance
	// shares this.
	this.#gl.enableVertexAttribArray (0);
	this.#gl.vertexAttribIPointer (0, 2, this.#gl.BYTE, false, 0, 0);
	this.#gl.vertexAttribDivisor (0, 0);

	// Now, the indices.
	this.#gl.bindBuffer (this.#gl.ELEMENT_ARRAY_BUFFER, this.#qebo);
	this.#gl.bufferData (this.#gl.ELEMENT_ARRAY_BUFFER, new Uint8Array ([
	    0, 1, 2,  0, 2, 3
	]), this.#gl.STATIC_DRAW);
    }

    generate (chunk) {
	// Based on the chunk given, we generate all the buffers.

	// First, we generate the colors.
	let colors = new Uint8Array (chunk.size);
	for (let i = 0; i < chunk.size; ++i) {
	    let color = chunk.voxels[i].color;
	    let r = Math.floor (color.x * 7);
	    let g = Math.floor (color.y * 7);
	    let b = Math.floor (color.z * 3);
	    colors[i] = color8 (r, g, b);
	}

	// Now, which voxels are visible and which are not.
	let active = new Uint8Array (chunk.size);
	for (let i = 0; i < chunk.size; ++i) {
	    active[i] = chunk.voxels[i].active ? 1 : 0;
	}
	
	// Generate the color buffer.
	this.#gl.bindBuffer (this.#gl.ARRAY_BUFFER, this.#vcbo);
	this.#gl.bufferData (this.#gl.ARRAY_BUFFER, new Uint8Array (colors), this.#gl.STATIC_DRAW);
	// The color of a voxel. Per instance.
	this.#gl.enableVertexAttribArray (1);
	this.#gl.vertexAttribIPointer (1, 1, this.#gl.UNSIGNED_BYTE, false, 0, 0);
	this.#gl.vertexAttribDivisor (1, 1);

	// Generate the extra information buffer.
	this.#gl.bindBuffer (this.#gl.ARRAY_BUFFER, this.#vebo);
	this.#gl.bufferData (this.#gl.ARRAY_BUFFER, new Uint8Array (active), this.#gl.STATIC_DRAW);
	// Per-instance.
	this.#gl.enableVertexAttribArray (2);
	this.#gl.vertexAttribIPointer (2, 1, this.#gl.UNSIGNED_BYTE, false, 0, 0);
	this.#gl.vertexAttribDivisor (2, 1);
    }

    // This function fills the colors, visible, and lighting variables
    // with some random gibberish for debugging.
    debugFill () {
	for (let i = 0; i < CHUNK_SIZE; ++i) {
	    this.colors[i] = Math.floor (Math.random () * 255);

	    if (Math.random () > 0.9) {
		this.visible[i] = 1;
	    } else {
		this.visible[i] = 0;
	    }
	}
    }

    render () {
	this.#gl.bindVertexArray (this.#vao);
	this.#gl.drawElementsInstanced (this.#gl.TRIANGLES, 6, this.#gl.UNSIGNED_BYTE, 0, CHUNK_SIZE);
    }
}
