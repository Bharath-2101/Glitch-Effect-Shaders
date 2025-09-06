const Fragment = `
varying vec2 vUv;
uniform sampler2D u_texture;
uniform float u_time;


void main() {
    float s=sin(u_time);
    s = s * 0.05 + 0.1;
    s *= 0.024;
    vec4 texColor = texture2D(u_texture, vUv);

    vec2 redCoord = vUv;
    redCoord.x -= s;
    float red = texture2D(u_texture, redCoord).r;

    vec2 blueCoord = vUv;
    blueCoord.x += s;
    float blue = texture2D(u_texture, blueCoord).b;

    texColor.r = red;
    texColor.b = blue;

    gl_FragColor = texColor;
}
`;

export { Fragment };
