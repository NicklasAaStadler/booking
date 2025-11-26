export default function TimeSlotSelector({ timeSlots, selectedTimeSlot, onTimeSlotSelect, hasError }) {
  return (
    <div>
      <h2 style={{ 
        fontSize: '0.875rem', 
        fontWeight: 600, 
        color: hasError ? '#dc2626' : '#374151', 
        marginBottom: '0.75rem' 
      }}>
        Vælg tidsrum*
      </h2>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '0.5rem', 
        marginBottom: '1.5rem' 
      }}>
        {timeSlots.map(slot => (
          <button
            key={slot}
            onClick={() => onTimeSlotSelect(slot)}
            style={{
              padding: '0.5rem 0.75rem',
              border: selectedTimeSlot === slot ? '4px solid black' : '1px solid #d1d5db',
              backgroundColor: '#ffffff',
              color: '#374151',
              fontSize: '0.75rem',
              cursor: 'pointer',
              textAlign: 'center',
              fontWeight: selectedTimeSlot === slot ? 500 : 400
            }}
            onMouseEnter={(e) => {
              if (selectedTimeSlot !== slot) {
                e.target.style.backgroundColor = 'rgba(128, 128, 128, 0.459)'
              }
            }}
            onMouseLeave={(e) => {
              if (selectedTimeSlot !== slot) {
                e.target.style.backgroundColor = '#ffffff'
              }
            }}
          >
            {slot}
          </button>
        ))}
      </div>
    </div>
  )
}
