export const navigation = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'] as const
export const levels = Object.fromEntries(navigation.map((v, i) => [v, i + 1])) as Record<
  (typeof navigation)[number],
  number
>

export interface Navigation {
  level: (typeof navigation)[number]
  tag: string
}

export interface NavigationCollapse {
  head: Navigation
  child: NavigationCollapse[]
}

export function articleOutline(el: string): NavigationCollapse[] {
  for (let i = 0; i < navigation.length; i++) {
    const selector = navigation[i].toLocaleLowerCase()
    const element = document.querySelector(`${el} ${selector}`)
    if (element) {
      return collapseNavigation(articleNavigation(element as HTMLElement), i + 1).reverse()
    }
  }
  return []
}

export function articleNavigation(el: HTMLElement, result: HTMLElement[] = []): Navigation[] {

  let currentEl = el

  while (currentEl && currentEl.nextElementSibling) {
    if (navigation.includes(currentEl.tagName as Navigation['level'])) {
      result.push(currentEl)
    }
    currentEl = currentEl.nextElementSibling as HTMLElement
  }

  return result.map((v) => {
    const tag = v.innerText
    const level = v.tagName as Navigation['level']

    v.dataset.tag = tag

    return {
      level,
      tag
    }
  })
}

export function collapseNavigation(
  list: Navigation[],
  deep: number = 1,
  result: NavigationCollapse[] = []
): NavigationCollapse[] {
  if (!list.length) return []

  if (deep > 5)
    return [
      {
        head: list[0],
        child: []
      }
    ]

  const child: Navigation[] = []

  for (let i = 1; i < list.length; i++) {
    const el = list[i]
    if (levels[el.level] === deep) {
      result.push(...collapseNavigation(list.slice(i), deep, []))
      break
    } else {
      child.push(el)
    }
  }

  result.push({
    head: list[0],
    child: collapseNavigation(child, deep + 1, []).reverse()
  })

  return result
}
