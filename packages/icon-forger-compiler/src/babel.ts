import {
  Expression,
  ImportDeclaration, JSXIdentifier,
  JSXMemberExpression,
  JSXNamespacedName,
  JSXOpeningElement, Program
} from '@babel/types'
import template from '@babel/template'
import { NodePath, PluginObj } from '@babel/core'
import * as types from '@babel/types'
import { TransformState } from './types'

const getRootName = (node?: Expression | null) => {
  if (node && types.isIdentifier(node)) return node.name
  if (node && types.isMemberExpression(node)) return getRootName(node.object)
  return null
}

const getJsxRootName = (node?: JSXIdentifier | JSXMemberExpression | JSXNamespacedName | null) => {
  if (node && types.isJSXIdentifier(node)) return node.name
  if (node && types.isJSXMemberExpression(node)) return getJsxRootName(node.object)
  return null
}

const resolveBinding = <T> (path:NodePath<T>, name:string) => {
  const binding = path.scope.getBinding(name)
  if (!binding || Boolean(binding.constantViolations.length)) return null

  if (binding.kind === 'module') return binding.path.parentPath as NodePath<ImportDeclaration>

  if (types.isVariableDeclarator(binding.path.node)) {
    const { init } = binding.path.node
    const rootName = getRootName(init)
    if (rootName) return resolveBinding(binding.path, rootName)
  }

  return null
}

const formatName = (filePath: string): string => {
  const fileName = filePath.split('/').pop() || ''
  const name = fileName.replace(/\.\w+$/, '')
  const result = name.replace(/[-_.]+([a-zA-Z])/g, (_, c) => c.toUpperCase())
  return result.replace(/^[A-Z]/, c => c.toLowerCase())
}

/**
 * 获取引入的元素数据，按 source、type、specifier 归类
 * @param programPath
 */
const getImportElements = (programPath:NodePath<Program>) => {
  const importElement = new Map()
  programPath.traverse({
    ImportDeclaration (importDeclarationPath) {
      const { source, specifiers } = importDeclarationPath.node

      // 按 source 归类 type
      if (!importElement.has(source.value)) importElement.set(source.value, new Map())
      const tempObj = importElement.get(source.value)

      // 按 type 归类 specifier
      specifiers.forEach((specifier) => {
        const { type } = specifier
        if (!tempObj.has(type)) tempObj.set(type, new Set())
        tempObj.get(type).add(specifier.local.name)
      })
    }
  })
  return importElement
}

export default function TransformIcon ():PluginObj<TransformState> {
  return {
    name: 'TransformIcon',
    visitor: {
      JSXOpeningElement: (nodePath: NodePath<JSXOpeningElement>, state: TransformState) => {
        const name = getJsxRootName(nodePath.node.name)
        const sourcePath = name ? resolveBinding(nodePath, name) : null

        // 检查是否是svg文件
        const { source, specifiers } = sourcePath?.node || {}
        if (!source?.value || !/svg$/.test(source?.value)) return

        // 删除具名导入
        const importDefaultSpecifier = specifiers?.find(specifier => types.isImportDefaultSpecifier(specifier))
        if (!importDefaultSpecifier) sourcePath?.remove()
        if (importDefaultSpecifier) sourcePath?.replaceWith(types.importDeclaration([importDefaultSpecifier], source))

        // 替换 Jsx 元素
        const { templateCode, dependRequire = [] } = state.opts
        const iconName = formatName(source.value || '')
        const { attributes } = nodePath.node
        nodePath.replaceWith(templateCode({ iconName, attributes }))
        dependRequire.forEach((item) => state.dependRequire.add(item))
      },
      Program: {
        exit (programPath: NodePath<Program>, state:TransformState) {
          // 获取所有当前的 import 元素
          const importElements = getImportElements(programPath)

          if (!state.dependRequire) return

          Array.from(state.dependRequire).forEach((dependRequireStr) => {
            // 生成 import ast
            const dependRequireAst = template.statement(dependRequireStr)() as ImportDeclaration
            const { source, specifiers } = dependRequireAst

            // 过滤掉已经存在的 specifiers
            const needInjectSpecifiers = (() => {
              if (!importElements.has(source.value)) return specifiers
              return specifiers.filter((specifier) => {
                return !importElements.get(source.value).get(specifier.type)?.has(specifier.local.name)
              })
            })()

            // 没有需要注入的 specifiers 就不注入
            if (!needInjectSpecifiers.length) return

            // 注入 import
            programPath.node.body.unshift({ ...dependRequireAst, specifiers: needInjectSpecifiers })
          })

          // 清空 state.dependRequire
          state.dependRequire.clear()
        }
      }
    }
  }
}
