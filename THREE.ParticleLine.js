/**
 * THREE.ParticleLine
 *
 * Add a particle line into your THREE.js scene.
 *
 * @link https://github.com/vutran/THREE-Extensions
 * @author vutran / http://vu-tran.com/
 *
 * @param object params
 * @param THREE.Geometry geometry             The line geometry
 * @param int lineWidth                       The width of the line
 * @param int lineColor                       The color of the line
 * @param string color                        The color of the particle
 * @param int speed                           Speed of which the particle is moving through the line
 * @param int particleSize                    The size of the particle
 */
THREE.ParticleLine = function(params) {

  THREE.Object3D.call(this);

  // Set default size
  if(params.lineWidth === undefined) { params.lineWidth = 1; }

  // Set default color
  if(params.lineColor === undefined) { params.lineColor = 0x000000; }

  // Set default color
  if(params.color === undefined) { params.color = 0xffffff; }

  // Set default speed
  if(params.speed === undefined || isNaN(params.speed)) { params.speed = 1; }

  // Set default particle size
  if(params.particleSize === undefined || isNaN(params.particleSize)) { params.particleSize = 10; }

  this.create(params);

  return this;

};

THREE.ParticleLine.prototype = Object.create(THREE.Object3D.prototype);

/**
 * Create a new particle line
 *
 * @access public
 * @param object params
 * @return void
 */
THREE.ParticleLine.prototype.create = function(params) {
  // Set properties
  this.lineGeo             = (params.geometry) ? params.geometry : new THREE.Geometry(),
  this.particleCount       = 1,
  this.particles           = new THREE.Geometry(),
  this.speed               = params.speed;
  // Set local variables
  var
    particleLine           = this,
    lineMaterialParams     = {
      color                : params.lineColor,
      opacity              : 1,
      blending             : THREE.NoBlending,
      depthWrite           : true,
      vertexColors         : false,
      linewidth            : params.lineWidth
    },
    lineMaterial           = new THREE.LineBasicMaterial(lineMaterialParams),
    line                   = false,
    particleMaterialParams = {
      color                : params.color,
      size                 : params.particleSize
    }
    particleMaterial       = new THREE.ParticleBasicMaterial(particleMaterialParams);
  // Create the line based on the vertices
  var
    line                   = new THREE.Line(this.lineGeo, lineMaterial),
    p                      = 0,
    pCount                 = this.particleCount;
  // Create particles and place them on the first vertex
  for(p = 0; p < pCount; p++) {
    var
      vertex               = this.lineGeo.vertices[0],
      nextVertex           = false,
      particle             = vertex.clone();
    // Animate it!
    particle.animate = true;
    // Set the starting vector
    particle.start = vertex.clone();
    // Start the move properties
    particle.move = {
      current             : p,
      next                : (p + 1)
    };
    // Set the next vertex
    particle.move.nextVector = (this.lineGeo.vertices[particle.move.next] !== undefined) ? this.lineGeo.vertices[particle.move.next] : new THREE.Geometry();
    particle.move.diff = (particle.move.nextVector) ? particle.clone().sub(particle.move.nextVector) : new THREE.Geometry();
    this.particles.vertices.push(particle);
  }
  this.particleSystem = new THREE.ParticleSystem(this.particles, particleMaterial);
  this.particleSystem.sortParticles = true;
  // Add the particle system to the line
  line.add(this.particleSystem);
  // Add the line to the particle line
  particleLine.add(line);
};

/**
 * Render update callback
 *
 * @access public
 * @return void
 */
THREE.ParticleLine.prototype.update = function() {
  // Retrieve the particle count in this line
  var pCount = this.particleCount;
  // Loop through all
  while(pCount--) {
    var particle = this.particles.vertices[pCount];
    if(particle.animate) {
      // Create the velocity vector
      var
        velocity = particle.move.diff.clone(),
        move = new THREE.Vector3();
      if(velocity.x !== 0) {
        if(velocity.x < 0) {
          velocity.x = this.speed;
        }
        else {
          velocity.x = -this.speed;
        }
      }
      if(velocity.y !== 0) {
        if(velocity.y < 0) {
          velocity.y = this.speed;
        }
        else {
          velocity.y = -this.speed;
        }
      }
      if(velocity.z !== 0) {
        if(velocity.z < 0) {
          velocity.z = this.speed;
        }
        else {
          velocity.z = -this.speed;
        }
      }
      particle.add(velocity);
      // If distance is reached, update the next index and vectors
      if(particle.distanceTo(particle.move.nextVector) === 0) {
        // Update the current move index
        particle.move.current = particle.move.next;
        // Update the next index
        particle.move.next++;
        // If the next vector exists
        if(this.lineGeo.vertices[particle.move.next] !== undefined) {
          // Update the next vector
          particle.move.nextVector = this.lineGeo.vertices[particle.move.next];
          // Update the next vector diff
          particle.move.diff = particle.clone().sub(particle.move.nextVector);
        }
        // Reset the particle position
        else {
          // Turn off animation
          particle.animate = false;
          // Reset position
          particle.set(particle.start.x, particle.start.y, particle.start.z);
          // Reset move index
          particle.move.current = 0;
          particle.move.next = particle.move.current + 1;
          particle.move.nextVector = this.lineGeo.vertices[particle.move.next].clone();
          particle.move.diff = particle.clone().sub(particle.move.nextVector);
          particle.animate = true;
        }
      }
    }
  }
  // Set the dirt vertices (internal)
  this.particleSystem.geometry.__dirtyVertices = true;
};