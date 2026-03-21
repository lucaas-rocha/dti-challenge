export default function OptionsModal({ optionModal, setOptionModal, handleConfirmOption }) {
  // Proteção: Se não houver produto, não tenta renderizar (evita tela branca)
  if (!optionModal || !optionModal.product) return null;

  // Faz o parse das opções de forma segura
  const optionsArray = JSON.parse(optionModal.product.options || '[]');

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Select Option</h3>
        <p>Please select an option for <strong>{optionModal.product.name}</strong>:</p>
        
        <select 
          className="options-select"
          value={optionModal.tempOption}
          onChange={(e) => setOptionModal({...optionModal, tempOption: e.target.value})}
        >
          {optionsArray.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        
        <div className="modal-actions">
          <button 
            className="cancel-btn" 
            onClick={() => setOptionModal({ isOpen: false, product: null, tempOption: '' })}
          >
            Cancel
          </button>
          <button className="confirm-btn" onClick={handleConfirmOption}>
            Confirm Add
          </button>
        </div>
      </div>
    </div>
  );
}