/**
 * THREE.ParticleLine
 *
 * Add a particle line into your THREE.js scene.
 *
 * @link https://github.com/vutran/THREE-Extensions
 * @author vutran / http://vu-tran.com/
 */
THREE.ParticleLine = function(geometry, lineWidth, lineColor, color, speed, particleSize) {

  THREE.Object3D.call(this);

  // Set default size
  if(lineWidth === undefined) { lineWidth = 1; }

  // Set default color
  if(lineColor === undefined) { lineColor = 0x000000; }

  // Set default color
  if(color === undefined) { color = 0xffffff; }

  // Set default speed
  if(speed === undefined || isNaN(speed)) { speed = 1; }

  // Set default particle size
  if(particleSize === undefined || isNaN(particleSize)) { particleSize = 10; }

  this.create(geometry, lineWidth, lineColor, color, speed, particleSize);

  return this;

};

THREE.ParticleLine.prototype = Object.create(THREE.Object3D.prototype);

/**
 * Create a new particle line
 *
 * @param THREE.Geometry geometry
 * @param int lineWidth
 * @param string color
 * @param int speed
 * @param int particleSize
 * @return void
 */
THREE.ParticleLine.prototype.create = function(geometry, lineWidth, lineColor, color, speed, particleSize) {
  // Set properties
  this.lineGeo             = (geometry) ? geometry : new THREE.Geometry(),
  this.particleCount       = 1,
  this.particles           = new THREE.Geometry(),
  this.speed               = speed;
  // Set local variables
  var particleLine         = this,
      lineMaterialParams   = {
        color : lineColor,
        opacity : 1,
        blending : THREE.NoBlending,
        depthWrite : true,
        vertexColors : false,
        linewidth : lineWidth
      },
      lineMaterial        = new THREE.LineBasicMaterial(lineMaterialParams),
      line                = false,
      particleMaterialParams = {
        color : color,
        size : particleSize
      }
      particleMaterial    = new THREE.ParticleBasicMaterial(particleMaterialParams);
  // Create the line based on the vertices
  var line = new THREE.Line(this.lineGeo, lineMaterial);
  // Create particles and place them on the first vertex
  for(var p = 0; p < this.particleCount; p++) {
    var particle = this.lineGeo.vertices[0].clone();
    // Animate it!
    particle.animate = true;
    // Set the starting vector
    particle.start = this.lineGeo.vertices[0].clone();
    // Start the move properties
    particle.move = {
      current : p,
      next : (p + 1)
    };
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
 * // TODO: Update calculation for velocity to move along a line
 *
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
      var velocity = particle.move.diff.clone();
      var move = new THREE.Vector3();
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