# THREE.Sun

Add a sun object into your THREE.js scene.

# Usage

```js
var sunFlares = [
  [0.55, 0.825, 0.99, 7000, 400, -700],
  [0.08, 0.825, 0.99, 800, 200, -700],
  [0.995, 0.025, 0.99, 7000, 7000, -700]
];
sun = new THREE.Sun(scene, 'images/sun.png', 1500, 0xffffff, sunFlares);
```