"use client";
import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { ref, onValue, push, set, update, remove } from "firebase/database";
import { 
  LayoutDashboard, Package, ShoppingCart, Users, 
  TrendingUp, AlertTriangle, Search, Plus, 
  FileText, Trash2, CheckCircle, Menu, X 
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

export default function AdminDashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [pass, setPass] = useState("");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Form States
  const [pName, setPName] = useState("");
  const [pCategory, setPCategory] = useState("Cereals");
  const [pPrice, setPPrice] = useState("");
  const [pSalePrice, setPSalePrice] = useState("");
  const [pUnit, setPUnit] = useState("1kg");
  const [pImage, setPImage] = useState("");
  const [pStock, setPStock] = useState("In Stock");

  const verifyAdmin = () => {
    if (pass === "Ankur@123") setIsAuthorized(true);
    else alert("Wrong Password! ❌");
  };

  useEffect(() => {
    if (isAuthorized) {
      onValue(ref(db, 'orders'), (snapshot) => {
        const data = snapshot.val();
        if (data) setOrders(Object.keys(data).map(key => ({ id: key, ...data[key] })).reverse());
      });
      onValue(ref(db, 'products'), (snapshot) => {
        const data = snapshot.val();
        if (data) setProducts(Object.keys(data).map(key => ({ id: key, ...data[key] })));
      });
    }
  }, [isAuthorized]);

  const addProduct = (e) => {
    e.preventDefault();
    const newProductRef = push(ref(db, 'products'));
    set(newProductRef, {
      name: pName,
      category: pCategory,
      price: pPrice,
      salePrice: pSalePrice || pPrice,
      unit: pUnit,
      image: pImage || "https://via.placeholder.com/150",
      stockStatus: pStock,
      createdAt: new Date().toISOString()
    }).then(() => {
      alert("Product Added Successfully! ✅");
      setPName(""); setPPrice(""); setPSalePrice(""); setPImage("");
    });
  };

  // Analytics Data
  const chartData = [
    { name: 'Pending', count: orders.filter(o => o.status === 'Pending').length },
    { name: 'Shipped', count: orders.filter(o => o.status === 'Shipped').length },
    { name: 'Delivered', count: orders.filter(o => o.status === 'Confirmed').length },
  ];

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-green-50">
        <div className="p-10 bg-white rounded-2xl shadow-xl text-center w-96 border border-green-100">
          <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <LayoutDashboard className="text-white" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">CATALYST Admin</h2>
          <p className="text-gray-500 mb-6">Enter password to manage Cerealswale</p>
          <input 
            type="password" 
            placeholder="Enter Admin Password" 
            className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-green-500 outline-none"
            onChange={(e) => setPass(e.target.value)} 
          />
          <button 
            onClick={verifyAdmin} 
            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
          >
            Login to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-green-900 text-white transition-all duration-300 p-5 sticky top-0 h-screen`}>
        <div className="flex items-center gap-3 mb-10 overflow-hidden">
          <div className="bg-white p-2 rounded-lg"><Package className="text-green-900" size={24}/></div>
          <h1 className={`font-bold text-xl ${!sidebarOpen && 'hidden'}`}>Cerealswale</h1>
        </div>
        
        <nav className="space-y-4">
          <div className="flex items-center gap-4 p-3 bg-green-800 rounded-lg cursor-pointer">
            <LayoutDashboard size={20} /> <span className={!sidebarOpen ? 'hidden' : ''}>Dashboard</span>
          </div>
          <div className="flex items-center gap-4 p-3 hover:bg-green-800 rounded-lg cursor-pointer">
            <Package size={20} /> <span className={!sidebarOpen ? 'hidden' : ''}>Inventory</span>
          </div>
          <div className="flex items-center gap-4 p-3 hover:bg-green-800 rounded-lg cursor-pointer">
            <ShoppingCart size={20} /> <span className={!sidebarOpen ? 'hidden' : ''}>Orders</span>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-x-hidden">
        <header className="flex justify-between items-center mb-8">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 bg-white rounded-lg shadow-sm">
            {sidebarOpen ? <X size={20}/> : <Menu size={20}/>}
          </button>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search orders..." 
                className="pl-10 pr-4 py-2 bg-white rounded-lg border-none shadow-sm focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </header>

        {/* 1. Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={<TrendingUp className="text-green-600"/>} title="Total Revenue" value={`₹${orders.reduce((a,b)=>a+(parseInt(b.price)||0),0)}`} color="bg-green-100" />
          <StatCard icon={<ShoppingCart className="text-blue-600"/>} title="Pending Orders" value={orders.filter(o=>o.status==="Pending").length} color="bg-blue-100" />
          <StatCard icon={<Users className="text-purple-600"/>} title="Active Merchants" value="12" color="bg-purple-100" />
          <StatCard icon={<AlertTriangle className="text-red-600"/>} title="Low Stock" value="3 Items" color="bg-red-100" />
        </div>

        {/* 2. Charts & Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Order Graph */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-700 mb-6">Order Delivery Status</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1b5e20" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Add Product Form */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2"><Plus size={18}/> Add New Product</h3>
            <form onSubmit={addProduct} className="space-y-4">
              <input type="text" placeholder="Product Name" className="w-full p-2 border rounded-md text-sm" value={pName} onChange={(e)=>setPName(e.target.value)} required />
              <select className="w-full p-2 border rounded-md text-sm" value={pCategory} onChange={(e)=>setPCategory(e.target.value)}>
                <option>Cereals</option><option>Pulses</option><option>Spices</option>
              </select>
              <div className="flex gap-2">
                <input type="number" placeholder="MRP" className="w-1/2 p-2 border rounded-md text-sm" value={pPrice} onChange={(e)=>setPPrice(e.target.value)} required />
                <input type="number" placeholder="Sale Price" className="w-1/2 p-2 border rounded-md text-sm" value={pSalePrice} onChange={(e)=>setPSalePrice(e.target.value)} />
              </div>
              <select className="w-full p-2 border rounded-md text-sm" value={pUnit} onChange={(e)=>setPUnit(e.target.value)}>
                <option value="500gm">500gm</option><option value="1kg">1kg</option><option value="5kg">5kg</option><option value="1pc">1pc</option>
              </select>
              <input type="text" placeholder="Image URL" className="w-full p-2 border rounded-md text-sm" value={pImage} onChange={(e)=>setPImage(e.target.value)} />
              <button className="w-full bg-green-600 text-white py-2 rounded-md font-bold hover:bg-green-700 transition">Save Product</button>
            </form>
          </div>
        </div>

        {/* 3. Orders Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-bottom flex justify-between items-center">
            <h3 className="font-bold text-gray-700">Recent Orders & Invoices</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-4">Customer</th>
                  <th className="p-4">Product</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-medium">{o.customerName}</td>
                    <td className="p-4 text-gray-600">{o.productName}</td>
                    <td className="p-4 font-bold text-green-700">₹{o.price}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${o.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {o.status === 'Confirmed' ? 'PAID' : 'PENDING'}
                      </span>
                    </td>
                    <td className="p-4">
                      <button className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold text-sm">
                        <FileText size={16}/> PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component for Stats Cards
function StatCard({ icon, title, value, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`${color} p-4 rounded-xl`}>{icon}</div>
      <div>
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        <h4 className="text-xl font-bold text-gray-800">{value}</h4>
      </div>
    </div>
  );
}
