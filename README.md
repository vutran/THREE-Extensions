# THREE.Sun

Add a sun object into your THREE.js scene.

## Usage

```js
var sunFlares = [
  [0.55, 0.825, 0.99, 7000, 400, -700],
  [0.08, 0.825, 0.99, 800, 200, -700],
  [0.995, 0.025, 0.99, 7000, 7000, -700]
];
var sun = new THREE.Sun('images/sun.png', 1500, 0xffffff, sunFlares);
scene.add(sun); // Add the new instance to your scene
```

# THREE.SkyBox

Add a sky box object into your THREE.js scene.

## Usage

```js
var skyBox = new THREE.SkyBox('images/skybox.jpg');
scene.add(skyBox); // Add the new instance to your scene
```

# THREE.ParticleLine

Add a particle line object into your THREE.js scene.

## Usage

```js
var geometry = new THREE.Geometry(); // create the geometry
geometry.vertices.push(new THREE.Vector3(0, 0, 50)); // add a vertex
geometry.vertices.push(new THREE.Vector3(0, 50, 150)); // add a vertex
geometry.vertices.push(new THREE.Vector3(0, 100, 200)); // add a vertex
var particleLine = new THREE.ParticleLine(geometry, 0xff0000); // create a particle line
scene.add(particleLine); // Add the new instance to your scene

particleLine.update(); // call this method in your rendering loop
```