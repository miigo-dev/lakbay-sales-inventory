import React from 'react'
import { connect } from 'react-redux'

export const inventory = (props) => {
  return (
    <div>inventory</div>
  )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(inventory)