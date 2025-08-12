import jsPDF from 'jspdf';
import { OrderDetails } from '@/types/order';
import { formatCurrency } from './orderUtils';

export const generatePDF = (orderDetails: OrderDetails) => {
  const doc = new jsPDF();
  
  // Add logo
  doc.addImage("/lovable-uploads/bac56020-df80-4dae-9ae2-239f2a0d0894.png", "PNG", 85, 10, 40, 40);
  
  // Add header
  doc.setFontSize(20);
  doc.text('Food Circle', 105, 60, { align: 'center' });
  
  doc.setFontSize(10);
  doc.text('Your Trusted Food Delivery Partner', 105, 67, { align: 'center' });
  doc.text('123 University Road, Colombo', 105, 72, { align: 'center' });
  doc.text('Tel: +94 11 234 5678 | Email: support@foodcircle.lk', 105, 77, { align: 'center' });
  
  // Add order information
  doc.setFontSize(12);
  doc.text(`Order Number: ${orderDetails.orderNumber}`, 20, 90);
  doc.text(`Date: ${orderDetails.orderDate.toLocaleString()}`, 20, 97);
  doc.text(`Customer: ${orderDetails.customerName}`, 20, 104);
  
  // Add items table
  const tableData = orderDetails.items.map(item => [
    item.name,
    item.quantity.toString(),
    formatCurrency(item.price),
    formatCurrency(item.price * item.quantity)
  ]);
  
  (doc as any).autoTable({
    startY: 120,
    head: [['Item', 'Quantity', 'Price', 'Total']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [155, 135, 245] },
    styles: { fontSize: 10 }
  });
  
  const finalY = (doc as any).lastAutoTable.finalY || 130;
  
  // Add order summary
  doc.text(`Order Type: ${orderDetails.orderType}`, 20, finalY + 20);
  doc.text(`Payment Method: ${orderDetails.paymentMethod}`, 20, finalY + 27);
  if (orderDetails.deliveryFee > 0) {
    doc.text(`Delivery Fee: ${formatCurrency(orderDetails.deliveryFee)}`, 20, finalY + 34);
  }
  doc.setFont('helvetica', 'bold');
  doc.text(`Total Amount: ${formatCurrency(orderDetails.totalAmount)}`, 20, finalY + 41);
  
  // Add footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Thank you for choosing Food Circle!', 105, 280, { align: 'center' });
  
  return doc;
};