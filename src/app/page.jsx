"use client";
import React,{useState} from 'react';
import * as ReactGoogleMaps from "@/libraries/react-google-maps";

const NEXT_PUBLIC_GOOGLE_MAPS_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

function MainComponent() {
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [center, setCenter] = React.useState({ lat: 40.7128, lng: -74.006 });
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shipmentDetails, setShipmentDetails] = useState(null);
  const [formStatus, setFormStatus] = useState("");
  const searchRef = React.useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedTab, setSelectedTab] = useState("overview");
  const [editingOrder, setEditingOrder] = useState(null);
  const [products, setProducts] = useState([
    { id: 1, name: "Product A", stock: 150, price: 299 },
    { id: 2, name: "Product B", stock: 89, price: 199 },
    { id: 3, name: "Product C", stock: 234, price: 399 },
  ]);
  const [orders, setOrders] = useState([
    { id: 1, customer: "John Doe", status: "Delivered", total: 598 },
    { id: 2, customer: "Jane Smith", status: "In Transit", total: 199 },
    { id: 3, customer: "Bob Wilson", status: "Processing", total: 399 },
  ]);
  const [analytics, setAnalytics] = useState({
    totalOrders: 245,
    totalRevenue: 45678,
    avgOrderValue: 186,
    topProducts: ["Product A", "Product C", "Product B"],
    monthlyRevenue: [12000, 15000, 18000, 21000, 19000, 22000],
    ordersByStatus: { Processing: 45, "In Transit": 120, Delivered: 80 },
  });
  const [newProduct, setNewProduct] = useState({
    name: "",
    stock: "",
    price: "",
  });
  const [newOrder, setNewOrder] = useState({
    customer: "",
    status: "",
    total: "",
  });

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setNewOrder({
      customer: order.customer,
      status: order.status,
      total: order.total,
    });
  };

  const handleUpdateOrder = (e) => {
    e.preventDefault();
    const updatedOrders = orders.map((order) =>
      order.id === editingOrder.id ? { ...order, ...newOrder } : order
    );
    setOrders(updatedOrders);
    setEditingOrder(null);
    setNewOrder({ customer: "", status: "", total: "" });

    const totalRevenue = updatedOrders.reduce(
      (sum, order) => sum + order.total,
      0
    );
    const ordersByStatus = updatedOrders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    setAnalytics((prev) => ({
      ...prev,
      totalRevenue,
      avgOrderValue: Math.round(totalRevenue / updatedOrders.length),
      ordersByStatus,
    }));
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const product = {
      id: products.length + 1,
      name: newProduct.name,
      stock: parseInt(newProduct.stock),
      price: parseInt(newProduct.price),
    };
    setProducts([...products, product]);
    setNewProduct({ name: "", stock: "", price: "" });
  };

  const handleAddOrder = (e) => {
    e.preventDefault();
    const order = {
      id: orders.length + 1,
      customer: newOrder.customer,
      status: newOrder.status,
      total: parseInt(newOrder.total),
    };
    const updatedOrders = [...orders, order];
    setOrders(updatedOrders);

    const totalRevenue = updatedOrders.reduce(
      (sum, order) => sum + order.total,
      0
    );
    const ordersByStatus = updatedOrders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    setAnalytics((prev) => ({
      ...prev,
      totalOrders: prev.totalOrders + 1,
      totalRevenue,
      avgOrderValue: Math.round(totalRevenue / updatedOrders.length),
      ordersByStatus,
    }));
    setNewOrder({ customer: "", status: "", total: "" });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/db/scm", {
        method: "POST",
        body: JSON.stringify({
          query: "SELECT * FROM `users` WHERE `email` = ? AND `password` = ?",
          values: [email, password],
        }),
      });
      const data = await response.json();
      if (data && data.length > 0) {
        setActiveSection("dashboard");
      } else {
        setFormStatus("Invalid credentials");
      }
    } catch (error) {
      setFormStatus("Login failed");
    }
  };
  const handleTrackShipment = (e) => {
    e.preventDefault();
    setShipmentDetails({
      tracking_number: trackingNumber,
      status: "In Transit",
      location: "New York City",
      estimated_delivery: "2024-02-20",
    });
    setCenter({ lat: 40.7128, lng: -74.006 });
  };
  const handleContact = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setFormStatus("Message sent successfully!");
        e.target.reset();
      } else {
        setFormStatus("Failed to send message. Please try again.");
      }
    } catch (error) {
      setFormStatus("Failed to send message. Please try again.");
    }
  };
  const handleGetStarted = () => {
    setActiveSection("track");
  };
  const handleLearnMore = () => {
    setActiveSection("features");
  };

  const renderContent = () => {
    switch (activeSection) {
      case "track":
        return (
          <section className="py-20 px-4">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-3xl font-roboto text-center mb-8">
                Track Shipment
              </h2>
              <form onSubmit={handleTrackShipment} className="space-y-6 mb-8">
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter Tracking Number"
                    className="flex-1 p-3 border rounded"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-[#1a237e] text-white px-6 py-3 rounded hover:bg-[#3949ab]"
                  >
                    Track
                  </button>
                </div>
              </form>

              {shipmentDetails && (
                <div className="space-y-8">
                  <div className="p-6 border rounded-lg shadow-lg">
                    <h3 className="font-roboto text-xl mb-4">
                      Shipment Details
                    </h3>
                    <div className="space-y-2">
                      <p>
                        <strong>Tracking Number:</strong>{" "}
                        {shipmentDetails.tracking_number}
                      </p>
                      <p>
                        <strong>Status:</strong> {shipmentDetails.status}
                      </p>
                      <p>
                        <strong>Current Location:</strong>{" "}
                        {shipmentDetails.location}
                      </p>
                      <p>
                        <strong>Estimated Delivery:</strong>{" "}
                        {shipmentDetails.estimated_delivery}
                      </p>
                    </div>
                  </div>
                  <div className="h-[400px]">
                    <ReactGoogleMaps.APIProvider
                      apiKey={NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                      libraries={["places"]}
                    >
                      <ReactGoogleMaps.Map
                        id="map"
                        mapId="map"
                        center={center}
                        zoom={12}
                        className="w-full h-full rounded-lg"
                      >
                        <ReactGoogleMaps.AdvancedMarker position={center}>
                          <ReactGoogleMaps.InfoWindow>
                            <div className="p-2">
                              <strong>Current Location</strong>
                              <p>Your package is here</p>
                            </div>
                          </ReactGoogleMaps.InfoWindow>
                        </ReactGoogleMaps.AdvancedMarker>
                      </ReactGoogleMaps.Map>
                    </ReactGoogleMaps.APIProvider>
                  </div>
                </div>
              )}
            </div>
          </section>
        );
      case "features":
        return (
          <section className="py-20 px-4">
            <div className="container mx-auto">
              <h2 className="text-3xl font-roboto text-center mb-16">
                Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 rounded-lg shadow-lg">
                  <i className="fas fa-network-wired text-[#1a237e] text-4xl mb-4"></i>
                  <h3 className="font-roboto text-xl mb-4">
                    Immutable Tracking
                  </h3>
                  <p>Real-time tracking with unchangeable blockchain records</p>
                </div>
                <div className="p-6 rounded-lg shadow-lg">
                  <i className="fas fa-file-contract text-[#1a237e] text-4xl mb-4"></i>
                  <h3 className="font-roboto text-xl mb-4">Smart Contracts</h3>
                  <p>Automated execution of supply chain agreements</p>
                </div>
                <div className="p-6 rounded-lg shadow-lg">
                  <i className="fas fa-eye text-[#1a237e] text-4xl mb-4"></i>
                  <h3 className="font-roboto text-xl mb-4">
                    End-to-End Visibility
                  </h3>
                  <p>Complete supply chain transparency and monitoring</p>
                </div>
              </div>
            </div>
          </section>
        );
      case "how-it-works":
        return (
          <section className="py-20 px-4">
            <div className="container mx-auto">
              <h2 className="text-3xl font-roboto text-center mb-16">
                How It Works
              </h2>
              <div className="space-y-8">
                {[
                  {
                    title: "Research",
                    icon: "fa-search",
                    desc: "Understanding problems and blockchain benefits",
                  },
                  {
                    title: "System Design",
                    icon: "fa-project-diagram",
                    desc: "Structuring the blockchain and defining roles",
                  },
                  {
                    title: "Development",
                    icon: "fa-code",
                    desc: "Building smart contracts and logging data",
                  },
                  {
                    title: "Testing",
                    icon: "fa-vial",
                    desc: "Ensuring security and traceability",
                  },
                ].map((step, index) => (
                  <div
                    key={index}
                    className="flex items-center p-6 rounded-lg shadow-lg"
                  >
                    <div className="mr-6">
                      <i
                        className={`fas ${step.icon} text-[#1a237e] text-3xl`}
                      ></i>
                    </div>
                    <div>
                      <h3 className="font-roboto text-xl mb-2">{step.title}</h3>
                      <p>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      case "about":
        return (
          <section className="py-20 px-4">
            <div className="container mx-auto">
              <h2 className="text-3xl font-roboto text-center mb-16">
                About Us
              </h2>
              <div className="text-center mb-8">
                <p className="text-xl mb-6">
                  "Building secure and efficient supply chains using
                  cutting-edge technology."
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                  "Areej Emaan",
                  "Shoaib Ali",
                  "Hammad Shahid",
                  "Ameer Hamza",
                ].map((member, index) => (
                  <div
                    key={index}
                    className="text-center p-6 rounded-lg shadow-lg"
                  >
                    <i className="fas fa-user-circle text-[#1a237e] text-5xl mb-4"></i>
                    <h3 className="font-roboto text-xl">{member}</h3>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      case "contact":
        return (
          <section className="py-20 px-4">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-3xl font-roboto text-center mb-16">
                Contact Us
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <form onSubmit={handleContact} className="space-y-6">
                  <input
                    type="hidden"
                    name="access_key"
                    value="6a8caf2e-b2d5-4fb2-8547-d7c327d7b570"
                  />
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      className="w-full p-3 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      className="w-full p-3 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <input
                      ref={searchRef}
                      type="text"
                      name="location"
                      placeholder="Your Location"
                      className="w-full p-3 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <textarea
                      name="message"
                      placeholder="Your Message"
                      rows="4"
                      className="w-full p-3 border rounded"
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#1a237e] text-white py-3 rounded hover:bg-[#3949ab]"
                  >
                    Send Message
                  </button>
                  {formStatus && (
                    <div className="mt-4 text-center font-medium">
                      {formStatus}
                    </div>
                  )}
                </form>
                <div className="h-[400px]">
                  <ReactGoogleMaps.APIProvider
                    apiKey={NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                    libraries={["places"]}
                    onLoad={() => {
                      const autocomplete = new google.maps.places.Autocomplete(
                        searchRef.current
                      );
                      google.maps.event.addListener(
                        autocomplete,
                        "place_changed",
                        function () {
                          const place = autocomplete.getPlace();
                          setCenter(place.geometry?.location);
                        }
                      );
                    }}
                  >
                    <ReactGoogleMaps.Map
                      id="map"
                      mapId="map"
                      center={center}
                      onCenterChanged={(e) => setCenter(e.detail.center)}
                      defaultCenter={{ lat: 37.7749, lng: -122.4194 }}
                      zoom={15}
                      className="w-full h-full rounded-lg"
                    />
                  </ReactGoogleMaps.APIProvider>
                </div>
              </div>
            </div>
          </section>
        );
      case "dashboard":
        return (
          <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="container mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-lg font-roboto mb-2">Total Orders</h3>
                    <p className="text-3xl font-bold text-[#1a237e]">
                      {analytics.totalOrders}
                    </p>
                    <div className="mt-2 text-sm">
                      <div>
                        Processing: {analytics.ordersByStatus.Processing || 0}
                      </div>
                      <div>
                        In Transit:{" "}
                        {analytics.ordersByStatus["In Transit"] || 0}
                      </div>
                      <div>
                        Delivered: {analytics.ordersByStatus.Delivered || 0}
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="text-lg font-roboto mb-2">Revenue</h3>
                    <p className="text-3xl font-bold text-[#1a237e]">
                      ${analytics.totalRevenue}
                    </p>
                    <div className="mt-2 h-20">
                      <div className="flex h-full items-end space-x-1">
                        {analytics.monthlyRevenue.map((revenue, index) => (
                          <div
                            key={index}
                            className="bg-green-200 w-4"
                            style={{
                              height: `${
                                (revenue /
                                  Math.max(...analytics.monthlyRevenue)) *
                                100
                              }%`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="bg-yellow-50 p-6 rounded-lg">
                    <h3 className="text-lg font-roboto mb-2">
                      Avg Order Value
                    </h3>
                    <p className="text-3xl font-bold text-[#1a237e]">
                      ${analytics.avgOrderValue}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h3 className="text-lg font-roboto mb-2">Top Products</h3>
                    <div className="space-y-2">
                      {analytics.topProducts.map((product, index) => (
                        <div key={index} className="flex items-center">
                          <span className="w-6 text-sm">{index + 1}.</span>
                          <span className="flex-1">{product}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex mb-6 border-b">
                  <button
                    onClick={() => setSelectedTab("overview")}
                    className={`px-4 py-2 ${
                      selectedTab === "overview"
                        ? "border-b-2 border-[#1a237e] text-[#1a237e]"
                        : ""
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setSelectedTab("products")}
                    className={`px-4 py-2 ${
                      selectedTab === "products"
                        ? "border-b-2 border-[#1a237e] text-[#1a237e]"
                        : ""
                    }`}
                  >
                    Products
                  </button>
                  <button
                    onClick={() => setSelectedTab("orders")}
                    className={`px-4 py-2 ${
                      selectedTab === "orders"
                        ? "border-b-2 border-[#1a237e] text-[#1a237e]"
                        : ""
                    }`}
                  >
                    Orders
                  </button>
                </div>

                {selectedTab === "overview" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-roboto mb-4">
                        Recent Orders
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="px-6 py-3 text-left">Order ID</th>
                              <th className="px-6 py-3 text-left">Customer</th>
                              <th className="px-6 py-3 text-left">Status</th>
                              <th className="px-6 py-3 text-left">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders.slice(0, 3).map((order) => (
                              <tr key={order.id} className="border-t">
                                <td className="px-6 py-4">{order.id}</td>
                                <td className="px-6 py-4">{order.customer}</td>
                                <td className="px-6 py-4">{order.status}</td>
                                <td className="px-6 py-4">${order.total}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {selectedTab === "products" && (
                  <div>
                    <form
                      onSubmit={handleAddProduct}
                      className="mb-6 p-4 border rounded-lg"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                          type="text"
                          placeholder="Product Name"
                          value={newProduct.name}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              name: e.target.value,
                            })
                          }
                          className="p-2 border rounded"
                          required
                        />
                        <input
                          type="number"
                          placeholder="Stock"
                          value={newProduct.stock}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              stock: e.target.value,
                            })
                          }
                          className="p-2 border rounded"
                          required
                        />
                        <input
                          type="number"
                          placeholder="Price"
                          value={newProduct.price}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              price: e.target.value,
                            })
                          }
                          className="p-2 border rounded"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="mt-4 bg-[#1a237e] text-white px-4 py-2 rounded"
                      >
                        Add Product
                      </button>
                    </form>
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-6 py-3 text-left">ID</th>
                            <th className="px-6 py-3 text-left">Name</th>
                            <th className="px-6 py-3 text-left">Stock</th>
                            <th className="px-6 py-3 text-left">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((product) => (
                            <tr key={product.id} className="border-t">
                              <td className="px-6 py-4">{product.id}</td>
                              <td className="px-6 py-4">{product.name}</td>
                              <td className="px-6 py-4">{product.stock}</td>
                              <td className="px-6 py-4">${product.price}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {selectedTab === "orders" && (
                  <div>
                    <form
                      onSubmit={
                        editingOrder ? handleUpdateOrder : handleAddOrder
                      }
                      className="mb-6 p-4 border rounded-lg"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                          type="text"
                          placeholder="Customer Name"
                          value={newOrder.customer}
                          onChange={(e) =>
                            setNewOrder({
                              ...newOrder,
                              customer: e.target.value,
                            })
                          }
                          className="p-2 border rounded"
                          required
                        />
                        <select
                          value={newOrder.status}
                          onChange={(e) =>
                            setNewOrder({ ...newOrder, status: e.target.value })
                          }
                          className="p-2 border rounded"
                          required
                        >
                          <option value="">Select Status</option>
                          <option value="Processing">Processing</option>
                          <option value="In Transit">In Transit</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                        <input
                          type="number"
                          placeholder="Total Amount"
                          value={newOrder.total}
                          onChange={(e) =>
                            setNewOrder({ ...newOrder, total: e.target.value })
                          }
                          className="p-2 border rounded"
                          required
                        />
                      </div>
                      <div className="mt-4 flex justify-between">
                        <button
                          type="submit"
                          className="bg-[#1a237e] text-white px-4 py-2 rounded"
                        >
                          {editingOrder ? "Update Order" : "Add Order"}
                        </button>
                        {editingOrder && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingOrder(null);
                              setNewOrder({
                                customer: "",
                                status: "",
                                total: "",
                              });
                            }}
                            className="bg-gray-500 text-white px-4 py-2 rounded"
                          >
                            Cancel Edit
                          </button>
                        )}
                      </div>
                    </form>
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-6 py-3 text-left">Order ID</th>
                            <th className="px-6 py-3 text-left">Customer</th>
                            <th className="px-6 py-3 text-left">Status</th>
                            <th className="px-6 py-3 text-left">Total</th>
                            <th className="px-6 py-3 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order) => (
                            <tr key={order.id} className="border-t">
                              <td className="px-6 py-4">{order.id}</td>
                              <td className="px-6 py-4">{order.customer}</td>
                              <td className="px-6 py-4">{order.status}</td>
                              <td className="px-6 py-4">${order.total}</td>
                              <td className="px-6 py-4">
                                <button
                                  onClick={() => handleEditOrder(order)}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      default:
        return (
          <>
            <section className="bg-gradient-to-r from-[#1a237e] to-[#3949ab] text-white py-20">
              <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 mb-10 md:mb-0">
                    <h1 className="font-roboto text-4xl md:text-5xl mb-6">
                      Revolutionizing Supply Chain Transparency with Blockchain
                    </h1>
                    <p className="text-xl mb-8">
                      Secure, transparent, and efficient supply chain management
                      powered by blockchain technology
                    </p>
                    <div className="space-x-4">
                      <button
                        onClick={handleLearnMore}
                        className="bg-white text-[#1a237e] px-6 py-3 rounded-lg hover:bg-blue-100"
                      >
                        Learn More
                      </button>
                      <button
                        onClick={handleGetStarted}
                        className="border-2 border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-[#1a237e]"
                      >
                        Get Started
                      </button>
                    </div>
                  </div>
                  <div className="md:w-1/2">
                    <img
                      src="/logistics-trucks.jpg"
                      alt="Fleet of logistics trucks parked in a warehouse distribution center"
                      className="w-full h-auto rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              </div>
            </section>
            <section className="py-20">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl font-roboto text-center mb-16">
                  Key Benefits
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center p-6 rounded-lg hover:shadow-xl transition-shadow">
                    <i className="fas fa-link text-[#1a237e] text-4xl mb-4"></i>
                    <h3 className="font-roboto text-xl mb-4">Transparency</h3>
                    <p>
                      Complete visibility of your supply chain from end to end
                    </p>
                  </div>
                  <div className="text-center p-6 rounded-lg hover:shadow-xl transition-shadow">
                    <i className="fas fa-search text-[#1a237e] text-4xl mb-4"></i>
                    <h3 className="font-roboto text-xl mb-4">Traceability</h3>
                    <p>
                      Track products in real-time across the entire supply chain
                    </p>
                  </div>
                  <div className="text-center p-6 rounded-lg hover:shadow-xl transition-shadow">
                    <i className="fas fa-shield-alt text-[#1a237e] text-4xl mb-4"></i>
                    <h3 className="font-roboto text-xl mb-4">
                      Fraud Prevention
                    </h3>
                    <p>
                      Immutable records ensure data integrity and prevent fraud
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </>
        );
    }
  };

  return (
    <div>
      <header className="bg-white shadow-md fixed w-full top-0 z-50">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-roboto text-[#1a237e]">
              BlockchainSCM
            </div>
            <div className="md:hidden">
              <button onClick={() => setMenuOpen(!menuOpen)}>
                <i className={`fas ${menuOpen ? "fa-times" : "fa-bars"}`}></i>
              </button>
            </div>
            <div
              className={`md:flex space-x-6 ${
                menuOpen
                  ? "block absolute top-full left-0 right-0 bg-white p-4 shadow-md"
                  : "hidden"
              } md:relative md:p-0 md:shadow-none`}
            >
              {[
                "home",
                "track",
                "features",
                "how-it-works",
                "about",
                "contact",
                "dashboard",
              ].map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`capitalize ${
                    activeSection === section
                      ? "text-[#1a237e]"
                      : "hover:text-[#1a237e]"
                  }`}
                >
                  {section.replace("-", " ")}
                </button>
              ))}
            </div>
          </div>
        </nav>
      </header>

      <main className="mt-[72px]">{renderContent()}</main>

      <footer className="bg-[#1a237e] text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>&copy; 2024 BlockchainSCM. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MainComponent;