(function(){
  function init(sceneSel, wrapperSel){
    const scene = document.querySelector(sceneSel)
    const wrapper = document.querySelector(wrapperSel)
    if(!scene||!wrapper) return
    const gridSize = 10
    scene.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`
    scene.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`
    scene.style.columnGap = '8px'
    scene.style.rowGap = '8px'

    const cells = Array.from({length: gridSize})
    cells.forEach((_, r)=>{
      cells.forEach((__, c)=>{
        const cube = document.createElement('div')
        cube.className = 'cube'
        cube.dataset.row = r
        cube.dataset.col = c
        ;['top','bottom','left','right','front','back'].forEach(face=>{
          const d = document.createElement('div')
          d.className = `cube-face cube-face--${face}`
          cube.appendChild(d)
        })
        scene.appendChild(cube)
      })
    })

    const maxAngle = 45
    const radius = 3
    const enterDur = 0.3
    const leaveDur = 0.6

    function tiltAt(rowCenter, colCenter){
      scene.querySelectorAll('.cube').forEach((cube)=>{
        const r = +cube.dataset.row
        const c = +cube.dataset.col
        const dist = Math.hypot(r-rowCenter, c-colCenter)
        if (dist <= radius){
          const pct = 1 - dist/radius
          const angle = pct * maxAngle
          gsap.to(cube, {duration: enterDur, overwrite: true, ease: 'power3.out', rotateX: -angle, rotateY: angle})
        } else {
          gsap.to(cube, {duration: leaveDur, overwrite: true, ease: 'power3.out', rotateX: 0, rotateY: 0})
        }
      })
    }

    let raf
    function onMove(e){
      const rect = scene.getBoundingClientRect()
      const cellW = rect.width / gridSize
      const cellH = rect.height / gridSize
      const colCenter = (e.clientX - rect.left) / cellW
      const rowCenter = (e.clientY - rect.top) / cellH
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(()=> tiltAt(rowCenter, colCenter))
    }

    scene.addEventListener('pointermove', onMove)
    scene.addEventListener('pointerleave', ()=> scene.querySelectorAll('.cube').forEach(c=> gsap.to(c,{duration:leaveDur, rotateX:0, rotateY:0})))
  }
  window.NebulaCubes = { init }
})()