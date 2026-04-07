import type { AuthResponse } from '@follow-up/contracts'
import type { Lookup } from './lookup'
import type { Permission } from './permission'
import type { InfoType } from '../types/info-type'

export type LookupCategory =
  | 'SecurityLevel'
  | 'PriorityLevel'
  | 'FollowupStatus'
  | 'UserType'
  | 'ExternalEntityType'
  | 'DocCLass'
  | 'ActionType'
  | 'AttachmentType'

export type LookupList = Record<LookupCategory, Lookup[]>

export type AppAuthResponse = AuthResponse<{
  applicationUser: AppApplicationUser
  lookupList: LookupList
  permissionSet: Permission[]
  userType: number
  adminUser: boolean
}>

export type AppApplicationUser = {
  id: number
  arName: string
  enName: string
  employeeNo: string
  status: boolean
  qid: string
  email: string
  mobile: string
  domainName: string
  enableEmailNotification: boolean
  userTypeInfo: InfoType
  externalEntityInfo?: InfoType
}
