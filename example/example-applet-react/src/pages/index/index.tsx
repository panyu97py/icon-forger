import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import { Icon } from '@/assets/check-icon.svg'
import './index.less'

export default function Index () {
  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className='index'>
      <Text>Hello world!</Text>
      <Icon size={28} color="#222222" className="demo-icon" />
    </View>
  )
}
