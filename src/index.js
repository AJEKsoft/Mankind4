function $ (id) {
    return document.getElementById (id);
}

class Game {
    constructor () {
	this.canvas = $ ("gl-canvas");
	this.gl = this.canvas.getContext ("webgl2");

	this.gl.clearColor (0.3, 0.1, 0.5, 1.0);

	this.request = window.requestAnimationFrame (this.loop.bind (this));
    }

    loop (timestamp) {
	this.update (timestamp);
	this.render ();
	this.request = window.requestAnimationFrame (this.loop.bind (this));
    }

    update (timestamp) {
	
    }

    render () {
	this.gl.clear (this.gl.COLOR_BUFFER_BIT);
    }
}

window.onload = function () {
    new Game;
}
