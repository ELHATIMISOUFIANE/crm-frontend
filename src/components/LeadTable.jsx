import { useState } from 'react';
import { updateLeadStatus, deleteLead } from '../services/apiService';
import { useAuth } from '../hooks/useAuth';

const LeadTable = ({ leads, onUpdate, onDelete, managers }) => {
  const { isEmployer, isManager, currentUser } = useAuth();
  const [editingLead, setEditingLead] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: '',
    value: 0,
    notes: '',
    manager: '',
  });

  const handleEdit = (lead) => {
    setEditingLead(lead._id);
    setFormData({
      name: lead.name,
      email: lead.email,
      phone: lead.phone || '',
      company: lead.company || '',
      status: lead.status,
      value: lead.value,
      notes: lead.notes || '',
      manager: lead.manager?._id || lead.manager,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: name === 'value' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onUpdate(editingLead, formData);
      setEditingLead(null);
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      await updateLeadStatus(leadId, newStatus);
      onUpdate(leadId, { status: newStatus });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (leadId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce lead?')) {
      try {
        await onDelete(leadId);
      } catch (error) {
        console.error('Error deleting lead:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <div className="lead-table">
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Téléphone</th>
            <th>Entreprise</th>
            <th>Statut</th>
            <th>Valeur</th>
            {isEmployer && <th>Manager</th>}
            <th>Date de création</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead._id}>
              {editingLead === lead._id ? (
                <td colSpan={isEmployer ? 9 : 8}>
                  <form onSubmit={handleSubmit} className="edit-form">
                    <div className="form-group">
                      <label>Nom</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={isManager}
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={isManager}
                      />
                    </div>
                    <div className="form-group">
                      <label>Téléphone</label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={isManager}
                      />
                    </div>
                    <div className="form-group">
                      <label>Entreprise</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        disabled={isManager}
                      />
                    </div>
                    <div className="form-group">
                      <label>Statut</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                      >
                        <option value="IN_PROGRESS">En cours</option>
                        <option value="COMPLETED">Terminé</option>
                        <option value="CANCELED">Annulé</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Valeur</label>
                      <input
                        type="number"
                        name="value"
                        value={formData.value}
                        onChange={handleChange}
                        disabled={isManager}
                      />
                    </div>
                    <div className="form-group">
                      <label>Notes</label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                      />
                    </div>
                    {isEmployer && (
                      <div className="form-group">
                        <label>Manager</label>
                        <select
                          name="manager"
                          value={formData.manager}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Sélectionner un manager</option>
                          {managers?.map((manager) => (
                            <option key={manager._id} value={manager._id}>
                              {manager.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div className="form-actions">
                      <button type="submit">Enregistrer</button>
                      <button type="button" onClick={() => setEditingLead(null)}>
                        Annuler
                      </button>
                    </div>
                  </form>
                </td>
              ) : (
                <>
                  <td>{lead.name}</td>
                  <td>{lead.email}</td>
                  <td>{lead.phone || '-'}</td>
                  <td>{lead.company || '-'}</td>
                  <td>
                    <span className={`status ${lead.status.toLowerCase()}`}>
                      {lead.status === 'IN_PROGRESS' ? 'En cours' : 
                       lead.status === 'COMPLETED' ? 'Terminé' : 'Annulé'}
                    </span>
                  </td>
                  <td>{lead.value.toLocaleString('fr-FR')} €</td>
                  {isEmployer && (
                    <td>{lead.manager?.name || '-'}</td>
                  )}
                  <td>{formatDate(lead.createdAt)}</td>
                  <td className="actions">
                    <button onClick={() => handleEdit(lead)}>
                      Modifier
                    </button>
                    {isManager && (
                      <div className="status-actions">
                        <button 
                          onClick={() => handleStatusChange(lead._id, 'IN_PROGRESS')}
                          className={lead.status === 'IN_PROGRESS' ? 'active' : ''}
                        >
                          En cours
                        </button>
                        <button 
                          onClick={() => handleStatusChange(lead._id, 'COMPLETED')}
                          className={lead.status === 'COMPLETED' ? 'active' : ''}
                        >
                          Terminé
                        </button>
                        <button 
                          onClick={() => handleStatusChange(lead._id, 'CANCELED')}
                          className={lead.status === 'CANCELED' ? 'active' : ''}
                        >
                          Annulé
                        </button>
                      </div>
                    )}
                    {isEmployer && (
                      <button 
                        onClick={() => handleDelete(lead._id)}
                        className="delete"
                      >
                        Supprimer
                      </button>
                    )}
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadTable;