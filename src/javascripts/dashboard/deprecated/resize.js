// resizable module inspired by answer by Andrew Willems answer at https://stackoverflow.com/questions/35702705/is-there-a-way-to-change-the-css-resize-corners-position

let resizer = {

  getResizable: function() {
    if (!this._resizable) {
      this._resizable = document.querySelector("#resizable");
    }
    return this._resizable;
  },
  getResizeHandle: function() {
    if (!this._resizeHandle) {
      this._resizeHandle = document.querySelector("#resize-handle");
    }
    return this._resizeHandle;
  },
  ht: undefined,
  y: undefined,
  dy: undefined,

  startResize: function(evt) {
    this.ht = this.getResizable().offsetHeight;
    this.y = evt.screenY;
  },

  resize: function(evt) {
    this.dy = evt.screenY - this.y;
    this.y = evt.screenY;
    this.ht -= this.dy;
    console.log(this);
    this.getResizable().style.height = this.ht + "px";
  }

};

// activate the resizer
resizer.getResizeHandle().addEventListener("mousedown", function(evt) {
  resizer.startResize(evt);
  document.body.addEventListener("mousemove", resizer.resize);
  document.body.addEventListener("mouseup", function() {
    resizer.getResizeHandle().body.removeEventListener("mousemove", resizer.resize);
  });
});

module.exports = resizer;