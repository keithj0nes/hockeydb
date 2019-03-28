import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toggleNavSlider } from '../redux/actions/misc';
import '../assets/styles/dashboardsidebarnav.scss';

class DashboardSidebarNav extends Component {

    render() {
        const { navSliderVisible } = this.props;
        let visibility = navSliderVisible ? "show" : "hide";
        return (
            <div className={`dashboard-nav-container dashboard-nav-container-${visibility}`}>

                <div className={`dashboard-nav-background fade-in-${visibility}`}>
                </div>

                <div className={`dashboard-nav-sliding-container dashboard-nav-${visibility}`}>

                    <div className={"dashboard-nav"}>
                        <div className={"hide-desktop close"} onClick={this.props.toggleNavSlider}>&times;</div>

                        {this.props.children}

                    </div>

                    <div className={"dashboard-nav-close"} onClick={this.props.toggleNavSlider}>

                    </div>


                </div>

            </div>
        )
    }
}

const mapStateToProps = state => ({
    navSliderVisible: state.misc.navSliderVisible
})

const mapDispatchToProps = dispatch => ({
    toggleNavSlider: () => dispatch(toggleNavSlider())
})

export default connect(mapStateToProps, mapDispatchToProps)(DashboardSidebarNav);




// EXAMPLE A
// class App extends Component {
    
//     //you don't need a constructor anymore with react

//     //return the .map inside the jsx
//     render(){
//         return (
//             <div>
//                 { productsData.map( info => {
//                     //i would just pass the whole info variable into Products
//                     //like so <Products key={info.id} info={info} />
//                     //you must also have a key in anything that's mapped
//                     return <Products key={info.id} name={info.name} price={info.price} />  
//                 })}
//             </div>
//         )
//     }
// }

// EXAMPLE B
// class App extends Component {
    
//     //you don't need a constructor anymore with react

//     //create a render function, use 'render' to let yourself know it's a render function
//     renderFurnitureList = () => {
//         //must return the .map AND the item inside the .map (unless doing it implicitly)
//         return productsData.map( (info, index) => {
//             //i would just pass the whole info variable into Products
//             //like so <Products key={info.id} info={info} />
//             //you must also have a key in anything that's mapped
//             return <Products key={info.id} name={info.name} price={info.price} />  
//             //if you don't have info.id, you can pass the index, but that's said to be avoided
//             // return <Products key={index} name={info.name} price={info.price} />  
//         })
//     }
    
//     render(){
//         //"this" refers to the component, so get the furnitureList function from "this" component
//         return (
//             <div>
//                 {this.renderFurnitureList} 
//             </div>
//         )
//     }
// }