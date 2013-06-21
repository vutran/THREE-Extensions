/**
 * THREE.Sun
 *
 * Add a sun object into your THREE.js scene.
 *
 * @link https://github.com/vutran/THREE-Extensions
 * @author vutran / http://vu-tran.com/
 *
 * @param object params
 * @params string|array texturePath       A filename to the path of the texture file or an array of filenames (max 3)
 * @params int size                       The size of the lens flare
 * @params string color                   The color hexcode for the sun point light
 * @params array flares                   An array containing the hue, saturation, lightness, x position, y position, and z position
 * @return THREE.Sun
 */
THREE.Sun = function(params) {

  THREE.Object3D.call(this);

  // Set default size
  if(params.size === undefined) { params.size = 1500; }

  // Set default color
  if(params.color === undefined) { params.color = 0xffffff; }

  // Verify that scene, texturePath, and flares are defined
  if(params.texturePath !== undefined && params.flares !== undefined) { this.create(params); }

  return this;

};

THREE.Sun.prototype = Object.create(THREE.Object3D.prototype);

/**
 * Creates a new sun (composed of THREE.LensFlare) and appends it to the given scene
 *
 * @access public
 * @param object params
 * @return void
 */
THREE.Sun.prototype.create = function(params) {
  // Create the color object
  params.color = new THREE.Color(params.color);
  var
    sun = this,
    flare0 = false,
    flare1 = false,
    flare2 = false;
  // Grab the texture paths
  if(typeof params.texturePath === 'string') {
    flare0 = flare1 = flare2 = THREE.ImageUtils.loadTexture(params.texturePath);
  }
  else {
    flare0 = THREE.ImageUtils.loadTexture(params.texturePath[0]),
    flare1 = (typeof params.texturePath[1] !== undefined) ? THREE.ImageUtils.loadTexture(params.texturePath[1]) : flare0,
    flare2 = (typeof params.texturePath[2] !== undefined) ? THREE.ImageUtils.loadTexture(params.texturePath[2]) : flare1;
  }
  // Create a flare
  params.flares.forEach(function(x) {
    var
      light       = new THREE.PointLight(params.color, 1.5, 4500),
      flareColor  = params.color;
    // Sets the light's position
    light.position.set(x[3], x[4], x[5]);
    // Sets the light's HSL values
    light.color.setHSL(x[0], x[1], x[2]);
    // Set the flare color
    flareColor.copy(light.color);
    // Create the lens flare object
    var lensFlare = new THREE.LensFlare(flare0, params.size, 0, THREE.AdditiveBlending, flareColor);
    // Copy the params
    lensFlare.params = params;
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
    lensFlare.customUpdateCallback = sun.updateFlares;
    // Set the position
    lensFlare.position = light.position;
    // Add the light and flare
    sun.add(light);
    sun.add(lensFlare);
  });
};

/**
 * Callback event for rendering custom lens flare objects
 *
 * @access public
 * @param object object
 * @return void
 */
THREE.Sun.prototype.updateFlares = function(object) {
  // Set the pulsing intensity
  var
    flarePulseIntensity   = 0.035,
    flareIndex            = 0;
    flareLength           = this.lensFlares.length,
    flare                 = false,
    vecX                  = -object.positionScreen.x * 2,
    vecY                  = -object.positionScreen.y * 2;
  // Loop through each flare
  for(flareIndex = 0; flareIndex < flareLength; flareIndex++) {
    flare = this.lensFlares[flareIndex];
    flare.x = this.positionScreen.x + vecX * flare.distance;
    flare.y = this.positionScreen.y + vecY * flare.distance;
    flare.rotation = 0;
    if(flare.scale <= 1) { flare.scale += flarePulseIntensity; }
    else { flare.scale = 1; }
    flare.color = object.params.color;
  }
  object.lensFlares[2].y += 0.025;
  object.lensFlares[3].rotation = object.positionScreen.x * 0.5 + 45 * Math.PI / 180;
};