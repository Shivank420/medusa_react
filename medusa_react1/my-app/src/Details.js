import React, { useState } from 'react';
import './index.css'

const UserDetails = () => {
  const [formData, setFormData] = useState({
    client_name: '',
    company_name: '',
    company_address: '',
    company_email: '',
    company_contact: '',
    company_pincode: '',
    company_gst: '',
    company_logo: '',
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/user_details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        console.log('Data saved successfully');
        alert("You Saved Your Data");
      } else {
        console.error('Failed to save data');
        alert("You have unpredictable");
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  return (
    <div className="user-details-container">
      <h1>User Details Page</h1>
      <form onSubmit={handleSubmit} className="user-details-form">
        <label>
          Client Name:
          <input type="text" name="client_name" value={formData.client_name} onChange={handleChange} required />
        </label>
        <label>
          Company Name:
          <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} required />
        </label>
        <label>
          Company Address:
          <input type="text" name="company_address" value={formData.company_address} onChange={handleChange} required />
        </label>
        <label>
          Company Email:
          <input type="email" name="company_email" value={formData.company_email} onChange={handleChange} required />
        </label>
        <label>
          Contact No.:
          <input type="text" name="company_contact" value={formData.company_contact} onChange={handleChange} required />
        </label>
        <label>
          Pin Code:
          <input type="text" name="company_pincode" value={formData.company_pincode} onChange={handleChange} required />
        </label>
        <label>
          Company GST No.:
          <input type="text" name="company_gst" value={formData.company_gst} onChange={handleChange} required />
        </label>
        <label>
          Company Logo Url:
          <input type="text" name="company_logo" value={formData.company_logo} onChange={handleChange} />
        </label>
        <label>
          Username:
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
        </label>
        <label>
          Password:
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </label>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default UserDetails;
