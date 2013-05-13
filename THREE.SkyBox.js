/**
 * THREE.SkyBox
 *
 * Add a sky box object into your THREE.js scene.
 *
 * @link https://github.com/vutran/THREE-Extensions
 * @author vutran / http://vu-tran.com/
 */
THREE.SkyBox = function(textures, size) {

  THREE.Object3D.call(this);
  
  if(size === undefined) { size = 1000; }

  // Verify that textures are defined
  if(textures) this.create(textures, size);

  return this;

};

THREE.SkyBox.prototype = Object.create(THREE.Object3D.prototype);

/**
 * Creates a sky box
 *
 * @params string|array textures            A filename for a repeating sky box texture or an array of textures
 * @params int size                         The size of each sky box face
 * @return void
 */
THREE.SkyBox.prototype.create = function(textures, size) {
  var skyBox = this,
      sides = [];
  // Grab the textures
  if(typeof textures === 'string') {
    var addIndex       = 0,
        addLength      = 6;
    // Create the sides (same texture file)
    for(addIndex = 0; addIndex < addLength; addIndex++) { sides.push(textures); }
    // Reset the textures
    textures = sides;
  }
  var textureIndex   = 0,
      totalSides     = 6,
      path           = false,
      materials      = [],
      shader         = THREE.ShaderLib['cube'];
  for(textureIndex = 0; textureIndex < totalSides; textureIndex++) {
    if(typeof textures[textureIndex] !== undefined) {
      path = textures[textureIndex];
      // Create the image
      var img = new Image();
      img.src = path;
      // Create the texture
      var texture = new THREE.Texture(img);
      // Store the texture object into the image as a new property
      img.texture = texture;
      img.onload = function() {
        this.texture.needsUpdate = true;
      };
      material = new THREE.MeshBasicMaterial({
        color : 0xffffff,
        map : texture,
        side : THREE.BackSide
      });
      materials.push(material);
      // Set the shader's cube mapping
      shader.uniforms['tCube'].texture = materials;
      // Create the mesh object
      var geometry    = new THREE.CubeGeometry(size, size, size),
          meshFace    = new THREE.MeshFaceMaterial(materials),
          mesh        = new THREE.Mesh(geometry, meshFace);
      skyBox.add(mesh);
    }
  }
};