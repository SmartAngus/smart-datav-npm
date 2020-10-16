
import * as React from "react";
import { ReScreen } from "../regraph";

interface SVGEditorProps {
  svgContainer?:any
}

export default class SVGEditor extends React.Component<SVGEditorProps, any>{
  svgContainer: any;
  constructor(props) {
    super(props);
    this.svgContainer = React.createRef();
  }
  render(): React.ReactNode {
    return (<div>
      <svg className="svg-caves" ref={this.svgContainer}></svg>
      <ReScreen
        height = {800}
        width = {800}
        mapWidth = {200}
        mapHeight = {200}
        svgContainer={this.svgContainer}
        mapPosition = "RT-IN" >
        <svg>
          <g>
            <g id="1"><circle cx={0} cy={0} r={500} fill="yellow" /></g>
            <g id="2"><circle cx={0} cy={0} r={250} fill="red" /></g>
          </g>
        </svg>
      </ReScreen>
    </div>)
  }
}
