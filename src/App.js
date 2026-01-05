import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from 'react';
import { AuthProvider } from "./components/Login/AuthContext";
import PropertyForm from "./components/Admin/Properties/Properties";
import CustomerForm from "./components/Admin/Customers/Customers";
import ClientForm from "./components/Admin/Sellers/Sellers";
import Login from "./components/Login/Login";
import PropertyCards from "./components/Admin/Properties/PropertyCards";
import CustomersCards from "./components/Admin/Customers/CustomersCards";
import SellerCards from "./components/Admin/Sellers/SellerCards";
import FollowUpForm from "./components/Admin/Followups/FollowUpForm";
import FollowUpCards from "./components/Admin/Followups/FollowUpCards";
import PropertyTypeForm from "./components/Admin/PropertyType/PropertyTypeForm";
import SiteVisitForm from "./components/Admin/Sitevisits/SiteVisitForm";
import SiteVisitCards from "./components/Admin/Sitevisits/SiteVisitCards";
import SalesForm from "./components/Admin/SalesTracking/SalesForm";
import SalesCards from "./components/Admin/SalesTracking/SalesCards";
import FinanceForm from "./components/Admin/Finances/FinanceForm";
import FinanceCards from "./components/Admin/Finances/FinanceCards";
import CustomerMatches from "./components/Admin/Customers/CustomerMatches";
import Dashboard from  "./components/Admin/Dashboard/Dashboard";
import CreateUser from "./components/Admin/Users/CreateUser";
import UsersList from "./components/Admin/Users/UsersList";
const App = () => (
  <AuthProvider>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin/create-user" element={<CreateUser />} />
      <Route path="/users-list" element={<UsersList />} />
<Route path="/edit-user/:id" element={<CreateUser />} />

      <Route path="/add-properties" element={<PropertyForm />} />
      <Route path="/edit-property/:id" element={<PropertyForm />} />

      <Route path="/add-customers" element={<CustomerForm />} />
      <Route path="/edit-customer/:id" element={<CustomerForm />} />
<Route
  path="/customers/:id/matches"
  element={<CustomerMatches />}
/>

 <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/add-sellers" element={<ClientForm />} />
      <Route path="/edit-seller/:id" element={<ClientForm />} />

      <Route path="/customers" element={<CustomersCards />} />
      <Route path="/sellers" element={<SellerCards />} />
      <Route path="/properties" element={<PropertyCards />} />

      <Route path="/followups" element={<FollowUpForm />} />
      <Route path="/add-followups" element={<FollowUpCards />} />
      <Route path="/edit-followup/:id" element={<FollowUpForm />} />

      <Route path="/propertyTypeForm" element={<PropertyTypeForm />} />

      <Route path="/siteVisitForm" element={<SiteVisitForm />} />
<Route path="/site-visits" element={<SiteVisitCards />} />
<Route path="/edit-site-visit/:id" element={<SiteVisitForm />} />

<Route path="/salesForm" element={<SalesForm />} />
<Route path="/sales" element={<SalesCards />} />
<Route path="/edit-sale/:id" element={<SalesForm />} />

<Route path="/financeForm" element={<FinanceForm />} />
<Route path="/finances" element={<FinanceCards />} />
<Route path="/finance-form/:id" element={<FinanceForm />} />

    </Routes>
  </BrowserRouter>
  </AuthProvider>
);

export default App;
