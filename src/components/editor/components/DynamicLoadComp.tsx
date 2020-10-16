import React from 'react'
import loadable from '@loadable/component'

export default (name:string,data)=>{
    const OtherComponent = loadable(() => import(`../components/charts/${name}`));
    return class extends React.Component<any> {
        public render() {
            return (
                <OtherComponent {...data}/>
            );
        }
    };
}