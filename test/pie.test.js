import test from 'ava'
import React from 'react'
import { mount } from 'enzyme'
import td from 'testdouble'

test.beforeEach(t => {
  t.context.d3 = td.replace(
    '../src/pie.d3',
    td.object(['calculateAngles', 'loadGraphic'])
  )
  td.when(t.context.d3.calculateAngles(td.matchers.anything())).thenDo(x => x)
})

function renderedOutput(t) {
  return t.context.wrapper
}

function renderGraphic(t, {data = [], height = 600, width = 600}) {
  const Pie = require('../src/pie').default
  t.context.wrapper = mount(
    <Pie data={data} height={height} width={width} />
  )
  return renderedOutput(t)
}

test('It should load the graphic with props', t => {
  const data = [{name: 'foo'}]
  const height = 100
  const width = 200

  renderGraphic(t, {data: data, height: height, width: width})

  td.verify(t.context.d3.loadGraphic(
    td.matchers.contains({
      data: data,
      height: height,
      width: width
    })
  ))
})

const isSelectedAt = td.matchers.create({
  matches: (args, actual) => actual.data[args[0]].selected
})

test('It should load graphic with updated data when slice is clicked', t => {
  const data = [{selected: false}]
  const height = 100
  const width = 200

  const captor = td.matchers.captor()
  renderGraphic(t, {data: data, height: height, width: width})
  td.verify(t.context.d3.loadGraphic(captor.capture()))

  captor.value.onSliceClick(0)

  td.verify(t.context.d3.loadGraphic(
    isSelectedAt(0)
  ))
})


