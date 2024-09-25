import Navigate from './navigate'

const Layout = ({ children }) => {
  return (
    <div>

      <div className='container'>{children}</div>
    </div>
  )
}

export default Layout