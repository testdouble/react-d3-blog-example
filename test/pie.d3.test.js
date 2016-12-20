import test from 'ava'

import { calculateAngles } from '../src/pie.d3.js'

test('It should calculate pie angles from percents', t => {
  const data = [{
    percent: 30,
  }, {
    percent: 70
  }]

  const calculated = calculateAngles(data)

  t.is(calculated[0].startAngle, 0)
  t.is(calculated[0].endAngle.toFixed(3), '1.885') // 30% of 2PI
  t.is(calculated[1].startAngle.toFixed(3), '1.885') // 30% of 2PI
  t.is(calculated[1].endAngle.toFixed(3), '6.283') // 100% of 2PI
})
