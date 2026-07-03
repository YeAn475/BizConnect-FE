import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from './AppShell'
import { AuthLayout } from './AuthLayout'
import { RequireAuth } from './RequireAuth'
import { RootErrorBoundary } from './RootErrorBoundary'
import { IndexRedirect } from './IndexRedirect'

import { LoginPage } from '@/features/auth/LoginPage'
import { SignupPage } from '@/features/auth/SignupPage'

import { ProfilePage } from '@/features/profile/ProfilePage'

import { CompanyInfoPage } from '@/features/company/CompanyInfoPage'
import { CompanyDirectoryPage } from '@/features/company/CompanyDirectoryPage'
import { CompanyRequestPage } from '@/features/company/CompanyRequestPage'

import { AlarmListPage } from '@/features/alarm/AlarmListPage'

import { FriendListPage } from '@/features/friend/FriendListPage'
import { FriendSearchPage } from '@/features/friend/FriendSearchPage'
import { FriendRequestsPage } from '@/features/friend/FriendRequestsPage'
import { FriendDetailPage } from '@/features/friend/FriendDetailPage'

import { ChatroomListPage } from '@/features/chat/ChatroomListPage'
import { ChatroomDetailPage } from '@/features/chat/ChatroomDetailPage'

import { NoticeListPage } from '@/features/notice/NoticeListPage'
import { NoticeDetailPage } from '@/features/notice/NoticeDetailPage'
import { NoticeFormPage } from '@/features/notice/NoticeFormPage'

import { ScheduleListPage } from '@/features/schedule/ScheduleListPage'
import { ScheduleDetailPage } from '@/features/schedule/ScheduleDetailPage'
import { ScheduleFormPage } from '@/features/schedule/ScheduleFormPage'

import { InquiryListPage } from '@/features/inquiry/InquiryListPage'
import { InquiryDetailPage } from '@/features/inquiry/InquiryDetailPage'
import { InquiryFormPage } from '@/features/inquiry/InquiryFormPage'

import { SupplierListPage } from '@/features/cart/buyer/SupplierListPage'
import { SupplierProductListPage } from '@/features/cart/buyer/SupplierProductListPage'
import { BuyerProductDetailPage } from '@/features/cart/buyer/BuyerProductDetailPage'
import { BuyerOrderListPage } from '@/features/order/buyer/BuyerOrderListPage'
import { BuyerOrderCreatePage } from '@/features/order/buyer/BuyerOrderCreatePage'
import { BuyerOrderDetailPage } from '@/features/order/buyer/BuyerOrderDetailPage'

import { ProductListPage } from '@/features/product/ProductListPage'
import { ProductCreatePage } from '@/features/product/ProductCreatePage'
import { ProductDetailPage } from '@/features/product/ProductDetailPage'
import { SupplierAssignmentsListPage } from '@/features/cart/supplier/SupplierAssignmentsListPage'
import { SupplierAssignmentDetailPage } from '@/features/cart/supplier/SupplierAssignmentDetailPage'
import { SupplierOrderListPage } from '@/features/order/supplier/SupplierOrderListPage'
import { SupplierOrderDetailPage } from '@/features/order/supplier/SupplierOrderDetailPage'

import { NotFoundPage } from '@/features/misc/NotFoundPage'

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    errorElement: <RootErrorBoundary />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> },
    ],
  },
  {
    element: <RequireAuth />,
    errorElement: <RootErrorBoundary />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <IndexRedirect /> },
          { path: '/profile', element: <ProfilePage /> },

          { path: '/company', element: <CompanyInfoPage /> },
          { path: '/company/directory', element: <CompanyDirectoryPage /> },
          { path: '/company/request', element: <CompanyRequestPage /> },

          { path: '/alarms', element: <AlarmListPage /> },

          { path: '/friends', element: <FriendListPage /> },
          { path: '/friends/search', element: <FriendSearchPage /> },
          { path: '/friends/requests', element: <FriendRequestsPage /> },
          { path: '/friends/:userNo', element: <FriendDetailPage /> },

          { path: '/chat', element: <ChatroomListPage /> },
          { path: '/chat/:chatroomNo', element: <ChatroomDetailPage /> },

          { path: '/notices', element: <NoticeListPage /> },
          { path: '/notices/new', element: <NoticeFormPage /> },
          { path: '/notices/:noticeNo', element: <NoticeDetailPage /> },
          { path: '/notices/:noticeNo/edit', element: <NoticeFormPage /> },

          { path: '/schedules', element: <ScheduleListPage /> },
          { path: '/schedules/new', element: <ScheduleFormPage /> },
          { path: '/schedules/:scheduleNo', element: <ScheduleDetailPage /> },

          { path: '/inquiries', element: <InquiryListPage /> },
          { path: '/inquiries/new', element: <InquiryFormPage /> },
          { path: '/inquiries/:inquiryNo', element: <InquiryDetailPage /> },

          { path: '/buyer', element: <SupplierListPage /> },
          { path: '/buyer/suppliers', element: <SupplierListPage /> },
          { path: '/buyer/suppliers/:supplierCompanyNo', element: <SupplierProductListPage /> },
          { path: '/buyer/suppliers/:supplierCompanyNo/:productNo', element: <BuyerProductDetailPage /> },
          { path: '/buyer/orders', element: <BuyerOrderListPage /> },
          { path: '/buyer/orders/new', element: <BuyerOrderCreatePage /> },
          { path: '/buyer/orders/:orderNo', element: <BuyerOrderDetailPage /> },

          { path: '/supplier', element: <ProductListPage /> },
          { path: '/supplier/products', element: <ProductListPage /> },
          { path: '/supplier/products/new', element: <ProductCreatePage /> },
          { path: '/supplier/products/:productNo', element: <ProductDetailPage /> },
          { path: '/supplier/assignments', element: <SupplierAssignmentsListPage /> },
          { path: '/supplier/assignments/:buyerCompanyNo', element: <SupplierAssignmentDetailPage /> },
          { path: '/supplier/orders', element: <SupplierOrderListPage /> },
          { path: '/supplier/orders/:orderNo', element: <SupplierOrderDetailPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
