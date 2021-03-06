import React from 'react'
import reactCSS from 'reactcss'
import { SketchPicker } from 'react-color'
import {Button} from 'antd'
import './ColorsPicker.scss'
import {decodeColor2Rgba,getHexColor} from '../utils/calc'
import {Checkbox} from 'antd'

class ColorsPickerProps{
    onSetColor?:(color:any)=>void;
    defaultColor?:string;
    showCheckbox?:boolean;
}
interface ColorProps {
    r?:string|number;
    g?:string|number;
    b?:string|number;
    a?:string|number;
}

class ColorsPickerState{
    color?:ColorProps|string;
    isTransparent?:boolean;
    displayColorPicker?:boolean;
}

class ColorsPicker extends React.Component<ColorsPickerProps,ColorsPickerState> {
    showCheckbox:boolean = true
    constructor(props) {
        super(props);
        console.log(props.showCheckbox)
        if(props.showCheckbox!=undefined){
          this.showCheckbox = props.showCheckbox
        }
    }
    componentWillReceiveProps(nextProps: Readonly<ColorsPickerProps>, nextContext: any): void {
      if(this.props.defaultColor!=nextProps.defaultColor){
        this.setState({color:decodeColor2Rgba(nextProps.defaultColor)})
      }
    }

  componentDidUpdate(prevProps: Readonly<ColorsPickerProps>, prevState: Readonly<ColorsPickerState>, snapshot?: any): void {

    }

  state = Object.assign({color:{}},{
        displayColorPicker: false,
        isTransparent:false,
        color:decodeColor2Rgba(this.props.defaultColor)
    });


    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
    };

    handleClose = () => {
        this.setState({ displayColorPicker: false })
    };

    handleChange = (color) => {
       this.setState({ color: color.rgb })
    };
    handleSetColor = ()=>{
        const {onSetColor} = this.props;
        if(!this.state.isTransparent){
            onSetColor(getHexColor(this.state.color))
        }else{
            onSetColor("transparent")
        }
        this.setState({ displayColorPicker: false })
    }
    handleChangeNotTransparent = (e:any)=>{
        const {onSetColor} = this.props;
        this.setState({isTransparent: !e.target.checked})
        if(e.target.checked){
            onSetColor(getHexColor(this.state.color))
        }else{
            onSetColor("transparent")
        }
    }
    getBackground=(color)=>{
      if(color!='transparent'&&color!='undefined'){
        // 类型断言
        const color = (this.state.color as ColorProps)

        return `rgba(${ color?.r }, ${ color?.g }, ${ color?.b }, ${ color?.a })`
      }
      return "transparent"
    }

    render() {
      const    styles = reactCSS({
        'default': {
          color: {
            width: '36px',
            height: '14px',
            borderRadius: '2px',
            background: this.getBackground(this.state.color),
          },
          swatch: {
            padding: '5px',
            background: '#fff',
            borderRadius: '1px',
            boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
            display: 'inline-block',
            cursor: 'pointer',
          },
          popover: {
            position: 'fixed',
            zIndex: '2',
            right:300,
            top:150,
          },
          cover: {
            position: 'fixed',
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px',
          },
          ck:{
            "verticalAlign": "super",
            "marginRight": "10px"
          }
        },
      });
      const renderCheckbox = ()=>(
        <Checkbox
          style={ styles.ck }
          defaultChecked={!this.state.isTransparent}
          onChange={this.handleChangeNotTransparent}></Checkbox>
      )
      return (
        <div>
          {this.showCheckbox&&renderCheckbox()}
            <div style={ styles.swatch } onClick={ this.handleClick }>
                <div style={ styles.color } />
            </div>
            { this.state.displayColorPicker ? <div className="color-picker-container" style={ styles.popover }>
                <div style={ styles.cover } onClick={ this.handleClose }/>
                <SketchPicker color={ this.state.color } className="my-color-picker"  onChangeComplete={ this.handleChange } />
                <Button onClick={this.handleClose} style={{marginRight:20}}>取消</Button>
                <Button type="primary" onClick={this.handleSetColor}>确定</Button>
            </div> : null }
        </div>
      )
    }
}

export default ColorsPicker;
