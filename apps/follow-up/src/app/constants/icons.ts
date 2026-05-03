/**
 * Centralized icon name constants for the application.
 * All icons reference MDI (Material Design Icons) SVG icon set.
 *
 * Usage in templates:
 *   <mat-icon [svgIcon]="icons.REFRESH" />
 *
 * Usage in component class:
 *   import { APP_ICONS } from '../../constants/icons'
 *   protected readonly icons = APP_ICONS
 */
export const APP_ICONS = {
  // ── Navigation ──
  MENU: 'menu',
  VIEW_DASHBOARD: 'view-dashboard',
  CLIPBOARD_TEXT_CLOCK: 'clipboard-text-clock',
  COG: 'cog',
  CHEVRON_DOWN: 'chevron-down',

  // ── Actions ──
  PLUS: 'plus',
  PENCIL: 'pencil',
  DELETE: 'delete',
  REFRESH: 'refresh',
  MAGNIFY: 'magnify',
  DOTS_VERTICAL: 'dots-vertical',
  CLOSE: 'close',
  LOGOUT: 'logout',

  // ── Users ──
  ACCOUNT_GROUP: 'account-group',
  ACCOUNT_OFF: 'account-off',
  ACCOUNT_ARROW_RIGHT: 'account-arrow-right',
  ACCOUNT_SWITCH: 'account-switch',

  // ── Content ──
  PAPERCLIP: 'paperclip',
  WEB: 'web',
  LIST_STATUS: 'list-status',
  PRIORITY_HIGH: 'priority-high',
  FLAG_OUTLINE: 'flag-outline',
  EYE_OUTLINE: 'eye-outline',
  COMMENT_TEXT_OUTLINE: 'comment-text-outline',
  COMMENT_MULTIPLE_OUTLINE: 'comment-multiple-outline',
  MESSAGE_TEXT_OUTLINE: 'message-text-outline',
  HISTORY: 'history',
  OPEN_IN_NEW: 'open-in-new',
  ARROW_UP: 'arrow-up',
  ARROW_DOWN: 'arrow-down',

  // ── Notifications ──
  BELL_OUTLINE: 'bell-outline',

  // ── Theme ──
  WEATHER_NIGHT: 'weather-night',
  WHITE_BALANCE_SUNNY: 'white-balance-sunny',

  // ── Auth ──
  EYE: 'eye',
  EYE_OFF: 'eye-off',
} as const

export type AppIcon = (typeof APP_ICONS)[keyof typeof APP_ICONS]
