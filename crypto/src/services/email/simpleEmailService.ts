import { EmailService } from ".";
import { Logger } from "../logger";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

export class SesEmailService implements EmailService {
  protected logger: Logger;
  protected sesClient: SESClient;

  constructor(params: { logger: Logger }) {
    this.logger = params.logger;
    this.sesClient = new SESClient();
  }

  /**
   * Sends a simple email via AWS SES to the provided recipient.
   */
  async sendEmail(params: {
    to: string;
    from: string;
    subject: string;
    body: string;
  }): Promise<void> {
    try {
      const email = new SendEmailCommand({
        Destination: {
          ToAddresses: [params.to],
        },
        Message: {
          Body: {
            Text: {
              Charset: "UTF-8",
              Data: params.body,
            },
          },
          Subject: {
            Charset: "UTF-8",
            Data: params.subject,
          },
        },
        Source: params.from,
      });

      const response = await this.sesClient.send(email);
    } catch (error) {
      if (error instanceof Error && error.name === "MessageRejected") {
        this.logger.warn({
          message: "Email sent via SES client has been rejected",
          data: JSON.stringify(params),
        });

        return;
      }

      throw error;
    }
  }
}
