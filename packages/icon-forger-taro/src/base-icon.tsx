import { Text } from '@tarojs/components'
import classNames from 'classnames'
import React, { CSSProperties } from 'react'
import Taro from '@tarojs/taro'

export interface BaseIconProps {
    size?:number;
    color?:string;
    name?:string;
    className?:string;
    style?:CSSProperties;
}
export const BaseIcon: React.FC<BaseIconProps> = (props) => {
  const { color, size, name, className, style } = props
  return (
      <Text
          className={classNames('iconfont', `iconfont-${name}`, className)}
          style={{ ...style, color, fontSize: Taro.pxTransform(size || 20) }}
      />
  )
}
