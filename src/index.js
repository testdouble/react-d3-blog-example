import React from 'react'
import ReactDOM from 'react-dom'
import Pie from './pie'

const data = [{
    name: 'Apple',
    percent: 30,
    selected: true,
    color: '#F3E038'
  }, {
    name: 'Cherry',
    percent: 60,
    selected: false,
    color: '#E53551'
  }, {
    name: 'Pumpkin',
    percent: 10,
    selected: false,
    color: '#9E6512'
  }]

ReactDOM.render(
  <Pie height={300} width={500} data={data} />,
  document.getElementById('graphic')
);

