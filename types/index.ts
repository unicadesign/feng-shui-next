// User & Auth
export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  createdAt: string;
}

// ─── Course System ───────────────────────────────────────────

export type CourseType = 'standard' | 'one-time';
export type ZoomOption = 'none' | 'single' | 'weekly';

// App-facing interfaces (camelCase)
export interface Course {
  id: string;
  title: string;
  description: string;
  type: CourseType;
  price: number;
  priceRsd?: number;
  installmentPrice?: number;
  installmentPriceRsd?: number;
  installmentMonths?: number;
  zoomPriceSingle?: number;
  zoomPriceSingleRsd?: number;
  zoomPriceWeekly?: number;
  zoomPriceWeeklyRsd?: number;
  zoomSingleEnabled: boolean;
  zoomWeeklyEnabled: boolean;
  totalLessons: number;
  imageUrl: string;
  published: boolean;
  createdAt: string;
}

export interface CourseModule {
  id: string;
  courseId: string;
  orderIndex: number;
  title: string;
  description: string;
  isVazaIzobilja?: boolean;
}

export interface LessonVideo {
  id: string;
  lessonId: string;
  sortOrder: number;
  title: string;
  videoPath?: string;
  videoUrl: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  moduleId?: string;
  weekNumber: number;
  title: string;
  description: string;
  /** @deprecated use `videos` instead. Still populated from the legacy column for safety. */
  videoUrl: string;
  /** @deprecated use `videos` instead. Still populated from the legacy column for safety. */
  videoPath?: string;
  videos: LessonVideo[];
  isVazaIzobilja?: boolean;
  availableAfterWeeks: number;
  hasQandA?: boolean;
  hasPracticalExercise?: boolean;
  hasOnlineTest?: boolean;
}

// ─── DB Row Types (snake_case, matching Supabase columns) ────

export interface CourseRow {
  id: string;
  title: string;
  description: string;
  type: string;
  price: number;
  price_rsd: number | null;
  installment_price: number | null;
  installment_price_rsd: number | null;
  installment_months: number | null;
  zoom_price_single: number | null;
  zoom_price_single_rsd: number | null;
  zoom_price_weekly: number | null;
  zoom_price_weekly_rsd: number | null;
  zoom_single_enabled: boolean | null;
  zoom_weekly_enabled: boolean | null;
  total_lessons: number;
  image_url: string;
  published: boolean;
  created_at: string;
}

export type CourseInsert = Omit<CourseRow, 'id' | 'created_at'>;

export interface CourseModuleRow {
  id: string;
  course_id: string;
  order_index: number;
  title: string;
  description: string;
  is_vaza_izobilja: boolean;
  created_at: string;
}

export type CourseModuleInsert = Omit<CourseModuleRow, 'id' | 'created_at'>;

export interface LessonRow {
  id: string;
  course_id: string;
  module_id: string | null;
  week_number: number;
  title: string;
  description: string;
  video_url: string;
  video_path: string | null;
  is_vaza_izobilja: boolean;
  available_after_weeks: number;
  has_qand_a: boolean;
  has_practical_exercise: boolean;
  has_online_test: boolean;
  created_at: string;
}

export type LessonInsert = Omit<LessonRow, 'id' | 'created_at'>;

export interface LessonVideoRow {
  id: string;
  lesson_id: string;
  sort_order: number;
  title: string;
  video_path: string | null;
  video_url: string;
  created_at: string;
}

export type LessonVideoInsert = Omit<LessonVideoRow, 'id' | 'created_at'>;

export interface EnrollmentRow {
  id: string;
  user_id: string;
  course_id: string;
  zoom_option: string;
  payment_type: string;
  status: string;
  start_date: string;
  created_at: string;
}

export interface PaymentRow {
  id: string;
  enrollment_id: string;
  amount: number;
  month: number;
  status: string;
  paid_at: string | null;
  paypal_transaction_id: string | null;
  created_at: string;
}

export interface ZoomLinkRow {
  id: string;
  enrollment_id: string;
  week_number: number;
  url: string;
  scheduled_at: string;
  created_at: string;
}

// ─── Row → App converters ────────────────────────────────────

