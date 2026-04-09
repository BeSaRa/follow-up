import type { FollowupMetaDataContract } from '@follow-up/contracts'
import { Cloner } from '@follow-up/util'
import { Info } from '../../../shared/models/info'
import { FollowupSiteInfo } from './followup-site-info'

export class FollowupMetaData extends Cloner implements FollowupMetaDataContract {
  docSubject = ''
  documentTitle = ''
  vsId = ''
  docFullSerial = ''
  docNotes = ''
  docSerial = 0
  docStatus = 0
  docDate = ''
  documentFileInfo = new Info()
  mainClassificationInfo = new Info()
  subClassificationInfo = new Info()
  creatorOuInfo = new Info()
  creatorInfo = new Info()
  lastModifierInfo = new Info()
  securityLevelInfo = new Info()
  priorityLevelInfo = new Info()
  docTypeInfo = new Info()
  docStatusInfo = new Info()
  siteInfo = new FollowupSiteInfo()
  authorizeByAnnotation = false
  followupDate = 0
  refDocDate = ''
  refDocNumber = ''
  followupEndDate = ''
  originality = 0
  receivedByInfo = new Info()
  refDocNumberSerial = ''
  registeryOuInfo = new Info()
  transfered = false
  maxApproveDate = ''
}
