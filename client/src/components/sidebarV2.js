import logo from '../assets/icons/lakbay_logo50px.png'
import '../css/styles.css'


const SidebarV2 = () => {
    return (
        <>
            <div class='container'>
                <aside>
                    <div class="top">
                        <div class="logo">
                            <img src={logo} alt="Logo" />
                            <h2>LAKBAY</h2>
                        </div>
                        <div class="close" id="close_btn">
                        <span class="material-icons-sharp">close</span>
                        </div>
                    </div>

                    <div class="sidebar">
                        <a href="#">
                            <span class="material-icons-sharp">grid_view</span>
                            <h3>Dashboard</h3>
                        </a>

                        <a href="#">
                            <span class="material-icons-sharp">grid_view</span>
                            <h3>Orders</h3>
                        </a>

                        <a href="#">
                            <span class="material-icons-sharp">grid_view</span>
                            <h3>Transaction</h3>
                        </a>

                        <a href="#">
                            <span class="material-icons-sharp">grid_view</span>
                            <h3>Inventory</h3>
                        </a>

                        <a href="#">
                            <span class="material-icons-sharp">grid_view</span>
                            <h3>Sales</h3>
                        </a>

                        <a href="#">
                            <span class="material-icons-sharp">grid_view</span>
                            <h3>Reports</h3>
                        </a>

                        <a href="#">
                            <span class="material-icons-sharp">grid_view</span>
                            <h3>Users</h3>
                        </a>

                        <a href="#">
                            <span class="material-icons-sharp">grid_view</span>
                            <h3>Settings</h3>
                        </a>
                    </div>
                </aside>
            </div>
        </>
    )
  }
  
  export default SidebarV2