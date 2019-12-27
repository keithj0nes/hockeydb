import React from 'react';

class Swiper extends React.Component {

  state = {
    position: 0,
    sliding: false,
    direction: 'next',
    speed: this.props.options.speed
  }
 
  getOrder = (itemIndex) => {
    const { position } = this.state;
    const { children } = this.props;
    const numItems = children.length || 1;
    return ((numItems + 1) - position+itemIndex) % numItems;

    // if(itemIndex - position < 0){
    //   return numItems - Math.abs(itemIndex - position);
    // }
    // return itemIndex - position;
  }

  next = () => {
    // console.log('you', this.state.position)

    const { position } = this.state;
    const { children, options } = this.props;
    const numItems = children.length || 1;

    if(position === numItems - 1 && !options.loop) return;

    // console.log(position === numItems - 1 ? 0 : position + 1)

    this.doSliding('next', position === numItems - 1 ? 0 : position + 1)
    // this.doSliding(position)
  }

  prev = () => {
    const { position } = this.state
    const { children, options } = this.props
    const numItems = children.length

    if(position === 0 && !options.loop) return;

    this.doSliding('prev', position === 0 ? numItems - 1 : position - 1)
  }

  doSliding = (direction, position) => {

    this.setState({
      sliding: true,
      direction,
      position
    })

    setTimeout(() => {
      this.setState({
        sliding: false
      })
    }, 50);
  }


  render(){
    const { children } = this.props;

    const transform = () => {
      if (!this.state.sliding) return 'translateX(-100%)'
      if (this.state.direction === 'prev') return 'translateX(calc(2 * (-100%)))'
      return 'translateX(0%)'
    }

    return (
      <div className='carousel-main' style={styles.carouselMain}>
        {/* <h1>myswiper</h1> */}
        {/* <div className="swiper-wrapper"> */}
          <div className="carousel-container" style={{display: 'flex', transition: this.state.sliding ? 'none' : `transform ${this.state.speed}ms ease`, transform: transform() }}>
            {children.map((child, index) => {
              return <div className="carousel-child" key={index} style={{order: this.getOrder(index), ...styles.carouselChild}}>{child}</div>
            })}
          {/* </div> */}
        </div>
        {/* <button onClick={this.prev}>Prev</button> */}
        {/* <button onClick={this.next}>Next</button> */}
      </div>
    )
  }
}

export default Swiper

 

//PROPS TO HAVE

// children (must be more than one)
// transitionTime (miliseconds)

//METHODS

//next()
//prev()

Swiper.defaultProps = {
  options: {
    speed: 1000,
    loop: false
  }
}


const styles = {
    carouselMain: {
        // background: 'pink',
        width: '100%',
        overflow: 'hidden',
    },
    carouselContainer: {
        display: 'flex',
    },
    carouselChild: {
        flex: '1 0 100%',
        display: 'flex',
        // background: 'red'
    }
}
 

// CSS
// .carousel-main {
//   background: pink;
//   width: 100%;
//   overflow: hidden;
// }

// .carousel-main .carousel-container {
//   display: flex;
// }

// .carousel-main .carousel-container .carousel-child {
//   flex: 1 0 100%;
//   display: flex;
//   background: red
// }


//USAGE

// {/* <Swiper ref={el => this.myyReff = el} options={{speed: 1000, loop: true}}>
//   <Content type="first" next={() => this.myyReff.next()}/>
//   <div>PANE 1</div>
//   <div>PANE 2</div>
//   <Content  prev={() => this.myyReff.prev()}></Content>
//   <div>PANE 3</div>
// </Swiper>  */}