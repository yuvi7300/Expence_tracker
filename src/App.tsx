import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, DollarSign, Calendar, Tag, ArrowDownUp, Edit2, Eye, CreditCard, IndianRupee } from 'lucide-react';

// Define types for our expense data
type Expense = {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  paymentMethod: string; // Added payment method field
};

// Categories for expenses
const categories = [
  'Food & Dining',
  'Transportation',
  'Entertainment',
  'Utilities',
  'Shopping',
  'Healthcare',
  'Education',
  'Travel',
  'Other'
];

// Payment methods
const paymentMethods = ['Credit', 'Debit', 'Cash'];

function App() {
  // State for expenses and form inputs
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const savedExpenses = localStorage.getItem('expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0]); // Added payment method state
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAllExpenses, setShowAllExpenses] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(5);



  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount) return;
    
    const expenseData = {
      id: editingId || Date.now().toString(),
      description,
      amount: parseFloat(amount),
      category,
      date,
      paymentMethod // Include payment method in the expense data
    };
    
    if (editingId) {
      setExpenses(expenses.map(exp => exp.id === editingId ? expenseData : exp));
      setEditingId(null);
    } else {
      setExpenses([...expenses, expenseData]);
    }
    
    // Reset form
    setDescription('');
    setAmount('');
    setCategory(categories[0]);
    setDate(new Date().toISOString().split('T')[0]);
    setPaymentMethod(paymentMethods[0]);
  };

  // Start editing an expense
  const startEditing = (expense: Expense) => {
    setEditingId(expense.id);
    setDescription(expense.description);
    setAmount(expense.amount.toString());
    setCategory(expense.category);
    setDate(expense.date);
    setPaymentMethod(expense.paymentMethod || paymentMethods[0]); // Handle existing expenses that might not have payment method
  };

  // Delete an expense
  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  // Filter and sort expenses
  const filteredExpenses = expenses
    .filter(expense => 
      expense.description.toLowerCase().includes(filter.toLowerCase()) ||
      expense.category.toLowerCase().includes(filter.toLowerCase()) ||
      (expense.paymentMethod && expense.paymentMethod.toLowerCase().includes(filter.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === 'amount') {
        return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      } else {
        return sortOrder === 'asc' 
          ? a.description.localeCompare(b.description)
          : b.description.localeCompare(a.description);
      }
    });

  // Toggle sort order
  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const displayedExpenses = showAllExpenses 
    ? filteredExpenses 
    : filteredExpenses.slice(0, itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-indigo-700">Expense Tracker</h1>
        
        
        {/* Add Expense Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {editingId ? 'Edit Expense' : 'Add New Expense'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="What did you spend on?"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Amount(₹)
                </label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              
              {/* New Payment Method dropdown */}
              <div>
                <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  id="paymentMethod"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {paymentMethods.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <button
              type="submit"
              className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300 flex items-center justify-center"
            >
              <PlusCircle className="mr-2" size={20} />
              {editingId ? 'Update Expense' : 'Add Expense'}
            </button>
          </form>
        </div>
        
        {/* Expense List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Expense History</h2>
            <div className="flex gap-4">
              <button
                onClick={() => setShowAllExpenses(!showAllExpenses)}
                className="flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition duration-300"
              >
                <Eye className="mr-2" size={18} />
                {showAllExpenses ? 'Show Less' : 'Show All'}
              </button>
              <div className="relative">
                <input
                  type="text"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="p-2 pl-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Search expenses..."
                />
                <span className="absolute left-2 top-2.5 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
          
          {displayedExpenses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 cursor-pointer" onClick={() => toggleSort('date')}>
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-1" />
                        Date
                        <ArrowDownUp size={14} className="ml-1" />
                      </div>
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 cursor-pointer" onClick={() => toggleSort('description')}>
                      <div className="flex items-center">
                        Description
                        <ArrowDownUp size={14} className="ml-1" />
                      </div>
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      <div className="flex items-center">
                        <Tag size={16} className="mr-1" />
                        Category
                      </div>
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      <div className="flex items-center">
                        <CreditCard size={16} className="mr-1" />
                        Payment
                      </div>
                    </th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 cursor-pointer" onClick={() => toggleSort('amount')}>
                      <div className="flex items-center justify-end">
                        <IndianRupee size={16} className="mr-1" />
                        Amount
                        <ArrowDownUp size={14} className="ml-1" />
                      </div>
                    </th>
                    <th className="px-4 py-2 text-center text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedExpenses.map((expense) => (
                    <tr key={expense.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-500">{new Date(expense.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{expense.description}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs">
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          {expense.paymentMethod || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-right text-gray-800">₹{expense.amount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => startEditing(expense)}
                            className="text-blue-500 hover:text-blue-700 transition duration-300"
                            aria-label="Edit expense"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => deleteExpense(expense.id)}
                            className="text-red-500 hover:text-red-700 transition duration-300"
                            aria-label="Delete expense"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No expenses found. Add your first expense above!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
