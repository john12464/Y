(function(){
  const { Renderer, Program, Mesh, Color, Triangle } = window.OGL || {}
  function init(selector){
    if(!Renderer) return
    const ctn = document.querySelector(selector)
    const renderer = new Renderer({ alpha: true, premultipliedAlpha: false })
    const gl = renderer.gl
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); gl.clearColor(0,0,0,0)
    ctn.appendChild(gl.canvas)

    const vertex = `attribute vec2 uv;attribute vec2 position;varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position,0.,1.);}`
    const fragment = `precision highp float;uniform float uTime;uniform vec3 uResolution;varying vec2 vUv;float h(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}float star(vec2 uv){float d=length(uv);float m=.05/d;m*=smoothstep(1.,.2,d);return m;}vec3 layer(vec2 uv){vec3 col=vec3(0.);vec2 gv=fract(uv)-.5;vec2 id=floor(uv);for(int y=-1;y<=1;y++){for(int x=-1;x<=1;x++){vec2 si=id+vec2(float(x),float(y));float sd=h(si);float s=fract(sd*345.32);float st=star(gv-vec2(float(x),float(y)));vec3 base=vec3(.8+.2*h(si+1.),.6+.2*h(si+2.),.9+.2*h(si+3.));col+=st*s*base;}}return col;}void main(){vec2 uv=(vUv*uResolution.xy - .5*uResolution.xy)/uResolution.y;vec3 col=vec3(0.);for(float i=0.;i<1.;i+=.25){float depth=fract(i+uTime*.02);float scale=mix(20.,.5,depth);float f=depth*smoothstep(1.,.9,depth);col+=layer(uv*scale+i*453.32)*f;}gl_FragColor=vec4(col,1.);}"
    const g = new Triangle(gl)
    const program = new Program(gl,{vertex,fragment,uniforms:{uTime:{value:0},uResolution:{value:new Color(1,1,1)}}})
    const mesh = new Mesh(gl,{geometry:g,program})

    function resize(){
      renderer.setSize(ctn.offsetWidth, ctn.offsetHeight)
      program.uniforms.uResolution.value = new Color(gl.canvas.width, gl.canvas.height, gl.canvas.width/gl.canvas.height)
    }
    window.addEventListener('resize', resize); resize()

    function update(t){
      program.uniforms.uTime.value = (t||0)*0.001
      renderer.render({scene: mesh})
      requestAnimationFrame(update)
    }
    requestAnimationFrame(update)
  }
  window.NebulaGalaxy = { init }
})()