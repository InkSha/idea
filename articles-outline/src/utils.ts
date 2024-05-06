// as const 表示将这个变量声明为只读常量
// 鼠标悬浮在变量名称上时显示的是：
// const navigation: readonly ["H1", "H2", "H3", "H4", "H5", "H6"]
// 如果没有增加 as const
// 则显示的则是 const navigation: string[]
export const navigation = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'] as const

// 这里使用 Object.fromEntries 将定义的标题数组转换为对象
// 原先的数组元素为对象 key
// 元素对应的索引 + 1 就是 value
export const levels = Object.fromEntries(navigation.map((v, i) => [v, i + 1])) as Record<
  (typeof navigation)[number],
  number
>

export interface Navigation {
  /**
   * 标题等级
   */
  level: (typeof navigation)[number]
  /**
   * 标题文本
   */
  tag: string
}

export interface NavigationCollapse {
  /**
   * 父标题
   */
  head: Navigation
  /**
   * 子标题数组 因为父标题可能存在多个子标题
   * 这里循环引用了类型自身​
   */
  child: NavigationCollapse[]
}

/**
 * 获取文章大纲
 * @param el 父元素选择器
 * @returns 折叠导航列表
 */
export function articleOutline(el: string): NavigationCollapse[] {
  // 遍历标题列表
  for (let i = 0; i < navigation.length; i++) {
    // 获取选择器
    const selector = navigation[i].toLocaleLowerCase()
    // 选择元素
    const element = document.querySelector(`${el}>${selector}`)
    // 元素存在则进行获取
    if (element) {
      const list = articleNavigation(element as HTMLElement)
      // 因为使用了递归所以需要反转数组
      const result = collapseNavigation(list, i + 1).reverse()
      console.log(result)
      return result
    }
  }
  return []
}

/**
 * 获取导航列表
 * @param el 第一个标题元素
 * @returns 导航列表
 */
export function articleNavigation(el: HTMLElement): Navigation[] {

  /**
   * 结果数组
   */
  const result: HTMLElement[] = []

  /**
   * 保存当前元素
   */
  let currentEl = el

  // 不断的迭代下一个兄弟元素 直到兄弟元素不存在
  while (currentEl && currentEl.nextElementSibling) {
    // 如果元素标签为六级标题中的一个
    if (navigation.includes(currentEl.tagName as Navigation['level'])) {
      // 则将当前元素增加到结果数组中
      result.push(currentEl)
    }
    // 将当前元素变更为兄弟元素
    currentEl = currentEl.nextElementSibling as HTMLElement
  }

  return result.map((v) => {

    // 提取出标题文本和标题等级

    const tag = v.innerText
    const level = v.tagName as Navigation['level']

    // 给标题增加一个自定义的 data-tag 属性用于后续的抓取
    v.dataset.tag = tag

    return {
      level,
      tag
    }
  })
}

/**
 * 折叠导航
 * @param list 导航列表
 * @param deep 标题等级
 * @param result 结果数组
 * @returns 结果数组
 */
export function collapseNavigation(
  list: Navigation[],
  level: number = 1,
  result: NavigationCollapse[] = []
): NavigationCollapse[] {

  // 导航列表为空则返回空数组
  if (!list.length) return []

  // 有六级标题
  // 第六级标题是最小的
  // 因此这里进行判断
  // 六级标题直接返回
  if (level > 5)
    return [
      {
        head: list[0],
        child: []
      }
    ]

  /**
   * 子导航列表
   */
  const child: Navigation[] = []

  // 遍历导航列表 导航是父标题 而我们仅需要遍历子标题 因此循环从 1 开始
  for (let i = 1; i < list.length; i++) {
    // 取出当前导航元素
    const el = list[i]
    // 如果元素等级等于当前等级 则 证明是同级元素 进行切割
    if (levels[el.level] === level) {
      // 进行切割
      result.push(...collapseNavigation(list.slice(i), level, []))
      break
    } else {
      // 否则增加到子导航列表
      child.push(el)
    }
  }

  // 增加子导航
  result.push({
    head: list[0],
    // 递归获取子导航
    child: collapseNavigation(child, level + 1, []).reverse()
  })

  return result
}
