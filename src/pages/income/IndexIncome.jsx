import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { BsInfoCircle } from "react-icons/bs";
import { MdOutlineAddBox, MdOutlineDelete } from "react-icons/md";
import Spinner from "../../components/Spinner";
import Dashboard from "../../components/Dashboard";
import DeleteIncome from "./DeleteIncome";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useAuth } from "../../hooks/useAuth.js";

const IndexIncome = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [incomes, setIncomes] = useState([]);
  const [filteredIncomes, setFilteredIncomes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isFiltered, setIsFiltered] = useState(false);

  const fetchIncomes = () => {
    if (!user?.id) return;
    setLoading(true);
    axios
      .get("http://localhost:5559/income")
      .then((res) => {
        const all = res.data.data || res.data;
        const own = all.filter((inc) => inc.userID === user.id);
        setIncomes(own);
        setFilteredIncomes(own);
      })
      .catch((err) => console.error("Error fetching incomes:", err))
      .finally(() => setLoading(false));
  };

  // re-run fetch whenever user or URL changes (i.e. after create)
  useEffect(fetchIncomes, [user, location.pathname]);

  const handleDelete = (id) => {
    const updated = incomes.filter((i) => i._id !== id);
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
    const f = incomes.filter((inc) => {
      const d = new Date(inc.date);
      return (
        (!startDate || d >= new Date(startDate)) &&
        (!endDate   || d <= new Date(endDate))
      );
    });
    setFilteredIncomes(f);
    setIsFiltered(true);
  };

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    setFilteredIncomes(incomes);
    setIsFiltered(false);
  };

  const getCategoryTotals = () =>
    filteredIncomes.reduce((acc, inc) => {
      const c = inc.incomeType || "Uncategorized";
      acc[c] = (acc[c] || 0) + Number(inc.amount || 0);
      return acc;
    }, {});

  const getTotalIncome = () =>
    filteredIncomes.reduce((sum, inc) => sum + Number(inc.amount || 0), 0);

  // ... generatePDF & generateCSV as before ...

  return (
    <Dashboard>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">
          {user ? `Welcome, ${user.firstName}` : "Income List"}
        </h1>
        <div className="flex flex-wrap gap-2 mb-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <button onClick={handleFilter} className="bg-blue-600 text-white px-4 py-2 rounded">
            Filter
          </button>
          {(startDate || endDate) && (
            <button
              onClick={handleClearFilter}
              className="bg-gray-300 text-black px-4 py-2 rounded"
            >
              Clear
            </button>
          )}
          {isFiltered && (
            <>
              <button
                onClick={generateCSV}
                className="bg-purple-600 text-white px-4 py-2 rounded"
              >
                CSV
              </button>
              <button
                onClick={generatePDF}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                PDF
              </button>
            </>
          )}
          <Link
            to="/income/create"
            className="bg-green-600 text-white px-4 py-2 rounded flex items-center"
          >
            <MdOutlineAddBox className="mr-2" />
            Add Income
          </Link>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : filteredIncomes.length === 0 ? (
        <div className="bg-white shadow rounded p-6 text-center text-gray-500">
          No records for your account.
        </div>
      ) : (
        <>
          {/* Income Table */}
          <div className="bg-white shadow rounded p-6 mb-10">
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
                {filteredIncomes.map((inc, i) => (
                  <tr key={inc._id} className="border-b">
                    <td className="p-3">{i + 1}</td>
                    <td className="p-3">{inc.incomeName}</td>
                    <td className="p-3">{inc.incomeType}</td>
                    <td className="p-3">Rs.{inc.amount}</td>
                    <td className="p-3">
                      {new Date(inc.date).toISOString().split("T")[0]}
                    </td>
                    <td className="p-3 flex gap-2">
                      <Link
                        to={`/income/detail/${inc._id}`}
                        className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded"
                      >
                        <BsInfoCircle />
                      </Link>
                      <Link
                        to={`/income/edit/${inc._id}`}
                        className="bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-3 rounded"
                      >
                        <AiOutlineEdit />
                      </Link>
                      <button
                        onClick={() => setSelectedIncome(inc)}
                        className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded"
                      >
                        <MdOutlineDelete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Table */}
          {isFiltered && (
            <div className="bg-white shadow rounded p-6">
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
