import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const InvoiceGenerator = ({ invoiceData }) => {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Add company info
    doc.setFontSize(18);
    doc.text('Almadina Agro Vehari', 105, 15, null, null, 'center');
    doc.setFontSize(12);
    doc.text('Invoice', 105, 25, null, null, 'center');

    // Add customer info
    doc.setFontSize(10);
    doc.text(`Customer: ${invoiceData.sale.customer.name}`, 14, 40);
    doc.text(`Contact: ${invoiceData.sale.customer.contact}`, 14, 45);
    doc.text(`Date: ${new Date(invoiceData.sale.date).toLocaleDateString()}`, 14, 50);

    // Add invoice number
    doc.text(`Invoice #: ${invoiceData.sale.id}`, 180, 40, null, null, 'right');

    // Create table
    const tableData = invoiceData.products.map(item => [
      item.name,
      item.quantity,
      `PKR ${item.price.toFixed(2)}`,
      `PKR ${(item.price * item.quantity).toFixed(2)}`
    ]);

    doc.autoTable({
      startY: 60,
      head: [['Product', 'Qty', 'Price', 'Total']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [34, 139, 34] },
    });

    // Add totals
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text(`Subtotal: PKR ${invoiceData.sale.totalAmount.toFixed(2)}`, 160, finalY, null, null, 'right');
    doc.text(`Discount: PKR ${invoiceData.sale.discount.toFixed(2)}`, 160, finalY + 5, null, null, 'right');
    doc.text(`Total: PKR ${(invoiceData.sale.totalAmount - invoiceData.sale.discount).toFixed(2)}`, 160, finalY + 10, null, null, 'right');

    // Save the PDF
    doc.save(`invoice-${invoiceData.sale.id}.pdf`);
  };

  if (!invoiceData) return null;

  return (
    <div className="mt-8">
      <div className="flex justify-end space-x-4 mb-4">
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Print Invoice
        </button>
        <button
          onClick={handleDownloadPDF}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Download PDF
        </button>
      </div>

      <div ref={componentRef} className="bg-white p-8 rounded shadow">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Almadina Agro Vehari</h1>
          <p className="text-lg">Agricultural Products Supplier</p>
          <p className="text-gray-600">Vehari, Punjab, Pakistan</p>
        </div>

        <div className="flex justify-between mb-8">
          <div>
            <h2 className="text-xl font-semibold">Invoice To:</h2>
            <p>{invoiceData.sale.customer.name}</p>
            <p>{invoiceData.sale.customer.contact}</p>
            <p>{invoiceData.sale.customer.address}</p>
          </div>

          <div className="text-right">
            <p><strong>Invoice #:</strong> {invoiceData.sale.id}</p>
            <p><strong>Date:</strong> {new Date(invoiceData.sale.date).toLocaleDateString()}</p>
            <p><strong>Payment Method:</strong> {invoiceData.sale.paymentMethod}</p>
            <p><strong>Status:</strong> {invoiceData.sale.paymentStatus}</p>
          </div>
        </div>

        <table className="w-full border-collapse mb-8">
          <thead>
            <tr className="bg-green-100">
              <th className="border p-2 text-left">Product</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.products.map((item, index) => (
              <tr key={index}>
                <td className="border p-2">{item.name}</td>
                <td className="border p-2 text-center">{item.quantity}</td>
                <td className="border p-2 text-right">PKR {item.price.toFixed(2)}</td>
                <td className="border p-2 text-right">PKR {(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" className="border p-2 text-right font-semibold">Subtotal</td>
              <td className="border p-2 text-right">PKR {invoiceData.sale.totalAmount.toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan="3" className="border p-2 text-right font-semibold">Discount</td>
              <td className="border p-2 text-right">PKR {invoiceData.sale.discount.toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan="3" className="border p-2 text-right font-semibold">Total</td>
              <td className="border p-2 text-right font-semibold">
                PKR {(invoiceData.sale.totalAmount - invoiceData.sale.discount).toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>

        <div className="mt-8 text-center text-gray-500">
          <p>Thank you for your business!</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;