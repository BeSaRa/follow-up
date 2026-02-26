import { HttpInterceptorFn, HttpResponse } from '@angular/common/http'
import { of } from 'rxjs'

const MOCK_ATTACHMENT_TYPES = [
  { id: 1, category: 1, arName: 'مستند رسمي', enName: 'Official Document', lookupKey: 101, lookupStrKey: 'official_doc', status: true, itemOrder: 1 },
  { id: 2, category: 1, arName: 'صورة شخصية', enName: 'Personal Photo', lookupKey: 102, lookupStrKey: 'personal_photo', status: true, itemOrder: 2 },
  { id: 3, category: 2, arName: 'تقرير طبي', enName: 'Medical Report', lookupKey: 103, lookupStrKey: 'medical_report', status: true, itemOrder: 3 },
  { id: 4, category: 2, arName: 'شهادة تعليمية', enName: 'Educational Certificate', lookupKey: 104, lookupStrKey: 'edu_cert', status: true, itemOrder: 4 },
  { id: 5, category: 1, arName: 'عقد عمل', enName: 'Employment Contract', lookupKey: 105, lookupStrKey: 'employment_contract', status: false, itemOrder: 5 },
  { id: 6, category: 3, arName: 'كشف حساب', enName: 'Bank Statement', lookupKey: 106, lookupStrKey: 'bank_statement', status: true, itemOrder: 6 },
  { id: 7, category: 3, arName: 'فاتورة', enName: 'Invoice', lookupKey: 107, lookupStrKey: 'invoice', status: true, itemOrder: 7 },
  { id: 8, category: 1, arName: 'جواز سفر', enName: 'Passport', lookupKey: 108, lookupStrKey: 'passport', status: true, itemOrder: 8 },
  { id: 9, category: 2, arName: 'تقرير فني', enName: 'Technical Report', lookupKey: 109, lookupStrKey: 'tech_report', status: false, itemOrder: 9 },
  { id: 10, category: 1, arName: 'بطاقة هوية', enName: 'ID Card', lookupKey: 110, lookupStrKey: 'id_card', status: true, itemOrder: 10 },
  { id: 11, category: 2, arName: 'خطاب توصية', enName: 'Recommendation Letter', lookupKey: 111, lookupStrKey: 'recommendation', status: true, itemOrder: 11 },
  { id: 12, category: 3, arName: 'إيصال دفع', enName: 'Payment Receipt', lookupKey: 112, lookupStrKey: 'payment_receipt', status: true, itemOrder: 12 },
]

const MOCK_FOLLOWUP_STATUSES = [
  { id: 1, category: 1, arName: 'جديد', enName: 'New', lookupKey: 201, lookupStrKey: 'new', status: true, itemOrder: 1 },
  { id: 2, category: 1, arName: 'قيد المراجعة', enName: 'Under Review', lookupKey: 202, lookupStrKey: 'under_review', status: true, itemOrder: 2 },
  { id: 3, category: 1, arName: 'معتمد', enName: 'Approved', lookupKey: 203, lookupStrKey: 'approved', status: true, itemOrder: 3 },
  { id: 4, category: 1, arName: 'مرفوض', enName: 'Rejected', lookupKey: 204, lookupStrKey: 'rejected', status: true, itemOrder: 4 },
  { id: 5, category: 2, arName: 'مؤجل', enName: 'Deferred', lookupKey: 205, lookupStrKey: 'deferred', status: true, itemOrder: 5 },
  { id: 6, category: 2, arName: 'مغلق', enName: 'Closed', lookupKey: 206, lookupStrKey: 'closed', status: true, itemOrder: 6 },
  { id: 7, category: 1, arName: 'قيد التنفيذ', enName: 'In Progress', lookupKey: 207, lookupStrKey: 'in_progress', status: true, itemOrder: 7 },
  { id: 8, category: 2, arName: 'ملغي', enName: 'Cancelled', lookupKey: 208, lookupStrKey: 'cancelled', status: false, itemOrder: 8 },
  { id: 9, category: 1, arName: 'بانتظار الرد', enName: 'Awaiting Response', lookupKey: 209, lookupStrKey: 'awaiting_response', status: true, itemOrder: 9 },
  { id: 10, category: 2, arName: 'مكتمل', enName: 'Completed', lookupKey: 210, lookupStrKey: 'completed', status: true, itemOrder: 10 },
]

