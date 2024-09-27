import React from 'react'
import { connect } from 'react-redux'

export const orders = (props) => {
  return (
    <div>orders</div>
  )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(orders)