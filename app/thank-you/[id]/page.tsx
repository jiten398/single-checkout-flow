'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface OrderData {
  _id: string;
  orderId: string;
  product: {
    name: string;
    price: number;
    variant: {
      color: string;
      size: string;
    };
    quantity: number;
  };
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  payment: {
    status: string;
    cardNumber: string;
  };
  total: number;
  createdAt: string;
}

export default function ThankYouPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get status from URL params if provided
  const statusParam = searchParams.get('status');

  useEffect(() => {
    const fetchOrder = async () => {
      const orderId = params?.id as string;

      if (!orderId) {
        setError('No order ID provided');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/orders?orderId=${orderId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch order');
        }

        setOrder(data);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError(err instanceof Error ? err.message : 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'We couldn\'t find your order.'}</p>
          <Link 
            href="/" 
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // Use status from order or URL param
  const status = statusParam || order.payment.status;
  const isApproved = status === 'approved';
  const isDeclined = status === 'declined';
  const isError = status === 'error';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Status Header */}
          <div className="text-center mb-8">
            {isApproved && (
              <>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-green-600">Order Confirmed!</h1>
                <p className="text-gray-600 mt-2">Thank you for your purchase</p>
              </>
            )}
            
            {isDeclined && (
              <>
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-orange-600">Payment Declined</h1>
                <p className="text-gray-600 mt-2">Your card was declined by the bank</p>
              </>
            )}
            
            {isError && (
              <>
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-red-600">Payment Gateway Error</h1>
                <p className="text-gray-600 mt-2">A technical error occurred during payment processing</p>
              </>
            )}
          </div>

          {/* Order Details */}
          <div className="border-t border-b py-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            <p className="text-lg mb-2">
              Order Number: <span className="font-mono font-semibold">{order.orderId}</span>
            </p>
            <p className="text-sm text-gray-600">
              Order Date: {new Date(order.createdAt).toLocaleString()}
            </p>
            
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Product Information</h3>
              <div className="bg-gray-50 p-4 rounded">
                <p className="font-medium">{order.product.name}</p>
                <p className="text-sm text-gray-600">
                  Variant: {order.product.variant.color} / {order.product.variant.size}
                </p>
                <p className="text-sm text-gray-600">Quantity: {order.product.quantity}</p>
                <p className="text-sm text-gray-600">Price: ${order.product.price.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Customer Information - Only show for approved orders */}
          {isApproved && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Shipping Information</h3>
              <div className="bg-gray-50 p-4 rounded space-y-1">
                <p><span className="font-medium">Name:</span> {order.customer.fullName}</p>
                <p><span className="font-medium">Email:</span> {order.customer.email}</p>
                <p><span className="font-medium">Phone:</span> {order.customer.phone}</p>
                <p><span className="font-medium">Address:</span> {order.customer.address}</p>
                <p>
                  <span className="font-medium">City/State/Zip:</span> {order.customer.city}, {order.customer.state} {order.customer.zipCode}
                </p>
                {order.payment.cardNumber && (
                  <p><span className="font-medium">Card:</span> **** **** **** {order.payment.cardNumber}</p>
                )}
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="mb-8">
            <h3 className="font-semibold mb-2">Order Summary</h3>
            <div className="bg-gray-50 p-4 rounded">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${(order.product.price * order.product.quantity).toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status-specific content */}
          <div className="text-center">
            {isApproved && (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-green-800 text-sm">
                    ✅ A confirmation email has been sent to <strong>{order.customer.email}</strong>
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  You will receive shipping information within 24 hours.
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Expected delivery: 3-5 business days
                </p>
              </div>
            )}

            {isDeclined && (
              <div className="space-y-4">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 max-w-md mx-auto">
                  <h4 className="font-semibold text-orange-900 mb-2">What happened?</h4>
                  <p className="text-orange-800 text-sm mb-4">
                    Your payment was declined. This could be due to:
                  </p>
                  <ul className="text-left text-sm text-orange-700 space-y-1 mb-4">
                    <li>• Insufficient funds</li>
                    <li>• Incorrect card information</li>
                    <li>• Card security restrictions</li>
                    <li>• Daily transaction limit exceeded</li>
                  </ul>
                  <p className="text-orange-800 text-sm">
                    Please check with your bank or try a different payment method.
                  </p>
                </div>
                <Link 
                  href="/checkout" 
                  className="inline-block bg-orange-600 text-white px-8 py-3 rounded-md hover:bg-orange-700 transition font-medium"
                >
                  Try Again with Different Card
                </Link>
              </div>
            )}

            {isError && (
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                  <h4 className="font-semibold text-red-900 mb-2">Technical Error</h4>
                  <p className="text-red-800 text-sm mb-4">
                    We encountered a technical issue while processing your payment.
                  </p>
                  <div className="bg-red-100 rounded p-3 mb-4">
                    <p className="text-xs font-mono text-red-700">
                      Error Code: GATEWAY_TIMEOUT_500
                    </p>
                  </div>
                  <p className="text-red-800 text-sm">
                    Don't worry - no charges were made to your card. Please try again in a few moments.
                  </p>
                </div>
                <div className="flex gap-4 justify-center">
                  <Link 
                    href="/checkout" 
                    className="inline-block bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition font-medium"
                  >
                    Retry Payment
                  </Link>
                  <Link 
                    href="/support" 
                    className="inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition font-medium"
                  >
                    Contact Support (Page Not Added)
                  </Link>
                </div>
              </div>
            )}
            
            {/* Common footer links */}
            <div className="mt-8 pt-8 border-t">
              <div className="flex justify-center gap-6 text-sm">
                <Link 
                  href="/" 
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Continue Shopping
                </Link>
                {isApproved && (
                  <Link 
                    href={`/orders/${order.orderId}`}
                    className="text-blue-600 hover:underline"
                  >
                    Track Order (Page Not Added)
                  </Link>
                )}
                <button
                  onClick={() => window.print()}
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print Receipt
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information Cards */}
        {isApproved && (
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Check Your Email</h3>
              <p className="text-sm text-gray-600">Order confirmation sent</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Processing Order</h3>
              <p className="text-sm text-gray-600">Preparing for shipment</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Fast Delivery</h3>
              <p className="text-sm text-gray-600">3-5 business days</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}