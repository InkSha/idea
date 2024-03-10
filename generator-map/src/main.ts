import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <canvas id="canvas"></canvas>
`
const canvas = document.getElementById('canvas') as HTMLCanvasElement
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
const width = 500
const height = 500

canvas.height = height
canvas.width = width

const generatorPoint = (quantity: number) => {
  const pointList: string[] = []

  while (pointList.length !== quantity) {
    const x = Math.floor((Math.random() * width * .8)) + (width * .1)
    const y = Math.floor((Math.random() * height * .8)) + (height * .1)
    const point = `${x}-${y}`
    if (pointList.includes(point)) continue
    pointList.push(point)
  }

  return pointList.map(v => v.split('-').map(Number)) as [number, number][]
}

const drawPoint = (point: [number, number][], color?: string[]) => {
  for (let i = 0; i < point.length; i++) {
    const [x, y] = point[i]
    ctx.save()
    ctx.beginPath()
    ctx.fillStyle = color?.length ? color[i] : 'red'
    ctx.arc(x, y, 5, 0, Math.PI * 2)
    ctx.fill()
    ctx.closePath()
    ctx.restore()
  }
}

const generatorColor = () => {
  const color = [
    'red',
    'skyblue',
    'green',
    'yellow',
    'purple',
    'orange',
    'blue',
    'black'
  ]
  return color[Math.floor(Math.random() * color.length)]
}

const point = generatorPoint(10)
const color = point.map(generatorColor)

drawPoint(point, color)

// 规定大小
// 随机生成点位
// 划分点位类型
// 根据点位类型延伸
// 优化
