import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Pencil, X } from "lucide-react";

export default function DriverLoginAdmin() {
  const [drivers, setDrivers] = useState([]);
  const [form, setForm] = useState({ username: "", password: "" });
  const [editingDriver, setEditingDriver] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  // Load drivers from localStorage
  useEffect(() => {
    const storedDrivers = JSON.parse(localStorage.getItem("driverLogins")) || [];
    setDrivers(storedDrivers);
  }, []);

  // Save to localStorage
  const saveDrivers = (updated) => {
    setDrivers(updated);
    localStorage.setItem("driverLogins", JSON.stringify(updated));
  };

  // Handle new driver creation
  const handleCreate = (e) => {
    e.preventDefault();
    if (!form.username || !form.password) return alert("Please fill all fields");

    const exists = drivers.some(d => d.username === form.username);
    if (exists) return alert("Username already exists");

    const updated = [...drivers, { username: form.username, password: form.password }];
    saveDrivers(updated);
    setForm({ username: "", password: "" });
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!newPassword) return alert("Please enter a new password");

    const updated = drivers.map(d =>
      d.username === editingDriver.username
        ? { ...d, password: newPassword }
        : d
    );

    saveDrivers(updated);
    setEditingDriver(null);
    setNewPassword("");
  };

  const handleDelete = (index) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this exising driver?");
    if (!confirmDelete) return;
  
    const updatedDriver = drivers.filter((_, i) => i !== index);
    setDrivers(updatedDriver);
    localStorage.setItem("driverLogins", JSON.stringify(updatedDriver));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Driver Login Management</h1>

      {/* Create New Driver Login */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <h2 className="font-semibold text-lg mb-4">Create Driver Login</h2>
          <form onSubmit={handleCreate} className="grid gap-3 max-w-md">
            <Input
              placeholder="Driver Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
            <Input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <div>
            <button type="submit" className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none bg-blue-600 text-white hover:bg-blue-700">
              Create Login
            </button></div>
          </form>
        </CardContent>
      </Card>

      {/* Existing Drivers List */}
      <Card>
        <CardContent className="p-4">
          <h2 className="font-semibold text-lg mb-4">Existing Driver Accounts</h2>
          {drivers.length === 0 ? (
            <p className="text-gray-500">No drivers found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border">Username</th>
                    <th className="px-4 py-2 border">Password</th>
                    <th className="px-4 py-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.map((driver, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border">{driver.username}</td>
                      <td className="px-4 py-2 border">{driver.password}</td>
                      <td className="px-4 py-2 border text-center">
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-green-500 text-white hover:bg-green-600"
                          onClick={() => setEditingDriver(driver)}
                        >
                          <Pencil size={16} className="mr-1" /> Change Password
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-red-500 text-white hover:bg-red-600"
                          onClick={() => handleDelete(idx)}
                        >
                          <X size={16} className="mr-1" /> Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Password Change Modal */}
      {editingDriver && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-semibold mb-3">
              Change Password for {editingDriver.username}
            </h3>
            <form onSubmit={handlePasswordChange} className="grid gap-3">
              <Input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingDriver(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-green-500 hover:bg-green-600">
                  Update
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
