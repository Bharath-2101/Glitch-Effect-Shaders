# Glitch Effect in Shaders

Actually it is not a glitch effect its rgb channels split method for creating an hallucination for eye that picutre or content is glitching. It is also called as "Chromatic Abberivation." If you follow this doc you will get an idea how to create this effect.

<br/>

# Step-1:

```bash
# For creating react app with vite plugins and also finish with mandotry options.
# You can give any name at place of GlitchEffect.

npm create vite@latest GlitchEffect
```

After npm installing remove everything which are unwanted for project like assets and public assets etc. It makes our project cleaner and lighter.

<br/>

# Step-2:

Added the following dependencies for creating the effect or use below commands for installing.

```bash
# This are requried dependencies

npm i three @react-three/fiber @react-three/drei

# If you think you playaround with values of input you can use leva
# for that uncomment below command and paste it.

# npm i leva
```

Now try run the project with basic "Hello" msg for confirming nothing went wrong.

<br/>

# Step-3:

Now we need setup somethings for our project.

### App.jsx

```jsx
import { Canvas } from "@react-three/fiber";
import Model from "./components/Model";

const App = () => {
  return (
    <div style={{ height: "100dvh", width: "100dvw" }}>
      <Canvas style={{ background: "black" }}>
        <Model /> //Dont add mesh here we can't run r3f hooks outside Canvas.
      </Canvas>
    </div>
  );
};

export default App;
```

### Model.jsx

```jsx
import React from "react";

const Model = () => {
  return (
    <group>
      <mesh>
        <planeGeometry args={[1, 1, 1, 50]} />
        <meshBasicMaterial color={"red"} />
      </mesh>
    </group>
  );
};

export default Model;
```

Above code give us a square plane with red background on screen if it visible the program running correctly. After that create two files with below names and code in it.

### Fragment.js

```javascript
const Fragment = `
varying vec2 vUv;

void main() {
    gl_FragColor = vec4(vUv.x,vUv.y,0.,1.);
}
`;

export { Fragment };
```

### Vertex.js

```javascript
const Vertex = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export { Vertex };
```

We will use above files for our shader material.

<br/>

# Step-4:

Now for creating effect we need to replace

```jsx
<meshBasicMaterial color={"red"} />
```

with

```jsx
import { Fragment } from "../shaders/Fragment";
import { Vertex } from "../shaders/Vertex";

<shaderMaterial vertexShader={Vertex} fragmentShader={Fragment} />;
```

If we refresh the page we get a rainbow gradient on the plane background. By this we set fragmentshader and vertexshader correctly.

<br/>

# Step-5:

Now we need to add a image texture to the plane (Its better to add black and white for better glitch effect or any Image will work) for that we use uniforms from the react to shaders.

### Model.jsx

```jsx
// imports

import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { Fragment } from "../shaders/Fragment";
import { Vertex } from "../shaders/Vertex";

// Load the image texture into the texture variable for using it.
// For Loading it we use useLoader Hook from react-three/drei

const texture = useLoader(TextureLoader, "public/image.png");

// create a uniforms with useRef to pass it to shaders as uniforms

const uniforms = useRef({
  u_texture: { value: texture },
});

// Pass the uniforms to the shaderMaterial

<shaderMaterial
  vertexShader={Vertex}
  fragmentShader={Fragment}
  uniforms={uniforms.current}
/>;
```

update below files for image as background for plane.

### Fragment.js

```javascript
const Fragment = `
varying vec2 vUv;
uniform sampler2D u_texture;
void main() {
     vec4 texColor=texture2D(u_texture,vUv);
    gl_FragColor = texColor;
}
`;

export { Fragment };
```

Now we are able to see a image background for the plane.

<br/>

# Step-6:

Now, we have two ways of showing it one animating it for ever or just add it don't care.
I am following first one, but you can do it either way following first one.
Now, I need to get u_time uniform from react for animating the glitch effect over time. For that

### Model.jsx

```jsx
// imports
import React, { useRef, useEffect } from "react";
import { Fragment } from "../shaders/Fragment";
import { Vertex } from "../shaders/Vertex";
import { useFrame, useLoader } from "@react-three/fiber";
import { DoubleSide, TextureLoader } from "three";

const mesh = useRef();
const texture = useLoader(TextureLoader, "/RippleImage.jpg");
const uniforms = useRef({
  u_texture: { value: texture },
  u_time: { value: 0 },
});

useFrame((state) => {
  const { clock } = state;
  uniforms.current.u_time.value = clock.getElapsedTime();
});

<mesh ref={mesh} scale={scale}>
  <planeGeometry args={[1, 1, 1, 50]} />
  <shaderMaterial
    vertexShader={Vertex}
    fragmentShader={Fragment}
    uniforms={uniforms.current}
    side={DoubleSide}
  />
</mesh>;
```

### Fragment.js

```javascript
const Fragment = `
varying vec2 vUv;
uniform sampler2D u_texture;
uniform float u_time;
const float offset=0.03;


void main() {
    float s=sin(u_time);     //For animating it in loop

    s = s * offset+ 0.1;    //The distance between original and present colors.
    s *= 0.024;
    vec4 texColor = texture2D(u_texture, vUv);

    vec2 redCoord = vUv;
    redCoord.x -= s;
    float red = texture2D(u_texture, redCoord).r; //For spliting redchannel

    vec2 blueCoord = vUv;
    blueCoord.x += s;
    float blue = texture2D(u_texture, blueCoord).b; //For spliting bluechannel

    texColor.r = red;
    texColor.b = blue;

    gl_FragColor = texColor;
}
`;

export { Fragment };
```

The above code gives the spliting of color channels which gives us a glitch effect.
You can tweak the values and make them to get from uniforms as your taste.

<br/>

<h1 align='center'>If i miss anything to explain notice to me I will try.</h1>
