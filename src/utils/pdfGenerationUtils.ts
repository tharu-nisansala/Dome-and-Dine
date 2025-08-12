import jsPDF from 'jspdf';
import { BoardingPlace } from '@/types/boardingPlaceTypes';
import { OrderDetails, PaymentDetails } from '@/types/order';

interface GeneratePDFParams {
  boardingPlace: BoardingPlace;
  paymentDetails: PaymentDetails;
  orderDetails: Partial<OrderDetails>;
}

export const generateBoardingPDF = ({
  boardingPlace,
  paymentDetails,
  orderDetails
}: GeneratePDFParams): jsPDF => {
  const doc = new jsPDF();
  
  // Add header
  doc.setFontSize(20);
  doc.text('Boarding Receipt', 105, 20, { align: 'center' });
  
  // Add boarding details
  doc.setFontSize(12);
  doc.text(`Room: ${boardingPlace.name}`, 20, 40);
  doc.text(`Location: ${boardingPlace.location}`, 20, 50);
  doc.text(`Price: Rs. ${boardingPlace.price}`, 20, 60);
  
  // Add payment details
  doc.text('Payment Details:', 20, 80);
  doc.text(`Transaction ID: ${paymentDetails.transactionId}`, 30, 90);
  doc.text(`Amount: Rs. ${paymentDetails.amount.toFixed(2)}`, 30, 100);
  doc.text(`Payment Type: ${paymentDetails.type}`, 30, 110);
  doc.text(`Payment Method: ${paymentDetails.method}`, 30, 120);
  
  // Add customer details
  doc.text('Customer Details:', 20, 140);
  doc.text(`Name: ${paymentDetails.customerName}`, 30, 150);
  doc.text(`Email: ${paymentDetails.customerEmail}`, 30, 160);
  
  return doc;
};