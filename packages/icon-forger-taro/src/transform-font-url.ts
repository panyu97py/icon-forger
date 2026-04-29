import valueParser, { Node } from 'postcss-value-parser'
import postcss from 'postcss'

type Process = (nodes: Node[]) => Node[]

export const transformFontUrl = (source: string, process: Process) => {
  const root = postcss.parse(source)
  root.walkAtRules('font-face', (rule) => {
    rule.walkDecls(decl => {
      if (decl.prop !== 'src') return
      const parsedVal = valueParser(decl.value)
      parsedVal.walk(node => {
        if (node.type !== 'function' || node.value !== 'url') return
        node.nodes = process(node.nodes)
      })
      decl.value = parsedVal.toString()
    })
  })
  return root.toString()
}
