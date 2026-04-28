import { Text } from '@tarojs/components'
import React from 'react'

interface IconProps{
    size?:number;
    color?:string;
    name?:string;
}
export const Icon: React.FC<IconProps> = (props) => {
  const { color, size, name } = props
  return <Text className={`icon-${name}`} style={{ color, fontSize: size || 16 }}></Text>
}
