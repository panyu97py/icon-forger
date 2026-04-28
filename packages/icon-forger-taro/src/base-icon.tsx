import { Text } from '@tarojs/components'
import classNames from 'classnames'
import React from 'react'

export interface IconProps {
    size?:number;
    color?:string;
    name?:string;
    className?:string;
}
export const Icon: React.FC<IconProps> = (props) => {
  const { color, size, name, className } = props
  return <Text className={classNames(`icon-${name}`, className)} style={{ color, fontSize: size || 16 }}></Text>
}