export function toCourse(row: CourseRow): Course {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    type: row.type as CourseType,
    price: Number(row.price),
    priceRsd: row.price_rsd != null ? Number(row.price_rsd) : undefined,
    installmentPrice: row.installment_price != null ? Number(row.installment_price) : undefined,
    installmentPriceRsd: row.installment_price_rsd != null ? Number(row.installment_price_rsd) : undefined,
    installmentMonths: row.installment_months ?? undefined,
    zoomPriceSingle: row.zoom_price_single != null ? Number(row.zoom_price_single) : undefined,
    zoomPriceSingleRsd: row.zoom_price_single_rsd != null ? Number(row.zoom_price_single_rsd) : undefined,
    zoomPriceWeekly: row.zoom_price_weekly != null ? Number(row.zoom_price_weekly) : undefined,
    zoomPriceWeeklyRsd: row.zoom_price_weekly_rsd != null ? Number(row.zoom_price_weekly_rsd) : undefined,
    zoomSingleEnabled: row.zoom_single_enabled ?? (row.zoom_price_single != null),
    zoomWeeklyEnabled: row.zoom_weekly_enabled ?? (row.zoom_price_weekly != null),
    totalLessons: row.total_lessons,
    imageUrl: row.image_url,
    published: row.published,
    createdAt: row.created_at,
  };
}

export function toCourseModule(row: CourseModuleRow): CourseModule {
  return {
    id: row.id,
    courseId: row.course_id,
    orderIndex: row.order_index,
    title: row.title,
    description: row.description,
    isVazaIzobilja: row.is_vaza_izobilja || undefined,
  };
}

export function toLesson(row: LessonRow, videoRows: LessonVideoRow[] = []): Lesson {
  return {
    id: row.id,
    courseId: row.course_id,
    moduleId: row.module_id ?? undefined,
    weekNumber: row.week_number,
    title: row.title,
    description: row.description,
    videoUrl: row.video_url,
    videoPath: row.video_path ?? undefined,
    videos: videoRows.map(toLessonVideo),
    isVazaIzobilja: row.is_vaza_izobilja || undefined,
    availableAfterWeeks: row.available_after_weeks,
    hasQandA: row.has_qand_a || undefined,
    hasPracticalExercise: row.has_practical_exercise || undefined,
    hasOnlineTest: row.has_online_test || undefined,
  };
}

export function toLessonVideo(row: LessonVideoRow): LessonVideo {
  return {
    id: row.id,
    lessonId: row.lesson_id,
    sortOrder: row.sort_order,
    title: row.title,
    videoPath: row.video_path ?? undefined,
    videoUrl: row.video_url,
  };
}

export function toPayment(row: PaymentRow): Payment {
  return {
    id: row.id,
    enrollmentId: row.enrollment_id,
    amount: Number(row.amount),
    month: row.month,
    status: row.status as PaymentStatus,
    paidAt: row.paid_at ?? undefined,
    paypalTransactionId: row.paypal_transaction_id ?? undefined,
  };
}

export function toZoomLink(row: ZoomLinkRow): ZoomLink {
  return {
    id: row.id,
    enrollmentId: row.enrollment_id,
    weekNumber: row.week_number,
    url: row.url,
    scheduledAt: row.scheduled_at,
  };
}

export function toEnrollment(
  row: EnrollmentRow,
  paymentRows: PaymentRow[],
  zoomLinkRows: ZoomLinkRow[]
): Enrollment {
  return {
    id: row.id,
    userId: row.user_id,
    courseId: row.course_id,
    zoomOption: row.zoom_option as ZoomOption,
    paymentType: row.payment_type as PaymentType,
    status: row.status as EnrollmentStatus,
    startDate: row.start_date,
    payments: paymentRows.map(toPayment),
    zoomLinks: zoomLinkRows.map(toZoomLink),
  };
}

// ─── Enrollment & Payments (app-facing) ──────────────────────

export type PaymentType = 'full' | 'installment';
export type PaymentStatus = 'paid' | 'pending' | 'overdue';
export type EnrollmentStatus = 'active' | 'paused' | 'completed';

export interface Payment {
  id: string;
  enrollmentId: string;
  amount: number;
  month: number;
  status: PaymentStatus;
  paidAt?: string;
  paypalTransactionId?: string;
}

export interface ZoomLink {
  id?: string;
  enrollmentId?: string;
  weekNumber: number;
  url: string;
  scheduledAt: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  zoomOption: ZoomOption;
  paymentType: PaymentType;
  status: EnrollmentStatus;
  startDate: string;
  payments: Payment[];
  zoomLinks?: ZoomLink[];
}
