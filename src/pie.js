import React from 'react'
import { set } from 'lodash'

import { loadGraphic, calculateAngles } from './pie.d3'

export default class Pie extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      data: calculateAngles(this.props.data).sort(d => d.selected)
    }
  }

  selectData(indexToSelect) {
    this.setState({
      data: this.state.data
        .map((d, i) => set(d, 'selected', i === indexToSelect))
        .sort(d => d.selected)
    })
  }

  componentDidMount() {
    this.createGraphic()
  }

  componentDidUpdate() {
    this.refs.arc.innerHTML = ''
    this.createGraphic()
  }

  createGraphic() {
    loadGraphic({
      rootNode: this.refs.arc,
      data: this.state.data,
      onSliceClick: this.selectData.bind(this),
      height: this.props.height,
      width: this.props.width
    })
  }

  render() {
    return (<div ref="arc"></div>)
  }
}
