# THREE.Sun

Add a sun object into your THREE.js scene.

## Usage

    var sunFlares = [
      [0.55, 0.825, 0.99, 7000, 400, -700],
      [0.08, 0.825, 0.99, 800, 200, -700],
      [0.995, 0.025, 0.99, 7000, 7000, -700]
    ];
    var sun = new THREE.Sun({
      texturePath : 'images/sun.png',
      size : 1500,
      color : 0xffffff,
      flares: sunFlares
    });
    (sun); // Add the new instance to your scene

# THREE.SkyBox

Add a sky box object into your THREE.js scene.

## Usage

    var skyBox = new THREE.SkyBox('images/skybox.jpg');
    scene.add(skyBox); // Add the new instance to your scene

# THREE.SkyCan

Add a cylinder sky box object into your THREE.js scene.

## Usage

    var skyCan = new THREE.SkyCan({
      textures : ['images/sides.jpg', 0xff0000, 0x0000ff] // top is red, bottom is blue
    });
    scene.add(skyCan); // Add the new instance to your scene


# THREE.ParticleLine

Add a particle line object into your THREE.js scene.

## Usage

    var geometry = new THREE.Geometry(); // create the geometry
    geometry.vertices.push(new THREE.Vector3(0, 0, 50)); // add a vertex
    geometry.vertices.push(new THREE.Vector3(0, 50, 150)); // add a vertex
    geometry.vertices.push(new THREE.Vector3(0, 100, 200)); // add a vertex
    var particleLine = new THREE.ParticleLine({
      geometry : geometry, // the line geometry object
      lineWidth : 10, // line width
      lineColor : 0xff0000, // line color,
      color : 0xffff00, // particle color,
      size : 30 // particle size
    });
    scene.add(particleLine); // Add the new instance to your scene

    particleLine.update(); // call this method in your rendering loop