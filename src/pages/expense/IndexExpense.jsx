import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Spinner from '../../components/Spinner';
import Dashboard from '../../components/Dashboard';
import DeleteExpense from './DeleteExpense';

const IndexExpense = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isFiltered, setIsFiltered] = useState(false);

  useEffect(() => {
    setLoading(true);

    const fetchExpenses = axios.get('http://localhost:5559/expense');
    const fetchLiabilities = axios.get('http://localhost:5559/liability');

    Promise.all([fetchExpenses, fetchLiabilities])
      .then(([expenseResponse, liabilityResponse]) => {
        const expensesData = expenseResponse.data.data || expenseResponse.data;
        const liabilitiesData = liabilityResponse.data.data || liabilityResponse.data;

        const mappedLiabilities = liabilitiesData
          .filter(lia => lia.status === 'Paid')
          .map(lia => ({
            _id: lia._id,
            expenseName: lia.liabilityName,
            expenseCategory: lia.type,
            expenseAmount: lia.amount,
            date: lia.dueDate,
            isLiability: true,
          }));

        const combinedData = [...expensesData, ...mappedLiabilities];

        setExpenses(combinedData);
        setFilteredExpenses(combinedData);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    const updated = expenses.filter(exp => exp._id !== id);
    setExpenses(updated);
    setFilteredExpenses(updated);
    setSelectedExpense(null);
  };

  const handleFilter = () => {
    if (!startDate && !endDate) {
      setFilteredExpenses(expenses);
      setIsFiltered(false);
      return;
    }

    const filtered = expenses.filter(item => {
      const date = new Date(item.date);
      const afterStart = startDate ? date >= new Date(startDate) : true;
      const beforeEnd = endDate ? date <= new Date(endDate) : true;
      return afterStart && beforeEnd;
    });

    setFilteredExpenses(filtered);
    setIsFiltered(true);
  };

  const handleClearFilter = () => {
    setStartDate('');
    setEndDate('');
    setFilteredExpenses(expenses);
    setIsFiltered(false);
  };

  const getCategoryTotals = () => {
    const totals = {};

    filteredExpenses.forEach(item => {
      const category = item.expenseCategory || 'Uncategorized';
      const amount = Number(item.expenseAmount) || 0;

      if (totals[category]) {
        totals[category] += amount;
      } else {
        totals[category] = amount;
      }
    });

    return totals;
  };

  const getTotalExpense = () => {
    return filteredExpenses.reduce((sum, item) => {
      return sum + (Number(item.expenseAmount) || 0);
    }, 0);
  };

  const generateCSV = () => {
    let csv = "No,Name,Category,Amount,Date\n";
    csv += filteredExpenses.map((item, index) =>
      `${index + 1},"${item.expenseName}","${item.expenseCategory}",${item.expenseAmount},"${new Date(item.date).toLocaleDateString()}"`
    ).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Expense_Report_${startDate || 'All'}_to_${endDate || 'All'}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Expense Report", 14, 20);

    doc.setFontSize(12);
    doc.text(`Date Range: ${startDate || 'All'} to ${endDate || 'All'}`, 14, 30);

    const expenseRows = filteredExpenses.map((item, index) => [
      index + 1,
      item.expenseName,
      item.expenseCategory,
      item.expenseAmount,
      new Date(item.date).toLocaleDateString()
    ]);

    doc.autoTable({
      startY: 40,
      head: [["No", "Name", "Category", "Amount", "Date"]],
      body: expenseRows,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] },
    });

    const summaryRows = Object.entries(getCategoryTotals()).map(([category, amount]) => [
      category,
      `Rs. ${amount.toFixed(2)}`
    ]);

    summaryRows.push([
      "Total Expense",
      `Rs. ${getTotalExpense().toFixed(2)}`
    ]);

    const summaryY = doc.previousAutoTable.finalY + 10;

    doc.setFontSize(16);
    doc.text("Summary Table", 14, summaryY);

    doc.autoTable({
      startY: summaryY + 5,
      head: [["Category", "Total Amount"]],
      body: summaryRows,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] },
    });

    doc.save(`Expense_Report_${startDate || 'All'}_to_${endDate || 'All'}.pdf`);
  };

  return (
    <Dashboard>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Expense List</h1>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 flex-wrap">
          <div className="flex flex-wrap gap-2">
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border rounded px-3 py-2" />
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border rounded px-3 py-2" />
            <button onClick={handleFilter} className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded">
              Filter
            </button>

            {isFiltered && (
              <>
                <button onClick={handleClearFilter} className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded">
                  Clear
                </button>
                <button onClick={generateCSV} className="bg-purple-600 hover:bg-purple-800 text-white px-4 py-2 rounded">
                  Generate CSV
                </button>
                <button onClick={generatePDF} className="bg-red-600 hover:bg-red-800 text-white px-4 py-2 rounded">
                  Generate PDF
                </button>
              </>
            )}
          </div>

          <Link to="/expense/create" className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded flex items-center">
            <MdOutlineAddBox className="mr-2" />
            Add Expense
          </Link>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <>
          {/* Combined Table */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-10">
            <h2 className="text-xl font-semibold mb-4">Combined Table</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3 text-left">No</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.length > 0 ? (
                  filteredExpenses.map((item, i) => (
                    <tr key={item._id || i} className="border-b">
                      <td className="p-3">{i + 1}</td>
                      <td className="p-3">{item.expenseName}</td>
                      <td className="p-3">{item.expenseCategory}</td>
                      <td className="p-3">Rs. {item.expenseAmount}</td>
                      <td className="p-3">{new Date(item.date).toLocaleDateString()}</td>
                      <td className="p-3 flex gap-2">
                        {!item.isLiability && (
                          <>
                            <Link to={`/expense/detail/${item._id}`} className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded"><BsInfoCircle /></Link>
                            <Link to={`/expense/edit/${item._id}`} className="bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-3 rounded"><AiOutlineEdit /></Link>
                            <button onClick={() => setSelectedExpense(item)} className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded"><MdOutlineDelete /></button>
                          </>
                        )}
                        {item.isLiability && (
                          <Link
                            to={`/liabilities?liabilityId=${item._id}`}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 rounded"
                          >
                            View Location
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" className="p-3 text-center">No records found.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Summary Table */}
          {isFiltered && (
            <div className="bg-white shadow-md rounded-lg p-6 mt-8">
              <h2 className="text-xl font-semibold mb-4">Summary Table</h2>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-3 text-left">Category</th>
                    <th className="p-3 text-left">Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(getCategoryTotals()).map(([category, total], index) => (
                    <tr key={index} className="border-b">
                      <td className="p-3">{category}</td>
                      <td className="p-3">Rs. {total.toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="font-bold bg-gray-200">
                    <td className="p-3">Total Expense</td>
                    <td className="p-3">Rs. {getTotalExpense().toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {selectedExpense && (
        <DeleteExpense
          expense={selectedExpense}
          onClose={() => setSelectedExpense(null)}
          onDelete={handleDelete}
        />
      )}
    </Dashboard>
  );
};

export default IndexExpense;
