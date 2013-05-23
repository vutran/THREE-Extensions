/**
 * THREE.SkyCan
 *
 * Add a sky can (cylinder sky box) object into your THREE.js scene.
 *
 * @link https://github.com/vutran/THREE-Extensions
 * @author vutran / http://vu-tran.com/
 * @param object params
 * @param array params.textures                   An array of textures for the cylinder (tube, top cap, bottom cap). Textures can be a string that points to the path of the file, or a color number code (example: 0xff0000 for red).
 * @param int params.radius                       The radius of the cylinder
 * @param int params.height                       The height of the cylinder
 * @param int params.radiusSegment                Number of segmented faces around the circumference of the cylinder
 * @param int params.heightSegment                Number of segmented faces along the height of the cylinder
 * @param bool params.openEnded                   A boolean indicating whether or not to cap the ends of the cylinder
 */
THREE.SkyCan = function(params) {

  THREE.Object3D.call(this);

  if(params.radius === undefined) { params.radius = 300; }

  if(params.height === undefined) { params.height = params.radius; }

  if(params.radiusSegment === undefined) { params.radiusSegment = 8; }

  if(params.heightSegment === undefined) { params.heightSegment = 1; }

  if(params.openEnded === undefined) { params.openEnded = false; }

  // Verify that textures are defined
  if(params.textures) this.create(params);

  return this;

};

THREE.SkyCan.prototype = Object.create(THREE.Object3D.prototype);

/**
 * Creates a sky can
 *
 * @access public
 * @param object $params
 * @return void
 */
THREE.SkyCan.prototype.create = function(params) {
  var skyCan         = this,
      sides          = [],
      textureIndex   = 0,
      totalSides     = (params.radiusSegment * params.heightSegment),
      path           = false,
      materials      = []
  // Loop through each texture and create the material
  params.textures.forEach(function(path) {
    // Create the empty material
    var material = new THREE.MeshBasicMaterial({
      side : THREE.BackSide
    });
    // If it's a string, must be a filename
    if(typeof path === 'string') {
      // Create the image
      var img = new Image();
      img.src = path;
      // Create the texture
      var texture = new THREE.Texture(img);
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(2, 1);
      // Store the texture object into the image as a new property
      img.texture = texture;
      img.onload = function() {
        this.texture.needsUpdate = true;
      };
      // Map the texture
      material.map = texture;
    }
    // If it's a number, must be a hex color code
    else if(typeof path === 'number') {
      material.color = new THREE.Color(path);
    }
    materials.push(material);
  });

  // Create the mesh object
  var geometry    = new THREE.CylinderGeometry(params.radius, params.radius, params.height, params.radiusSegment, params.heightSegment, params.openEnded),
      meshFace    = new THREE.MeshFaceMaterial(materials),
      mesh        = new THREE.Mesh(geometry, meshFace),
      faceIndex   = 0,
      faceLength  = geometry.faces.length;

  for(faceIndex = 0; faceIndex < faceLength; faceIndex++) {
    var face = geometry.faces[faceIndex];
    if(face instanceof THREE.Face3) {
      // Top cap
      if(face.centroid.y > 0) {
        face.materialIndex = 1;
      }
      // Bottom cap
      else {
        face.materialIndex = 2;
      }
    }
  }

  // Add the mesh to the root object
  skyCan.add(mesh);
};