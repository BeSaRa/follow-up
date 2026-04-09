import type { InfoContract } from './model'

export interface FollowupAttachmentContract {
  docSubject: string
  vsId: string
  documentTitle: string
  priorityLevel: number
  exportStatus: boolean
  isAnnotation: boolean
  isOfficial: boolean
  isContract: boolean
  attachmentTypeInfo: InfoContract
}

export interface FollowupSiteInfoContract {
  exportStatus: boolean
  exportWay: number
  faxNumber: string
  followupDate: string
  followupStatus: number
  followupStatusResult: InfoContract
  hasFax: boolean
  mainSite: InfoContract
  mainSiteId: number
  siteCategory: number
  siteType: number
  siteTypeResult: InfoContract
  status: boolean
  subSite: InfoContract
  subSiteId: number
}

export interface FollowupMetaDataContract {
  docSubject: string
  documentTitle: string
  vsId: string
  docFullSerial: string
  docNotes: string
  docSerial: number
  docStatus: number
  docDate: string
  documentFileInfo: InfoContract
  mainClassificationInfo: InfoContract
  subClassificationInfo: InfoContract
  creatorOuInfo: InfoContract
  creatorInfo: InfoContract
  lastModifierInfo: InfoContract
  securityLevelInfo: InfoContract
  priorityLevelInfo: InfoContract
  docTypeInfo: InfoContract
  docStatusInfo: InfoContract
  siteInfo: FollowupSiteInfoContract
  authorizeByAnnotation: boolean
  followupDate: number
  refDocDate: string
  refDocNumber: string
  followupEndDate: string
  originality: number
  receivedByInfo: InfoContract
  refDocNumberSerial: string
  registeryOuInfo: InfoContract
  transfered: boolean
  maxApproveDate: string
}

export interface FollowupOpenContract {
  content: string
  linkedAttachments: FollowupAttachmentContract[]
  followupAttachments: FollowupAttachmentContract[]
  guidanceAttachments: FollowupAttachmentContract[]
  metaData: FollowupMetaDataContract
  sitesCount: number
}
