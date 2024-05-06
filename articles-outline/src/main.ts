import { NavigationCollapse, articleOutline } from "./utils";
import './style.css'
const list = articleOutline('#article')

const item = (tag: string, child: NavigationCollapse[]): string => `<details style="width: 100%; padding-left: 1rem;">
    <summary>${tag}</summary>
    ${child.map(v => item(v.head.tag, v.child)).join('\n')}
  </details>`

document.querySelector('#aside')!.innerHTML = list.map(v => item(v.head.tag, v.child)).join('\n')