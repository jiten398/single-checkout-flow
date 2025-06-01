'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (status: 'approved' | 'declined' | 'error') => void;
  loading: boolean;
}

export default function TransactionModal({ isOpen, onClose, onSelect, loading }: TransactionModalProps) {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSelect = async (status: 'approved' | 'declined' | 'error') => {
    if (status === 'approved') {
      setShowSuccess(true);
      setTimeout(() => {
        onSelect(status);
      }, 2000); // Show success animation for 2 seconds
    } else {
      onSelect(status);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
              {showSuccess ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4"
                  >
                    <motion.svg
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="w-12 h-12 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <motion.path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </motion.svg>
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900">Payment Successful!</h3>
                  <p className="text-gray-600 mt-2">Redirecting to order confirmation...</p>
                </motion.div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                    Simulate Transaction
                  </h2>
                  <p className="text-gray-600 text-center mb-6">
                    Select a transaction outcome to test the flow
                  </p>

                  <div className="space-y-3">
                    {/* Approved Option */}
                    <button
                      onClick={() => handleSelect('approved')}
                      disabled={loading}
                      className="w-full p-4 border-2 border-green-200 bg-green-50 rounded-xl hover:bg-green-100 hover:border-green-300 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center group-hover:bg-green-300 transition-colors">
                            <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="text-left">
                            <h3 className="font-semibold text-green-900">Approved</h3>
                            <p className="text-sm text-green-700">Transaction successful</p>
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>

                    {/* Declined Option */}
                    <button
                      onClick={() => handleSelect('declined')}
                      disabled={loading}
                      className="w-full p-4 border-2 border-orange-200 bg-orange-50 rounded-xl hover:bg-orange-100 hover:border-orange-300 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center group-hover:bg-orange-300 transition-colors">
                            <svg className="w-6 h-6 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="text-left">
                            <h3 className="font-semibold text-orange-900">Declined</h3>
                            <p className="text-sm text-orange-700">Card was declined</p>
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>

                    {/* Error Option */}
                    <button
                      onClick={() => handleSelect('error')}
                      disabled={loading}
                      className="w-full p-4 border-2 border-red-200 bg-red-50 rounded-xl hover:bg-red-100 hover:border-red-300 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-red-200 rounded-full flex items-center justify-center group-hover:bg-red-300 transition-colors">
                            <svg className="w-6 h-6 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>
                          <div className="text-left">
                            <h3 className="font-semibold text-red-900">Gateway Error</h3>
                            <p className="text-sm text-red-700">Payment gateway failed</p>
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  </div>

                  <button
                    onClick={onClose}
                    disabled={loading}
                    className="w-full mt-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}