import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { User } from '@/types/user';

export const exportToPDF = (users: User[]) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text('Users Report', 14, 15);
  doc.setFontSize(11);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 25);

  // Prepare the data for the table
  const tableData = users.map(user => [
    user.fullName || 'N/A',
    user.email,
    user.userType,
    user.university || 'N/A',
    user.telephone || 'N/A'
  ]);

  // Add the table
  autoTable(doc, {
    head: [['Name', 'Email', 'User Type', 'University', 'Contact']],
    body: tableData,
    startY: 35,
    styles: {
      fontSize: 9,
      cellPadding: 3
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255
    }
  });

  // Save the PDF
  doc.save('users-report.pdf');
};

export const exportToCSV = (users: User[]) => {
  if (!users?.length) return;

  const headers = ["Full Name", "Email", "User Type", "University", "Phone", "Address"];
  const csvData = users.map(user => [
    user.fullName || "",
    user.email || "",
    user.userType || "",
    user.university || "",
    user.telephone || "",
    user.address || ""
  ]);

  const csvContent = [
    headers.join(","),
    ...csvData.map(row => row.join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "users.csv";
  a.click();
  window.URL.revokeObjectURL(url);
};