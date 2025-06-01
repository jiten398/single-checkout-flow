import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST || 'sandbox.smtp.mailtrap.io',
  port: parseInt(process.env.MAILTRAP_PORT || '2525'),
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

export const sendOrderConfirmation = async (order: any) => {
  const { customer, product, orderId, payment } = order;
  
  const mailOptions = {
    from: 'noreply@ecommerce.com',
    to: customer.email,
    subject: payment.status === 'approved' 
      ? `Order Confirmed - #${orderId}`
      : `Order Failed - #${orderId}`,
    html: payment.status === 'approved'
      ? `
        <h1>Order Confirmed!</h1>
        <p>Thank you for your order, ${customer.fullName}!</p>
        <h2>Order Details:</h2>
        <p>Order Number: ${orderId}</p>
        <p>Product: ${product.name}</p>
        <p>Quantity: ${product.quantity}</p>
        <p>Total: $${order.total}</p>
        <p>We'll send you shipping information soon.</p>
      `
      : `
        <h1>Order Failed</h1>
        <p>Hi ${customer.fullName},</p>
        <p>Unfortunately, your order #${orderId} could not be processed.</p>
        <p>Reason: ${payment.status === 'declined' ? 'Card was declined' : 'Gateway error'}</p>
        <p>Please try again or contact support.</p>
      `
  };

  await transporter.sendMail(mailOptions);
};