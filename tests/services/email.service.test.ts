const sendMailMock = jest.fn();
const createTransportMock = jest.fn(() => ({ sendMail: sendMailMock }));
jest.mock('nodemailer', () => ({ createTransport: (config: any) => createTransportMock(config) }));

import EmailService from '../../src/services/email.service';

const payload = {
  senderEmail: 'hotel@example.com',
  recipientEmail: 'guest@example.com',
  userFullName: 'Guest One',
  recipientPhone: '+233000000',
  subject: 'TEST',
  mailContent: 'hello',
};

describe('EmailService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EMAIL_HOST = 'smtp.example.com';
    process.env.EMAIL_PORT = '465';
    process.env.SMTP_USER_EMAIL = 'user@example.com';
    process.env.SMTP_USER_PASSWORD = 'secret';
    process.env.SMTP_FROM_EMAIL = 'noreply@example.com';
  });

  it('creates the transporter lazily with auth.pass (not auth.password)', async () => {
    sendMailMock.mockResolvedValue({ accepted: [payload.recipientEmail] });
    const service = new EmailService();
    expect(createTransportMock).not.toHaveBeenCalled(); // lazy: nothing at construction
    await service.send(payload);
    expect(createTransportMock).toHaveBeenCalledWith(expect.objectContaining({
      host: 'smtp.example.com',
      port: 465,
      auth: { user: 'user@example.com', pass: 'secret' },
    }));
  });

  it('sends to the recipient with the given subject', async () => {
    sendMailMock.mockResolvedValue({});
    await new EmailService().send(payload);
    expect(sendMailMock).toHaveBeenCalledWith(expect.objectContaining({
      from: 'noreply@example.com',
      to: 'guest@example.com',
      subject: 'TEST',
    }));
  });

  it('reuses the transporter across sends', async () => {
    sendMailMock.mockResolvedValue({});
    const service = new EmailService();
    await service.send(payload);
    await service.send(payload);
    expect(createTransportMock).toHaveBeenCalledTimes(1);
  });

  it('rejects when the transport fails', async () => {
    sendMailMock.mockRejectedValue(new Error('SMTP down'));
    await expect(new EmailService().send(payload)).rejects.toThrow('SMTP down');
  });
});
