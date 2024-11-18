export interface EmailService {
  sendEmail(params: {
    to: string;
    from: string;
    subject: string;
    body: string;
  }): Promise<void>;
}
