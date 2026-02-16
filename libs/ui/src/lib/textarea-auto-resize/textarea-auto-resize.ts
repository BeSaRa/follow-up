import {
  afterNextRender,
  Directive,
  ElementRef,
  inject,
  input,
  numberAttribute,
} from '@angular/core'

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'textarea[uiAutoResize]',
  host: {
    '(input)': 'resize()',
    '[style.box-sizing]': '"border-box"',
  },
})
export class UiTextareaAutoResize {
  readonly uiAutoResizeMinRows = input(2, { transform: numberAttribute })
  readonly uiAutoResizeMaxRows = input(0, { transform: numberAttribute })

  private readonly el: HTMLTextAreaElement = inject(ElementRef).nativeElement
  private lineHeight = 0

  constructor() {
    afterNextRender(() => {
      const computed = getComputedStyle(this.el)
      this.lineHeight = parseFloat(computed.lineHeight) || parseFloat(computed.fontSize) * 1.2
      this.el.rows = this.uiAutoResizeMinRows()
      this.resize()

      // Watch for programmatic value changes (reactive forms)
      const desc = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')
      if (desc?.set) {
        const originalSet = desc.set
        const self = this
        Object.defineProperty(this.el, 'value', {
          ...desc,
          set(val: string) {
            originalSet.call(this, val)
            self.resize()
          },
        })
      }
    })
  }

  resize() {
    const el = this.el
    const minRows = this.uiAutoResizeMinRows()
    const maxRows = this.uiAutoResizeMaxRows()
    const minHeight = this.lineHeight * minRows

    el.style.height = '0'
    const scrollHeight = el.scrollHeight
    const targetHeight = Math.max(scrollHeight, minHeight)

    if (maxRows > 0) {
      const maxHeight = this.lineHeight * maxRows
      if (targetHeight > maxHeight) {
        el.style.height = `${maxHeight}px`
        el.style.overflow = 'auto'
        return
      }
    }

    el.style.height = `${targetHeight}px`
    el.style.overflow = 'hidden'
  }
}
