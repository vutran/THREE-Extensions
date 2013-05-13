/**
 * THREE.Sun
 *
 * Add a sun object into your THREE.js scene.
 *
 * @link https://github.com/vutran/THREESun
 * @author vutran / http://vu-tran.com/
 */

THREE.Sun = function(scene, texturePath, size, color, flares) {

  // Set default size
  if(size === undefined) { size = 1500; }

  // Set default color
  if(color === undefined) { color = 0xffffff; }

  // Verify that scene, texturePath, and flares are defined
  if(scene !== undefined && texturePath !== undefined && flares !== undefined) this.create(scene, texturePath, size, color, flares);

  return this;

};

THREE.Sun.prototype = {

  constructor : THREE.Sun,

  /**
   * Creates a new lens flare and appends it to the given scene
   *
   * @param THREE.Scene scene               The scene to append the lens flare to
   * @params string|array texturePath       A filename to the path of the texture file or an array of filenames (max 3)
   * @params int size                       The size of the lens flare
   * @params string color                   The color hexcode for the sun point light
   * @params array flares                   An array containing the hue, saturation, lightness, x position, y position, and z position
   * @return void
   */
  create : function(scene, texturePath, size, color, flares) {
    // lens flares
    var sun = this,
        flare0 = false,
        flare1 = false,
        flare2 = false;
    // Grab the texture paths
    if(typeof texturePath === 'string') {
      flare0 = flare1 = flare2 = THREE.ImageUtils.loadTexture(texturePath);
    }
    else {
      flare0 = THREE.ImageUtils.loadTexture(texturePath[0]),
      flare1 = (typeof texturePath[1] !== undefined) ? THREE.ImageUtils.loadTexture(texturePath[1]) : flare0,
      flare2 = (typeof texturePath[2] !== undefined) ? THREE.ImageUtils.loadTexture(texturePath[2]) : flare1;
    }
    // Create a flare
    flares.forEach(function(x) {
      var light       = new THREE.PointLight(color, 1.5, 4500),
          flareColor  = new THREE.Color(color);
      // Sets the light's position
      light.position.set(x[3], x[4], x[5]);
      // Sets the light's HSL values
      light.color.setHSL(x[0], x[1], x[2]);
      // Set the flare color
      flareColor.copy(light.color);
      // Create the lens flare object
      var lensFlare = new THREE.LensFlare(flare0, size, 0, THREE.AdditiveBlending, flareColor);
      // Set the color
      lensFlare.params = {
        texturePath : texturePath,
        size : size,
        color : color,
        flares : flares
      };
      // Create the second flare object
      lensFlare.add(flare1, 512, 0.0, THREE.AdditiveBlending);
      lensFlare.add(flare1, 512, 0.0, THREE.AdditiveBlending);
      lensFlare.add(flare1, 512, 0.0, THREE.AdditiveBlending);
      // Create the third flare object
      lensFlare.add(flare2, 60, 0.6, THREE.AdditiveBlending);
      lensFlare.add(flare2, 70, 0.7, THREE.AdditiveBlending);
      lensFlare.add(flare2, 120, 0.9, THREE.AdditiveBlending);
      lensFlare.add(flare2, 70, 1.0, THREE.AdditiveBlending);
      // Set the custom update callback
      lensFlare.customUpdateCallback = sun._updateFlare;
      // Set the position
      lensFlare.position = light.position;
      // Add the light and flare
      scene.add(light);
      scene.add(lensFlare);
    });
  },

  /**
   * Callback event for rendering custom lens flare objects
   *
   * @return void
   */
  _updateFlare : function() {
    // Set the pulsing intensity
    var flarePulseIntensity = 0.035,
        flareIndex = 0;
        flareLength = this.lensFlares.length,
        flare = false,
        vecX = -this.positionScreen.x * 2,
        vecY = -this.positionScreen.y * 2;
    // Loop through each flare
    for(flareIndex = 0; flareIndex < flareLength; flareIndex++) {
      flare = this.lensFlares[flareIndex];
      flare.x = this.positionScreen.x + vecX * flare.distance;
      flare.y = this.positionScreen.y + vecY * flare.distance;
      flare.rotation = 0;
      if(flare.scale <= 1) { flare.scale += flarePulseIntensity; }
      else { flare.scale = 1; }
      var flareColor = new THREE.Color(this.params.color);
      flare.color = flareColor;
    }
    this.lensFlares[2].y += 0.025;
    this.lensFlares[3].rotation = this.positionScreen.x * 0.5 + 45 * Math.PI / 180;
  }

};