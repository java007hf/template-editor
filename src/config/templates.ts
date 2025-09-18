import template1 from '../assets/img_WiZDbk3GDo8GjNxi0iVcFrLMnCa.png'
import template2 from '../assets/img_E1xMbpx29oOqn2x8ayDcpwpunLe.png'
import template3 from '../assets/img_UkyAbWiOOo8BwpxjbCicagd0n7g.png'

export interface TemplateConfig {
  id: string
  name: string
  description: string
  preview: string
}

export const templates: TemplateConfig[] = [
  {
    id: 'template1',
    name: '双栏布局模板',
    description: '左侧关键词，右侧内容和图片，蓝白配色',
    preview: template1
  },
  {
    id: 'template2', 
    name: '单栏布局模板',
    description: '标题+正文+插图，简洁教育风格',
    preview: template2
  },
  {
    id: 'template3',
    name: '混合布局模板', 
    description: '支持多段落和图片组合',
    preview: template3
  }
]