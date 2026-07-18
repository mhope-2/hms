import RefundsService from '../../src/services/refunds.service';
import RefundNotFoundException from '../../src/exceptions/refunds/RefundNotFoundException';
import RefundNotAllowedException from '../../src/exceptions/refunds/RefundNotAllowedException';
import PaymentNotFoundException from '../../src/exceptions/payments/PaymentNotFoundException';

const completedPayment = { _id: 'p1', bookingId: 'b1', amount: 250, status: 'completed' };
const refundBody = { paymentId: 'p1', reason: 'Trip cancelled' };

function mockRefundsRepo() {
  return {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    updateById: jest.fn(),
    findOpenByPaymentId: jest.fn().mockResolvedValue(null),
  };
}

describe('RefundsService', () => {
  let refunds: ReturnType<typeof mockRefundsRepo>;
  let payments: { findById: jest.Mock; updateById: jest.Mock };
  let service: RefundsService;

  beforeEach(() => {
    refunds = mockRefundsRepo();
    payments = {
      findById: jest.fn().mockResolvedValue(completedPayment),
      updateById: jest.fn().mockResolvedValue({ ...completedPayment, status: 'refunded' }),
    };
    service = new RefundsService(refunds as any, payments as any);
  });

  describe('requestRefund', () => {
    it('throws PaymentNotFoundException when the payment does not exist', async () => {
      payments.findById.mockResolvedValue(null);
      await expect(service.requestRefund(refundBody as any)).rejects.toBeInstanceOf(PaymentNotFoundException);
      expect(refunds.create).not.toHaveBeenCalled();
    });

    it('throws RefundNotAllowedException when the payment is not completed', async () => {
      payments.findById.mockResolvedValue({ ...completedPayment, status: 'refunded' });
      await expect(service.requestRefund(refundBody as any)).rejects.toBeInstanceOf(RefundNotAllowedException);
    });

    it('throws RefundNotAllowedException when an open refund already exists', async () => {
      refunds.findOpenByPaymentId.mockResolvedValue({ _id: 'r0', status: 'pending' });
      await expect(service.requestRefund(refundBody as any)).rejects.toBeInstanceOf(RefundNotAllowedException);
    });

    it('creates a pending refund for the full payment amount', async () => {
      refunds.create.mockImplementation(async (data: any) => ({ _id: 'r1', ...data }));
      const refund = await service.requestRefund(refundBody as any);
      expect(refund.status).toBe('pending');
      expect(refunds.create).toHaveBeenCalledWith({
        paymentId: 'p1',
        amount: 250,
        reason: 'Trip cancelled',
        status: 'pending',
      });
    });
  });

  describe('approveRefund', () => {
    it('throws RefundNotFoundException when missing', async () => {
      refunds.findById.mockResolvedValue(null);
      await expect(service.approveRefund('nope')).rejects.toBeInstanceOf(RefundNotFoundException);
    });

    it('throws RefundNotAllowedException when the refund is not pending', async () => {
      refunds.findById.mockResolvedValue({ _id: 'r1', paymentId: 'p1', status: 'declined' });
      await expect(service.approveRefund('r1')).rejects.toBeInstanceOf(RefundNotAllowedException);
    });

    it('marks the refund approved and the payment refunded', async () => {
      refunds.findById.mockResolvedValue({ _id: 'r1', paymentId: 'p1', status: 'pending' });
      refunds.updateById.mockResolvedValue({ _id: 'r1', paymentId: 'p1', status: 'approved' });
      const refund = await service.approveRefund('r1');
      expect(refund.status).toBe('approved');
      expect(refunds.updateById).toHaveBeenCalledWith('r1', { status: 'approved' });
      expect(payments.updateById).toHaveBeenCalledWith('p1', { status: 'refunded' });
    });
  });

  describe('declineRefund', () => {
    it('marks a pending refund declined without touching the payment', async () => {
      refunds.findById.mockResolvedValue({ _id: 'r1', paymentId: 'p1', status: 'pending' });
      refunds.updateById.mockResolvedValue({ _id: 'r1', paymentId: 'p1', status: 'declined' });
      const refund = await service.declineRefund('r1');
      expect(refund.status).toBe('declined');
      expect(payments.updateById).not.toHaveBeenCalled();
    });

    it('throws RefundNotAllowedException when the refund is not pending', async () => {
      refunds.findById.mockResolvedValue({ _id: 'r1', paymentId: 'p1', status: 'approved' });
      await expect(service.declineRefund('r1')).rejects.toBeInstanceOf(RefundNotAllowedException);
    });
  });

  it('getRefundById throws RefundNotFoundException when missing', async () => {
    refunds.findById.mockResolvedValue(null);
    await expect(service.getRefundById('nope')).rejects.toBeInstanceOf(RefundNotFoundException);
  });
});
