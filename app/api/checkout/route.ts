import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { sendOrderConfirmation } from '@/lib/mailer';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { customer, product, paymentStatus, total } = body;

    // Generate unique order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    console.log('Creating order with ID:', orderId);

    // Create order document with updated structure
    const orderData = {
      orderId,
      product: {
        name: product.name,
        price: product.finalPrice || product.price,
        variant: {
          color: product.selectedVariant?.variantName || product.variant?.color,
          size: product.selectedSize?.name || product.variant?.size
        },
        quantity: product.quantity
      },
      customer: {
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        zipCode: customer.zipCode
      },
      payment: {
        cardNumber: customer.cardNumber.slice(-4),
        status: paymentStatus
      },
      total
    };

    // Save to database
    const order = new Order(orderData);
    await order.save();

    console.log('Order saved successfully:', order._id);

    // Send confirmation email (don't wait for it)
    sendOrderConfirmation(order).catch(error => {
      console.error('Email error:', error);
    });

    return NextResponse.json({
      success: true,
      orderId: order.orderId
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Checkout failed' },
      { status: 500 }
    );
  }
}