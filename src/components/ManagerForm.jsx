import { useState } from 'react';

const ManagerForm = ({ onSubmit, initialData = null, buttonText = 'Ajouter' }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Skip password validation if updating
    if (!initialData && !formData.password) {
      setError('Le mot de passe est obligatoire');
      return;
    }

    try {
      // If updating and password is empty, don't send it
      const dataToSubmit = initialData && !formData.password 
        ? { name: formData.name, email: formData.email }
        : formData;
        
      await onSubmit(dataToSubmit);
      
      // Clear form if adding new manager
      if (!initialData) {
        setFormData({
          name: '',
          email: '',
          password: '',
        });
      }
    } catch (error) {
      setError(error.message || 'Une erreur est survenue');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="manager-form">
      {error && <div className="error">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="name">Nom</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="password">
          {initialData ? 'Mot de passe (laisser vide pour ne pas modifier)' : 'Mot de passe'}
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required={!initialData}
        />
      </div>
      
      <button type="submit" className="submit-btn">
        {buttonText}
      </button>
    </form>
  );
};

export default ManagerForm;