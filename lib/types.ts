export interface Member {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  specialty: string
  institution: string
  position: string
  experience: string
  interests?: string
  referral?: string
  subscribed_newsletter: boolean
  status: "pending" | "approved" | "rejected"
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  title: string
  description: string
  content?: string
  date: string
  time?: string
  end_date?: string
  location: string
  type: "conference" | "workshop" | "seminar" | "webinar" | "training"
  image_url?: string
  capacity?: number
  registration_link?: string
  disclaimer?: string
  latitude?: number
  longitude?: number
  registration_form_config?: any // Using any for now, or define specific schema
  abstract_submission_link?: string
  abstract_details?: string
  is_featured: boolean
  is_past: boolean
  is_draft?: boolean
  is_summit_2026?: boolean
  is_registration_closed?: boolean
  created_at: string
  updated_at: string
}

export interface RegistrationField {
  id: string
  type: "text" | "number" | "select" | "checkbox" | "file" | "date"
  label: string
  required?: boolean
  options?: string[] // For select/checkbox
  placeholder?: string
}

export interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  author_role?: string
  author_image?: string
  category: string
  image_url?: string
  read_time?: string
  is_featured: boolean
  is_published: boolean
  published_at?: string
  created_at: string
  updated_at: string
}

export interface NewsletterSubscriber {
  id: string
  email: string
  is_active: boolean
  source: string
  created_at: string
  updated_at: string
}

export interface AdminUser {
  id: string
  email: string
  role: "admin" | "super_admin"
  created_at: string
}

export type EventSectionType =
  | "table"
  | "slider"
  | "image"
  | "grid"
  | "leadership"
  | "text"
  | "bullets"
  | "heading";

export interface EventSection {
  id: string;
  type: EventSectionType;
  content: any; // specific structure depends on type
}
