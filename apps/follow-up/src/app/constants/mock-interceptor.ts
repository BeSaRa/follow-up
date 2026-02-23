import { HttpInterceptorFn, HttpResponse } from '@angular/common/http'
import { of } from 'rxjs'
import { ApplicationUser } from '../features/application-user/models/application-user'

const mockApplicationUsers: Partial<ApplicationUser>[] = [
  {
    id: 1,
    arName: 'أحمد محمد',
    enName: 'Ahmed Mohammed',
    employeeNo: 'EMP001',
    status: true,
    qid: '28401234567',
    email: 'ahmed@example.com',
    mobile: '55512345',
    enableEmailNotification: true,
  },
  {
    id: 2,
    arName: 'فاطمة علي',
    enName: 'Fatima Ali',
    employeeNo: 'EMP002',
    status: true,
    qid: '28407654321',
    email: 'fatima@example.com',
    mobile: '55567890',
    enableEmailNotification: false,
  },
  {
    id: 3,
    arName: 'خالد حسن',
    enName: 'Khalid Hassan',
    employeeNo: 'EMP003',
    status: false,
    qid: '28409876543',
    email: 'khalid@example.com',
    mobile: '55511111',
    enableEmailNotification: true,
  },
]

const mockRoutes: Record<string, unknown> = {
  'application-user': mockApplicationUsers,
}

export const mockInterceptor: HttpInterceptorFn = (req, next) => {
  const matchedKey = Object.keys(mockRoutes).find((key) =>
    req.url.includes(key),
  )

  if (matchedKey) {
    console.log(`[mock] intercepted: ${req.method} ${req.url}`)
    return of(
      new HttpResponse({
        status: 200,
        body: mockRoutes[matchedKey],
      }),
    )
  }

  return next(req)
}
