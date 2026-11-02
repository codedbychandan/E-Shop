"use client";

import { Download, Printer, X, CheckCircle, ShieldCheck } from "lucide-react";
import type { Order } from "@/data/types";
import { formatDateTime, inr } from "@/lib/format";

interface InvoiceModalProps {
  order: Order;
  open: boolean;
  onClose: () => void;
}

export function InvoiceModal({ order, open, onClose }: InvoiceModalProps) {
  if (!open) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber = `NX-INV-${order.id.replace(/\D/g, "") || Date.now().toString().slice(-6)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-2xl transition-all my-8">
        
        {/* Modal Actions - Hidden on print */}
        <div className="no-print mb-6 flex items-center justify-between border-b border-line pb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600">
              <Printer size={18} />
            </span>
            <div>
              <h3 className="font-bold text-ink">Tax Invoice Preview</h3>
              <p className="text-xs text-muted">Official GST compliant receipt</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="btn-primary h-9 px-4 text-xs sm:text-sm gap-1.5 shadow-sm"
            >
              <Download size={15} /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              aria-label="Close"
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-surface2 hover:text-ink transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="printable-invoice bg-white text-neutral-900 rounded-2xl p-6 sm:p-8 border border-neutral-200">
          
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-neutral-200 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-lg">
                  N
                </span>
                <span className="text-2xl font-black tracking-tight text-neutral-900">
                  E-Shop
                </span>
              </div>
              <p className="mt-2 text-xs text-neutral-500 leading-relaxed max-w-xs">
                E-Shop Retail Technologies Pvt. Ltd.<br />
                Tower B, Express Trade Zone, Sector 62<br />
                Noida, Uttar Pradesh — 201309<br />
                GSTIN: <span className="font-semibold text-neutral-700">09AAACN1234F1Z5</span>
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block rounded-md bg-emerald-100 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-emerald-800">
                Tax Invoice / Bill of Supply
              </span>
              <p className="mt-2 text-xs font-medium text-neutral-500">
                Invoice No: <span className="font-mono font-bold text-neutral-900">{invoiceNumber}</span>
              </p>
              <p className="text-xs font-medium text-neutral-500">
                Order ID: <span className="font-mono font-semibold text-neutral-900">{order.id}</span>
              </p>
              <p className="text-xs font-medium text-neutral-500">
                Date: <span className="text-neutral-900">{formatDateTime(order.date)}</span>
              </p>
            </div>
          </div>

          {/* Billing & Shipping */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-neutral-200 pb-6 text-xs">
            <div>
              <p className="font-bold uppercase tracking-wider text-neutral-400 mb-1">
                Billed To & Shipped To
              </p>
              <p className="font-bold text-sm text-neutral-900">{order.address.fullName}</p>
              <p className="text-neutral-600 mt-1 leading-relaxed">
                {order.address.line}<br />
                {order.address.city}, {order.address.state} — {order.address.pincode}
              </p>
              <p className="text-neutral-600 mt-1">Phone: {order.address.phone}</p>
              <p className="text-neutral-600">Email: {order.address.email}</p>
            </div>

            <div className="sm:text-right">
              <p className="font-bold uppercase tracking-wider text-neutral-400 mb-1">
                Payment Details
              </p>
              <p className="font-semibold text-neutral-900">
                Method: {order.paymentMethod}
              </p>
              <p className="text-neutral-600 mt-0.5">
                Status: <span className="text-emerald-700 font-semibold">Payment Completed</span>
              </p>
              <p className="text-neutral-600 mt-0.5">
                Order Status: <span className="font-semibold">{order.status}</span>
              </p>
              <p className="text-neutral-600 mt-0.5">
                Est. Delivery: {order.deliveryEstimate}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">#</th>
                  <th className="pb-3 font-semibold">Item Description</th>
                  <th className="pb-3 font-semibold text-center">HSN</th>
                  <th className="pb-3 font-semibold text-center">Qty</th>
                  <th className="pb-3 font-semibold text-right">Price</th>
                  <th className="pb-3 font-semibold text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {order.items.map((item, index) => (
                  <tr key={index} className="text-neutral-800">
                    <td className="py-3 text-neutral-400">{index + 1}</td>
                    <td className="py-3">
                      <p className="font-semibold text-neutral-900">{item.name}</p>
                      <p className="text-[11px] text-neutral-500">
                        Brand: {item.brand} {item.color ? `· Color: ${item.color}` : ""} {item.size ? `· Size: ${item.size}` : ""}
                      </p>
                    </td>
                    <td className="py-3 text-center text-neutral-500 font-mono">8517</td>
                    <td className="py-3 text-center font-medium">{item.quantity}</td>
                    <td className="py-3 text-right">{inr(item.price)}</td>
                    <td className="py-3 text-right font-semibold">{inr(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Breakdown */}
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-start gap-6 border-t border-neutral-200 pt-6">
            <div className="max-w-xs text-xs text-neutral-500 leading-relaxed">
              <div className="flex items-center gap-1.5 text-neutral-800 font-semibold mb-1">
                <ShieldCheck size={14} className="text-emerald-600" /> 100% Genuine Products
              </div>
              <p>
                Returns/replacements are accepted within 7 days of delivery in original packaging.
                This is a computer-generated invoice and requires no physical signature.
              </p>
            </div>

            <div className="w-full sm:w-64 space-y-2 text-xs text-neutral-700">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium">{inr(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Discount {order.coupon ? `(${order.coupon})` : ""}:</span>
                  <span>-{inr(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee:</span>
                <span>{order.shipping === 0 ? "Free" : inr(order.shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST Tax (5%):</span>
                <span>{inr(order.tax)}</span>
              </div>
              <div className="flex justify-between border-t border-neutral-300 pt-2 text-sm font-bold text-neutral-900">
                <span>Grand Total:</span>
                <span>{inr(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-8 border-t border-neutral-200 pt-4 text-center text-[11px] text-neutral-400">
            Thank you for shopping with E-Shop! For any support, contact support@E-Shop.in
          </div>
        </div>

      </div>
    </div>
  );
}
