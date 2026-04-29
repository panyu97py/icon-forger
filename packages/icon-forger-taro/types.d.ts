declare module '*.svg' {

    import * as React from 'react'

    interface IconProps {
        size?:number;
        color?:string;
        name?:string;
        className?:string;
    }

    export const Icon: React.FC<IconProps>

    const src: string

    export default src
}
