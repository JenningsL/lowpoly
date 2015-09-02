'use strict'
var LowPolyRenderer = require('./LowPolyRenderer.js'),
    React = require('react'),
    ReadFileBox = require('./ReadFileBox.jsx'),
    mui = require('material-ui'),
    Slider = mui.Slider,
    LinearProgress = mui.LinearProgress,
    ThemeManager = new mui.Styles.ThemeManager(),
   
    RaisedButton = mui.RaisedButton,
    renderer = null;


var App = React.createClass({
  mycanvas:null,
  renderer:null,
  getInitialState: function() {
    return {
      rendering: false 
    };
  },
  componentDidMount: function() {
    this.mycanvas = document.getElementById("myCanvas");
    this.renderer = new LowPolyRenderer(this.mycanvas);
  },
  process:function() {
    if(this.state.rendering) {
      return false;
    }
    else {
      this.setState({
        rendering: true
      });
      this.renderer.render(function(){
        this.setState({
          rendering: false
        })
      }.bind(this));
    }
    
  },
  selectImg:function(img) {
    this.renderer.setImg(img);
    this.renderer.drawImg();
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext:function() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },
  setOption: function(e,value) {
    this.renderer.setEmphasisEdge(value);
  },
  render: function() {
    return (
      <div id="app">
        <canvas id="myCanvas" width="100%" height="200" style={{marginBottom:'10px',border:'1px solid #e5e5e5'}}></canvas>
        {this.state.rendering?<LinearProgress mode="indeterminate"  />:""}
        
        <p  style={{fontSize:'12px',textAlign:'center',color:"#999999"}}>强调边缘</p>
        <Slider name="slider1" defaultValue={1} max={1.5} min={0.5} step={0.1} onChange={this.setOption}/>
       
        <ReadFileBox onRead={this.selectImg} />
        <RaisedButton primary={true} label="render" disable={this.state.rendering} onClick={this.process} style={{width:'100%'}}>
        </RaisedButton>
      </div>
    );
  }

});

module.exports = App;

React.render(<App/>,document.getElementById("container"));