const MOCK_PRIORITY_LEVELS = [
  { id: 1, category: 1, arName: 'عاجل جداً', enName: 'Critical', lookupKey: 301, lookupStrKey: 'critical', status: true, itemOrder: 1 },
  { id: 2, category: 1, arName: 'عاجل', enName: 'Urgent', lookupKey: 302, lookupStrKey: 'urgent', status: true, itemOrder: 2 },
  { id: 3, category: 1, arName: 'مرتفع', enName: 'High', lookupKey: 303, lookupStrKey: 'high', status: true, itemOrder: 3 },
  { id: 4, category: 1, arName: 'متوسط', enName: 'Medium', lookupKey: 304, lookupStrKey: 'medium', status: true, itemOrder: 4 },
  { id: 5, category: 1, arName: 'منخفض', enName: 'Low', lookupKey: 305, lookupStrKey: 'low', status: true, itemOrder: 5 },
  { id: 6, category: 2, arName: 'عادي', enName: 'Normal', lookupKey: 306, lookupStrKey: 'normal', status: true, itemOrder: 6 },
  { id: 7, category: 2, arName: 'غير محدد', enName: 'Unspecified', lookupKey: 307, lookupStrKey: 'unspecified', status: false, itemOrder: 7 },
  { id: 8, category: 1, arName: 'فوري', enName: 'Immediate', lookupKey: 308, lookupStrKey: 'immediate', status: true, itemOrder: 8 },
]

interface MockRoute {
  pathSuffix: string
  data: Record<string, unknown>[]
}

const MOCK_ROUTES: MockRoute[] = [
  { pathSuffix: 'admin/attachment-type', data: MOCK_ATTACHMENT_TYPES },
  { pathSuffix: 'admin/followup-status', data: MOCK_FOLLOWUP_STATUSES },
  { pathSuffix: 'admin/priority-level', data: MOCK_PRIORITY_LEVELS },
]

function buildPaginationResponse(
  data: Record<string, unknown>[],
  page: number,
  size: number,
  search: string,
) {
  let filtered = data
  if (search) {
    const q = search.toLowerCase()
    filtered = data.filter(
      (item) =>
        String(item['arName']).toLowerCase().includes(q) ||
        String(item['enName']).toLowerCase().includes(q),
    )
  }

  const totalElements = filtered.length
  const totalPages = Math.ceil(totalElements / size)
  const start = page * size
  const result = filtered.slice(start, start + size)

  return {
    statusCode: '200',
    result,
    totalElements,
    totalPages,
    numberOfElements: result.length,
  }
}

export const mockInterceptor: HttpInterceptorFn = (req, next) => {
  for (const route of MOCK_ROUTES) {
    if (!req.url.includes(route.pathSuffix)) continue

    if (req.method === 'GET' && !req.url.match(/\/\d+$/)) {
      const page = Number(req.params.get('page') ?? 0)
      const size = Number(req.params.get('size') ?? 10)
      const search = req.params.get('search') ?? ''

      return of(
        new HttpResponse({
          status: 200,
          body: buildPaginationResponse(route.data, page, size, search),
        }),
      )
    }

    if (req.method === 'GET') {
      const id = Number(req.url.split('/').pop())
      const item = route.data.find((d) => d['id'] === id)
      return of(new HttpResponse({ status: 200, body: item ?? null }))
    }

    if (req.method === 'POST') {
      return of(
        new HttpResponse({
          status: 201,
          body: { ...(req.body as object), id: Date.now() },
        }),
      )
    }

    if (req.method === 'PUT') {
      return of(new HttpResponse({ status: 200, body: req.body }))
    }

    if (req.method === 'DELETE') {
      return of(new HttpResponse({ status: 200, body: null }))
    }
  }

  return next(req)
}
