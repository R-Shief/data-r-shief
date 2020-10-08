let {map_range} = require('./vizTools.js');

class Control {
  constructor() {
    this.binds = new Set();
    this.mouse = {x:undefined, y: undefined};
    document.addEventListener( 'mousemove', (event) => {
      this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }, false );
  }

  bind(options) {
    this.binds.add( Object.assign({ref:null, key:null, axis:null, range_low:0, range_high:1, min:0, max: 1, overider:null}, options) );
  }

  update() {

    this.binds.forEach((bind) => {
      re_ranged = Math.max(Math.min(map_range(this.mouse[bind.axis], -1, 1, bind.range_low, bind.range_high), bind.max), bind.min);
      if (!bind.overider) {
        bind.ref[bind.key] = re_ranged;
      } else {
        bind.overider.update(re_ranged);
      }
    });

  }
}

module.exports = Control;
