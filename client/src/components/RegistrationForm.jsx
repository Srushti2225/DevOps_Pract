import React, { useState, useEffect } from 'react'; 
import axios from 'axios'; 

const API_BASE = 'http://localhost:5000/api/auth'; 

export default function RegistrationForm() { 
  const [form, setForm] = useState({ username:'', email:'', password:'', mobile:'' }); 
  const [pwdStrength, setPwdStrength] = useState(''); 
  const [avail, setAvail] = useState({ username:null, email:null }); 
  const [msg, setMsg] = useState(''); 

  useEffect(() => { 
    const strong = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/; 
    setPwdStrength(form.password ? (strong.test(form.password) ? 'Strong' : 'Weak') : ''); 
  }, [form.password]);

  const handleChange = e => { 
    const { name, value } = e.target; 
    setForm(prev => ({ ...prev, [name]: name==='mobile'? value.replace(/\D/g,'') : value })); 
  }; 

  const checkUsername = async () => { 
    if (!form.username) return; 
    try { 
      const res = await axios.get(`${API_BASE}/check-username`, { params:{ username:form.username } }); 
      setAvail(a => ({ ...a, username: res.data.ok })); 
    } catch { 
      setAvail(a => ({ ...a, username:false })); 
    } 
  }; 

  const checkEmail = async () => { 
    if (!form.email) return; 
    try { 
      const res = await axios.get(`${API_BASE}/check-email`, { params:{ email:form.email } }); 
      setAvail(a => ({ ...a, email: res.data.ok })); 
    } catch { 
      setAvail(a => ({ ...a, email:false })); 
    } 
  }; 

  const handleSubmit = async e => { 
    e.preventDefault(); 
    setMsg(''); 
    try { 
      const res = await axios.post(`${API_BASE}/register`, form); 
      setMsg(res.data.msg); 
      setForm({ username:'', email:'', password:'', mobile:'' }); 
      setAvail({ username:null, email:null }); 
    } catch (err) { 
      setMsg(err.response?.data?.msg || 'Registration failed'); 
    } 
  }; 

  return ( 
    <div className="container mt-5"> 
      <h2 className="mb-4">Register</h2> 
      <form onSubmit={handleSubmit}> 
        {/* Username */} 
        <div className="mb-3"> 
          <label className="form-label">Username</label> 
          <input 
            name="username" 
            value={form.username} 
            onChange={handleChange} 
            onBlur={checkUsername} 
            className="form-control" 
            required 
          /> 
          {avail.username===true && <small className="text-success">Available</small>} 
          {avail.username===false && <small className="text-danger">Already taken</small>} 
        </div> 

        {/* Email */} 
        <div className="mb-3"> 
          <label className="form-label">Email</label> 
          <input 
            name="email" 
            type="email" 
            value={form.email} 
            onChange={handleChange} 
            onBlur={checkEmail} 
            className="form-control" 
            required 
          /> 
          {avail.email===true && <small className="text-success">Available</small>} 
          {avail.email===false && <small className="text-danger">Already registered</small>} 
        </div> 

        {/* Password */} 
        <div className="mb-3"> 
          <label className="form-label">Password</label> 
          <input 
            name="password" 
            type="password" 
            value={form.password}
            onChange={handleChange} 
            className="form-control" 
            required 
          /> 
          {form.password && (
            <small className={pwdStrength==='Strong'? 'text-success':'text-danger'}>
              Strength: {pwdStrength}
            </small>
          )} 
        </div> 

        {/* Mobile */} 
        <div className="mb-3"> 
          <label className="form-label">Mobile</label> 
          <input 
            name="mobile" 
            value={form.mobile} 
            onChange={handleChange} 
            className="form-control" 
            required 
          /> 
          <small className="text-muted">Digits only</small> 
        </div> 

        <button type="submit" className="btn btn-primary">Register</button> 
      </form> 

      {msg && <div className="mt-3 alert alert-info">{msg}</div>} 
    </div> 
  ); 
}
