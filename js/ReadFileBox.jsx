var React = require('react'),
	mui = require('material-ui'),
	Slider = mui.Slider,
	CircularProgress = mui.CircularProgress,
	RaisedButton = mui.RaisedButton;

var ReadFileBox = React.createClass({
	componentDidMount: function() {
		var self = this;
		function readFile() {
		  var file = this.files[0]; 
		    if(!/image\/\w+/.test(file.type)){ 
		        alert("文件必须为图片！"); 
		        return false; 
		    } 
		    var reader = new FileReader(); 
		   	
		    reader.onload = function(e){ 
		        var img = new Image();
		        img.src = this.result;
		        img.onload = function() {
		        	if(typeof self.props.onRead == 'function') {
		        		self.props.onRead(img);
		        	}
		        }
		    } 
		    reader.readAsDataURL(file); 
		}
		var fileInput = React.findDOMNode(this.refs.fileInput);
		  	 fileInput.addEventListener('change',readFile);
	},
	selectFile:function() {
		React.findDOMNode(this.refs.fileInput).click();
	},
	render: function() {
		return (
			<div className="ReadFileBox" ref="box">
				<div  id="ctrlBox">
				 	
				 	<RaisedButton secondary={true} label="Choose an Image" onClick={this.selectFile} style={{width:'100%',marginBottom:'10px'}}>
				    	<input type="file"  ref="fileInput" style={{display: 'none'}}></input>
				  	</RaisedButton>

				</div>
			</div>
		);
	}

});

module.exports = ReadFileBox;