let renders: (()=>void)[] = [];


let cursor_x = -1;
let cursor_y = -1;

if("document" in globalThis){
  document.onmousemove = function(event)
{
 cursor_x = event.pageX;
 cursor_y = event.pageY;
}

}

export default function createShader(canvas: HTMLCanvasElement, fragmentShaderCode: string, renderOnce: boolean) {
  let gl = canvas.getContext("webgl")!;
  // Vertex-Shader
  let vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
  let vertexShaderCode = `
      attribute vec4 pos;
      varying vec2 coordinates;
      void main() {
          coordinates = pos.xy * 0.5 + 0.5; // Transformation von [-1, 1] zu [0, 1]
          gl_Position = pos;
      }`;
  gl.shaderSource(vertexShader, vertexShaderCode);
  gl.compileShader(vertexShader);

  // Fragment-Shader
  let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;


  gl.shaderSource(fragmentShader, fragmentShaderCode);
  gl.compileShader(fragmentShader);

  // Shader-Programm
  let program = gl.createProgram()!;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.useProgram(program);

  // Uniform-Location für die Zeitvariable
  let timeUniformLocation = gl.getUniformLocation(program, "time");
  let scrollYUniformLocation = gl.getUniformLocation(program, "scrolly")
  let aspectRatio = gl.getUniformLocation(program,"aspectratio");
  let scale = gl.getUniformLocation(program,"scale");
  let mousePos = gl.getUniformLocation(program,"mousePos");
  // Vertices für ein Quad, das den gesamten Bildschirm abdeckt
  var vertices = [
    -1.0,
    -1.0, // Unten links
    1.0,
    -1.0, // Unten rechts
    -1.0,
    1.0, // Oben links
    1.0,
    1.0, // Oben rechts
  ];

  // Vertex-Buffer
  var posBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  // Verbindung der Shader-Attribute
  var posLoc = gl.getAttribLocation(program, "pos");
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(posLoc);

  // Start der Animation
  let startTime = Date.now();
  let counter = 0;

  function isInViewport(rect: any) {
    let html = document.documentElement;
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || html.clientHeight) &&
      rect.right <= (window.innerWidth || html.clientWidth)
    );
  }

  function render() {
    let rect = canvas.getBoundingClientRect();

    if (isInViewport(rect)&&  counter % 2 == 0 || renderOnce) {
      let glcursorx = cursor_x - rect.left - window.scrollX;
      let glcursory = cursor_y - rect.top - window.scrollY;
      glcursorx /= rect.width;
      glcursory /= rect.height;
      if(glcursorx < 0.0)glcursorx = 0.0;
      else if(glcursorx > 1.0)glcursorx = 1.0;

      if(glcursory < 0.0)glcursory = 0.0;
      else if(glcursory > 1.0)glcursory = 1.0;

      let currentTime = Date.now();
      let time = (currentTime - startTime) / 1000; // Zeit in Sekunden

      // Setze die Zeituniform
      gl.uniform1f(timeUniformLocation, time);
      gl.uniform1f(scrollYUniformLocation, window.scrollY);
      gl.uniform1f(aspectRatio, canvas.width / canvas.height);
      gl.uniform1f(scale,1.0);

      gl.uniform2f(mousePos,glcursorx,1-glcursory);
      // Leere den Bildschirm und zeichne das Quad
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    }
    counter += 1;
  }
  if(!renderOnce){
    renders.push(render);
  }
  render();
}

if (globalThis["window"] !== undefined) {
  let animationFrameId: number;
  function globRenderLoop() {
    for(let r of renders){
      r();
    }
    animationFrameId = requestAnimationFrame(globRenderLoop);
  }

  globRenderLoop();

}