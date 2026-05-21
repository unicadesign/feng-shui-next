export interface NewsletterSubscriber {
  id: string;
  email: string;
  created_at: string;
}

export type NewsletterInsert = Pick<NewsletterSubscriber, 'email'>;
