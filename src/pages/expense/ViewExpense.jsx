import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Dashboard from '../../components/Dashboard';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ViewExpense = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const response = await axios.get(`http://localhost:5559/expense/${id}`);
        setExpense(response.data);
      } catch (error) {
        console.error("Error fetching expense:", error);
        setError("Failed to fetch expense details.");
      } finally {
        setLoading(false);
      }
    };
    fetchExpense();
  }, [id]);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Expense Detail Report", 14, 22);

    doc.autoTable({
      head: [["Field", "Value"]],
      body: [
        ["Expense ID", expense.expenseID],
        ["Name", expense.expenseName],
        ["Category", expense.expenseCategory],
        ["Amount", `Rs. ${expense.expenseAmount}`],
        ["Date", new Date(expense.date).toISOString().split('T')[0]],
      ],
      startY: 30,
    });

    doc.save(`Expense_${expense.expenseID || id}.pdf`);
  };

  const generateCSV = () => {
    const csvContent = [
      "Field,Value",
      `Expense ID,${expense.expenseID}`,
      `Name,${expense.expenseName}`,
      `Category,${expense.expenseCategory}`,
      `Amount,Rs. ${expense.expenseAmount}`,
      `Date,${new Date(expense.date).toISOString().split('T')[0]}`,
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Expense_${expense.expenseID || id}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dashboard>
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gradient-to-br">
        <div className="bg-white/90 p-8 rounded-2xl shadow-2xl w-[35rem] backdrop-blur-lg border border-gray-300">
          <h2 className="text-4xl font-extrabold text-center mb-6 text-gray-900 tracking-wide">
            Expense Details
          </h2>

          {loading ? (
            <p className="text-center text-gray-600 animate-pulse">Loading...</p>
          ) : error ? (
            <p className="text-red-500 text-center font-medium">{error}</p>
          ) : (
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-gray-50 shadow-md">
                <p className="text-lg">
                  <strong className="text-gray-700">Expense ID:</strong> {expense.expenseID}
                </p>
                <p className="text-lg">
                  <strong className="text-gray-700">Expense Name:</strong> {expense.expenseName}
                </p>
                <p className="text-lg">
                  <strong className="text-gray-700">Expense Category:</strong> {expense.expenseCategory}
                </p>
                <p className="text-lg">
                  <strong className="text-gray-700">Expense Amount:</strong> Rs. {expense.expenseAmount}
                </p>
                <p className="text-lg">
                  <strong className="text-gray-700">Expense Date:</strong> {new Date(expense.date).toISOString().split('T')[0]}
                </p>
              </div>

              {/* Report Generation Buttons */}
              <div className="flex justify-center gap-4 mt-6">
                <button
                  className="bg-purple-600 hover:bg-purple-800 text-white py-2 px-4 rounded-lg font-medium shadow"
                  onClick={generateCSV}
                >
                  Generate CSV
                </button>
                <button
                  className="bg-red-600 hover:bg-red-800 text-white py-2 px-4 rounded-lg font-medium shadow"
                  onClick={generatePDF}
                >
                  Generate PDF
                </button>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-6 rounded-lg font-semibold shadow-md transition-all"
                  onClick={() => navigate(-1)}
                >
                  Back
                </button>
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-6 rounded-lg font-semibold shadow-md transition-all"
                  onClick={() => navigate(`/expense/edit/${id}`)}
                >
                  Edit Expense
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Dashboard>
  );
};

export default ViewExpense;
