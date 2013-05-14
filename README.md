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
scene.add(sun); // Add the new THREE.Sun instance to your scene instance
```

# THREE.SkyBox

Add a sky box object into your THREE.js scene.

## Usage

```js
var skyBox = new THREE.SkyBox('images/skybox.jpg');
scene.add(skyBox); // Add the new THREE.SkyBox instance to your scene instance
```

# THREE.ParticleLine

Add a particle line object into your THREE.js scene.

## Usage

```js
var particleLine = new THREE.ParticleLine(1, 0xff0000);
scene.add(particleLine); // Add the new THREE.ParticleLine instance to your scene instance

particleLine.update(); // call this method in your rendering loop
```