import { merge, sortBy } from 'lodash'
import compose from 'lodash/fp/compose'
import { select } from 'd3-selection'
import { rgb } from 'd3-color'
import { arc as d3Arc, pie as d3Pie } from 'd3-shape'

export function calculateAngles(data) {
  let total = 0;
  return data.map(d => merge(d, {
    startAngle: total,
    endAngle: total += Math.PI*2 * (d.percent / 100)
  }))
}

export function loadGraphic({rootNode, data, onSliceClick, height=600, width=600}) {
  compose(
    createLegend(data, height, width),
    createChart(data, height, width, onSliceClick),
    createShadow,
    setContext(height, width)
  )(rootNode)
}

function setContext(height, width) {
  return function(rootNode) {
    return select(rootNode)
      .append('svg')
      .attr('height', `${height}px`)
      .attr('width', `${width}px`)
      .append('g')
      .attr('transform', `translate(${width/2}, ${height/2})`)
  }
}

function createShadow(rootNode) {
  const defs = rootNode.append('defs')
    // create filter with id #drop-shadow
    // height=130% so that the shadow is not clipped
    const filter = defs.append('filter')
      .attr('id', 'drop-shadow')
      .attr('height', '130%')

    // SourceAlpha refers to opacity of graphic that this filter will be applied to
    // convolve that with a Gaussian with standard deviation 3 and store result in blur
    filter.append('feGaussianBlur')
      .attr('in', 'SourceAlpha')
      .attr('stdDeviation', 2)
      .attr('result', 'blur')

    // translate output of Gaussian blur to the right and downwards with 2px
    // store result in offsetBlur
    filter.append('feOffset')
      .attr('in', 'blur')
      .attr('dx', 2)
      .attr('dy', 2)
      .attr('result', 'offsetBlur')

    // overlay original SourceGraphic over translated blurred opacity by using
    // feMerge filter. Order of specifying inputs is important!
    const feMerge = filter.append('feMerge')
    feMerge.append('feMergeNode')
      .attr('in', 'offsetBlur')
    feMerge.append('feMergeNode')
      .attr('in', 'SourceGraphic')

  return rootNode
}

function createChart(data, height, width, onSliceClick) {
  return function(rootNode) {
    const chart = rootNode.append('g')
      .attr('class', 'chart')
      .selectAll('g')
      .data(pie(data), d => d.data.name)

    chart.enter().insert('path')
      .attr('d', slice(radius(height, width)))
      .on('click', (d, i) => d.data.selected || onSliceClick(i))
      .style('fill', d => d.data.selected ? 'white' : d.data.color)
      .style('stroke', d => d.data.selected ? d.data.color : 'white')
      .style('stroke-width', d => d.data.selected ? '8px' : '3px')
      .style('filter', d => d.data.selected ? 'url(#drop-shadow)' : 'none')
      .style('cursor', 'pointer')
      .on('mouseenter', function(d) {
        const prop = d.data.selected ? 'stroke' : 'fill'
        select(this).style(prop, rgb(d.data.color).brighter(1))
      })
      .on('mouseout', function(d) {
        const prop = d.data.selected ? 'stroke' : 'fill'
        select(this).style(prop, d.data.color)
      })

    chart.exit().remove()

    return rootNode
  }
}

function createLegend(data, height, width) {
  return function(rootNode) {
    const legend = rootNode.append('g')
      .selectAll('g')
      .data(sortBy(data, 'startAngle'))

    const legendItem = legend.enter().insert('g')
      .attr('transform', `translate(${-width/2 + 20}, ${-height/2 + 20})`)
    legendItem.append('rect')
      .attr('y', (d, i) => i * 20)
      .attr('width', '15')
      .attr('height', '15')
      .style('fill', d => d.color)
    legendItem.append('text')
      .attr('dy', (d, i) => i * 20 + 12)
      .attr('dx', 20)
      .attr('text-anchor', 'start')
      .style('font-size', '14px')
      .text(d => d.name)

    legend.exit().remove()

    return rootNode
  }
}

function radius(height, width) {
  return width / 2
}

function pie(data) {
  return d3Pie().value(d => d.name)(data)
}

function arc(radius) {
  return d3Arc().outerRadius(radius * 0.4).innerRadius(radius * 0.2)
}

function slice(radius) {
  return arc(radius).startAngle(d => d.data.startAngle).endAngle(d => d.data.endAngle)
}
