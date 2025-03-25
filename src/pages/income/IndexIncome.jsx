import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { BsInfoCircle } from "react-icons/bs";
import { MdOutlineAddBox, MdOutlineDelete } from "react-icons/md";
import Spinner from "../../components/Spinner";
import Dashboard from "../../components/Dashboard";
import DeleteIncome from "./DeleteIncome";
import jsPDF from "jspdf";
import "jspdf-autotable";

const IndexIncome = () => {
  const [incomes, setIncomes] = useState([]);
  const [filteredIncomes, setFilteredIncomes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isFiltered, setIsFiltered] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:5559/income")
      .then(response => {
        const data = response.data.data || response.data;
        setIncomes(data);
        setFilteredIncomes(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching incomes:", error);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    const updated = incomes.filter(income => income._id !== id);
    setIncomes(updated);
    setFilteredIncomes(updated);
    setSelectedIncome(null);
  };

  const handleFilter = () => {
    if (!startDate && !endDate) {
      setFilteredIncomes(incomes);
      setIsFiltered(false);
      return;
    }

    const filtered = incomes.filter(income => {
      const date = new Date(income.date);
      const afterStart = startDate ? date >= new Date(startDate) : true;
      const beforeEnd = endDate ? date <= new Date(endDate) : true;
      return afterStart && beforeEnd;
    });

    setFilteredIncomes(filtered);
    setIsFiltered(true);
  };

  const handleClearFilter = () => {
    setStartDate('');
    setEndDate('');
    setFilteredIncomes(incomes);
    setIsFiltered(false);
  };

  const getCategoryTotals = () => {
    const totals = {};
    filteredIncomes.forEach(income => {
      const cat = income.incomeType || 'Uncategorized';
      const amt = Number(income.amount) || 0;
      totals[cat] = (totals[cat] || 0) + amt;
    });
    return totals;
  };

  const getTotalIncome = () => {
    return filteredIncomes.reduce((sum, income) => sum + (Number(income.amount) || 0), 0);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Income Report", 14, 22);
    doc.setFontSize(12);
    doc.text(`Date Range: ${startDate} to ${endDate}`, 14, 30);

    const rows = filteredIncomes.map((inc, i) => [
      i + 1,
      inc.incomeName,
      inc.incomeType,
      inc.amount,
      new Date(inc.date).toISOString().split('T')[0]
    ]);

    doc.autoTable({ head: [["No", "Name", "Type", "Amount", "Date"]], body: rows, startY: 40 });

    const summaryY = doc.previousAutoTable.finalY + 10;
    const summary = Object.entries(getCategoryTotals()).map(([cat, amt]) => [
      cat, `Rs. ${amt.toFixed(2)}`
    ]);
    summary.push(["Total Income", `Rs. ${getTotalIncome().toFixed(2)}`]);

    doc.setFontSize(14);
    doc.text("Summary Table", 14, summaryY);
    doc.autoTable({
      head: [["Income Type", "Total Amount"]],
      body: summary,
      startY: summaryY + 5,
    });

    doc.save(`Income_Report_${startDate}_to_${endDate}.pdf`);
  };

  const generateCSV = () => {
    let csv = "No,Name,Type,Amount,Date\n";
    csv += filteredIncomes.map((inc, i) =>
      `${i + 1},${inc.incomeName},${inc.incomeType},${inc.amount},${new Date(inc.date).toISOString().split("T")[0]}`
    ).join("\n");

    csv += "\n\nSummary Table\nIncome Type,Total Amount\n";
    Object.entries(getCategoryTotals()).forEach(([cat, amt]) => {
      csv += `${cat},Rs. ${amt.toFixed(2)}\n`;
    });
    csv += `Total Income,Rs. ${getTotalIncome().toFixed(2)}\n`;

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Income_Report_${startDate}_to_${endDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dashboard>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Income List</h1>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 flex-wrap">
        <div className="flex flex-wrap gap-2">
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border rounded px-3 py-2" />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border rounded px-3 py-2" />
          <button onClick={handleFilter} className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded">Filter</button>
          {(startDate || endDate) && (
            <button onClick={handleClearFilter} className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded">Clear</button>
          )}
          {isFiltered && (
            <>
              <button onClick={generateCSV} className="bg-purple-600 hover:bg-purple-800 text-white px-4 py-2 rounded">Generate CSV</button>
              <button onClick={generatePDF} className="bg-red-600 hover:bg-red-800 text-white px-4 py-2 rounded">Generate PDF</button>
            </>
          )}
        </div>
      

      
        <Link to="/income/create" className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded flex items-center">
          <MdOutlineAddBox className="mr-2" />
          Add Income
        </Link>
      </div>
    </div>

      {loading ? (
        <Spinner />
      ) : filteredIncomes.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <p className="text-center text-gray-500">No incomes found for selected date range.</p>
        </div>
      ) : (
        <>
          {/* 🔹 Income Table Section */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-10">
            <h2 className="text-xl font-semibold mb-4">Income Table</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3 text-left">No</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredIncomes.map((income, i) => (
                  <tr key={income._id} className="border-b">
                    <td className="p-3">{i + 1}</td>
                    <td className="p-3">{income.incomeName}</td>
                    <td className="p-3">{income.incomeType}</td>
                    <td className="p-3">Rs.{income.amount}</td>
                    <td className="p-3">{new Date(income.date).toISOString().split("T")[0]}</td>
                    <td className="p-3 flex gap-2">
                      <Link to={`/income/detail/${income._id}`} className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded"><BsInfoCircle /></Link>
                      <Link to={`/income/edit/${income._id}`} className="bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-3 rounded"><AiOutlineEdit /></Link>
                      <button onClick={() => setSelectedIncome(income)} className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded"><MdOutlineDelete /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 🔸 Summary Table Section */}
          {isFiltered && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Summary Table</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left">Income Type</th>
                  <th className="p-3 text-left">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(getCategoryTotals()).map(([type, amt]) => (
                  <tr key={type} className="border-b">
                    <td className="p-3">{type}</td>
                    <td className="p-3">Rs. {amt.toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="font-bold bg-gray-200">
                  <td className="p-3">Total Income</td>
                  <td className="p-3">Rs. {getTotalIncome().toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
            )}
        </>
      )}

      {selectedIncome && (
        <DeleteIncome
          income={selectedIncome}
          onClose={() => setSelectedIncome(null)}
          onDelete={handleDelete}
        />
      )}
    </Dashboard>
  );
};

export default IndexIncome;
