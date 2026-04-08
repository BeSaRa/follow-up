import type { Constructor } from '@follow-up/contracts'

export class LangTracker {
  private static currentLang = 'ar'

  static getLang(): string {
    return LangTracker.currentLang
  }

  static setLang(lang: string, source: string) {
    LangTracker.currentLang = lang
    console.log(`[LangTracker] Language changed to "${lang}" from "${source}"`)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function LangNameMixin<Base extends Constructor<any>>(Superclass: Base) {
  return class extends Superclass {
    declare arName: string
    declare enName: string

    getName(): string {
      return LangTracker.getLang() === 'ar' ? this.arName : this.enName
    }
  }
}
