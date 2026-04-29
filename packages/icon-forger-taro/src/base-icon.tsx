import { View } from '@tarojs/components'
import classNames from 'classnames'
import React from 'react'

export interface BaseIconProps {
    size?:number;
    color?:string;
    name?:string;
    className?:string;
}
export const BaseIcon: React.FC<BaseIconProps> = (props) => {
  const { color, size, name, className } = props
  return <View className={classNames('iconfont', `icon-${name}`, className)} style={{ color, fontSize: size || 16 }}></View>
}
