import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Spinner from '../../components/Spinner';
import Dashboard from '../../components/Dashboard';
import DeleteExpense from './DeleteExpense';
import { useAuth } from '../../hooks/useAuth.js';

const IndexExpense = () => {
  const { user } = useAuth();
  const location = useLocation();

  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isFiltered, setIsFiltered] = useState(false);

  const fetchData = () => {
    if (!user?.id) return;
    setLoading(true);
    const expReq = axios.get('http://localhost:5559/expense');
    const liaReq = axios.get('http://localhost:5559/liability');

    Promise.all([expReq, liaReq])
      .then(([expRes, liaRes]) => {
        const expData = expRes.data.data || expRes.data;
        const liaData = (liaRes.data.data || liaRes.data)
          .filter(l => l.status === 'Paid' && l.userID === user.id);

        // only this user's expenses + paid liabilities
        const ownExpenses = expData.filter(e => e.userID === user.id);
        const mappedLiabilities = liaData.map(lia => ({
          _id: lia._id,
          expenseName: lia.liabilityName,
          expenseCategory: lia.type,
          expenseAmount: lia.amount,
          date: lia.dueDate,
          isLiability: true,
        }));

        const combined = [...ownExpenses, ...mappedLiabilities];
        setExpenses(combined);
        setFilteredExpenses(combined);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(fetchData, [user, location.pathname]);

  const handleDelete = id => {
    const updated = expenses.filter(e => e._id !== id);
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
    const start = startDate ? new Date(startDate) : new Date(0);
    const end   = endDate   ? new Date(endDate)   : new Date(8640000000000000);
    start.setHours(0,0,0,0);
    end.setHours(23,59,59,999);

    const f = expenses.filter(item => {
      const d = new Date(item.date);
      return d >= start && d <= end;
    });
    setFilteredExpenses(f);
    setIsFiltered(true);
  };

  const handleClearFilter = () => {
    setStartDate('');
    setEndDate('');
    setFilteredExpenses(expenses);
    setIsFiltered(false);
  };

  const getCategoryTotals = () =>
    filteredExpenses.reduce((acc, item) => {
      const cat = item.expenseCategory || 'Uncategorized';
      acc[cat] = (acc[cat] || 0) + Number(item.expenseAmount || 0);
      return acc;
    }, {});

  const getTotalExpense = () =>
    filteredExpenses.reduce((sum, item) => sum + Number(item.expenseAmount || 0), 0);

  const generateCSV = () => {
    let csv = "No,Name,Category,Amount,Date\n";
    csv += filteredExpenses
      .map((it, i) =>
        `${i+1},"${it.expenseName}","${it.expenseCategory}",${it.expenseAmount},"${new Date(it.date).toLocaleDateString()}"`
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href        = url;
    link.download    = `Expense_Report_${startDate||'All'}_to_${endDate||'All'}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Expense Report", 14, 20);
    doc.setFontSize(12);
    doc.text(`Date Range: ${startDate||'All'} to ${endDate||'All'}`, 14, 30);

    const rows = filteredExpenses.map((it, i) => [
      i+1, it.expenseName, it.expenseCategory,
      it.expenseAmount, new Date(it.date).toLocaleDateString()
    ]);
    doc.autoTable({
      startY: 40,
      head: [["No","Name","Category","Amount","Date"]],
      body: rows,
      theme: 'striped',
      headStyles: { fillColor: [41,128,185] }
    });

    const summary = Object.entries(getCategoryTotals()).map(([cat, amt]) => [cat, `Rs. ${amt.toFixed(2)}`]);
    summary.push(["Total Expense", `Rs. ${getTotalExpense().toFixed(2)}`]);
    const y = doc.previousAutoTable.finalY + 10;
    doc.setFontSize(16);
    doc.text("Summary Table", 14, y);
    doc.autoTable({
      startY: y+5,
      head: [["Category","Total"]],
      body: summary,
      theme: 'striped',
      headStyles: { fillColor: [41,128,185] }
    });

    doc.save(`Expense_Report_${startDate||'All'}_to_${endDate||'All'}.pdf`);
  };

  return (
    <Dashboard>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Expense List</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <button onClick={handleFilter} className="bg-blue-600 text-white px-4 py-2 rounded">
            Filter
          </button>
          {isFiltered && (
            <>
              <button onClick={handleClearFilter} className="bg-gray-300 text-black px-4 py-2 rounded">
                Clear
              </button>
              <button onClick={generateCSV} className="bg-purple-600 text-white px-4 py-2 rounded">
                CSV
              </button>
              <button onClick={generatePDF} className="bg-red-600 text-white px-4 py-2 rounded">
                PDF
              </button>
            </>
          )}
          <Link
            to="/expense/create"
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"
          >
            <MdOutlineAddBox className="mr-2" /> Add Expense
          </Link>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="bg-white shadow rounded p-4">
          <div className="mb-2 text-gray-600">
            Showing {filteredExpenses.length} {filteredExpenses.length===1?'record':'records'}
          </div>
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
              {filteredExpenses.map((it, i) => (
                <tr key={it._id} className="border-b hover:bg-gray-100">
                  <td className="p-3">{i+1}</td>
                  <td className="p-3">{it.expenseName}</td>
                  <td className="p-3">{it.expenseCategory}</td>
                  <td className="p-3">Rs. {it.expenseAmount}</td>
                  <td className="p-3">{new Date(it.date).toLocaleDateString()}</td>
                  <td className="p-3 flex gap-2">
                    {!it.isLiability ? (
                      <>
                        <Link to={`/expense/detail/${it._id}`} className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded">
                          <BsInfoCircle />
                        </Link>
                        <Link to={`/expense/edit/${it._id}`} className="bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-3 rounded">
                          <AiOutlineEdit />
                        </Link>
                        <button onClick={() => setSelectedExpense(it)} className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded">
                          <MdOutlineDelete />
                        </button>
                      </>
                    ) : (
                      <Link
                        to={`/liabilities?liabilityId=${it._id}`}
                        className="bg-green-500 hover:bg-green-700 text-white py-1 px-4 rounded"
                      >
                        View Liability
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedExpense && (
        <DeleteExpense
          expense={selectedExpense}
          onClose={() => setSelectedExpense(null)}
          onDelete={() => {
            handleDelete(selectedExpense._id);
          }}
        />
      )}
    </Dashboard>
  );
};

export default IndexExpense;
