/**
 * THREE.ParticleLine
 *
 * Add a particle line into your THREE.js scene.
 *
 * @link https://github.com/vutran/THREE-Extensions
 * @author vutran / http://vu-tran.com/
 */
THREE.ParticleLine = function(lineWidth, color) {

  THREE.Object3D.call(this);

  // Set default size
  if(lineWidth === undefined) { lineWidth = 1; }

  // Set default color
  if(color === undefined) { color = 0xffffff; }

  this.create(lineWidth, color);

  return this;

};

THREE.ParticleLine.prototype = Object.create(THREE.Object3D.prototype);

/**
 * Create a new particle line
 *
 * // Technical notes: create a line, and add particles into the vertices of the line
 * // and while rendering, move the particle system along the vertices.
 *
 * @param int lineWidth
 * @param string color
 * @param int speed
 * @return void
 */
THREE.ParticleLine.prototype.create = function(lineWidth, color) {
  // Set properties
  this.lineGeo             = new THREE.Geometry(),
  this.particleCount       = 1,
  this.particles           = new THREE.Geometry(),
  this.speed               = 1;
  // Set local variables
  var particleLine         = this,
      lineMaterialParams   = {
        color : color,
        opacity : 1,
        blending : THREE.AdditiveBlending,
        depthWrite : true,
        vertexColors : true,
        lineWidth : 1
      },
      lineMaterial        = new THREE.LineBasicMaterial(lineMaterialParams),
      line                = false,
      particleMaterial    = new THREE.ParticleBasicMaterial({color: 0xff0000, size: 10});
  // Create the line vertices
  this.lineGeo.vertices.push(new THREE.Vector3(-100, 100, 50));
  this.lineGeo.vertices.push(new THREE.Vector3(100, 100, 50));
  this.lineGeo.vertices.push(new THREE.Vector3(100, 100, 200));
  this.lineGeo.vertices.push(new THREE.Vector3(-200, 100, 200));
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
    particle.move.nextVector = this.lineGeo.vertices[particle.move.next];
    particle.move.diff = particle.clone().sub(particle.move.nextVector);
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
        // If the next vector vector
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
          /* // Update the current move index
          particle.move.current = 0;
          // Update the next index
          particle.move.next = particle.move.current + 1;
          // Update the next vector
          particle.move.nextVector = this.lineGeo.vertices[particle.move.next];
          // Update the next vector diff
          particle.move.diff = particle.clone().sub(particle.move.nextVector);
          var start = particle.start;
          particle.set(start.x, start.y, start.z); */
          
        }
      }
    }
  }
  // Set the dirt vertices (internal)
  this.particleSystem.geometry.__dirtyVertices = true;
};