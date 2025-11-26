export default function Calendar({ selectedDate, currentMonth, onDateClick, onMonthChange }) {
  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const startingDayOfWeek = firstDay.getDay()
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    
    const days = []
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    return days
  }

  const isSameDay = (date1, date2) => {
    return date1 && date2 &&
           date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear()
  }

  const getMonthName = (date) => {
    return date.toLocaleDateString('da-DK', { month: 'long' })
  }

  const getWeekdayNames = () => {
    const weekdays = []
    const date = new Date(2024, 0, 7)
    for (let i = 0; i < 7; i++) {
      const weekday = date.toLocaleDateString('en-US', { weekday: 'short' })
      weekdays.push(weekday.substring(0, 2))
      date.setDate(date.getDate() + 1)
    }
    return weekdays
  }

  const dayNames = getWeekdayNames()
  const days = getDaysInMonth(currentMonth)

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <button
          onClick={() => onMonthChange(-1)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.25rem',
            color: '#6b7280',
            cursor: 'pointer',
            padding: '0.25rem 0.5rem'
          }}
        >
          ‹
        </button>
        <span style={{ fontWeight: 'bold', color: '#374151', fontSize: '0.875rem' }}>
          {getMonthName(currentMonth)} {currentMonth.getFullYear()}
        </span>
        <button
          onClick={() => onMonthChange(1)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.25rem',
            color: '#6b7280',
            cursor: 'pointer',
            padding: '0.25rem 0.5rem'
          }}
        >
          ›
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.125rem', marginBottom: '1rem' }}>
        {dayNames.map(day => (
          <div key={day} style={{ textAlign: 'center', fontSize: '0.75rem', color: '#6b7280', padding: '0.25rem' }}>
            {day}
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.125rem' }}>
        {days.map((date, index) => (
          <button
            key={index}
            onClick={() => date && onDateClick(date)}
            disabled={!date}
            style={{
              aspectRatio: 1,
              border: 'none',
              backgroundColor: isSameDay(date, selectedDate) ? '#d1d5db' : date ? '#ffffff' : 'transparent',
              fontSize: '0.75rem',
              cursor: date ? 'pointer' : 'default',
            }}
            onMouseEnter={(e) => {
              if (date && !isSameDay(date, selectedDate)) {
                e.target.style.backgroundColor = '#f3f4f6'
              }
            }}
            onMouseLeave={(e) => {
              if (date && !isSameDay(date, selectedDate)) {
                e.target.style.backgroundColor = '#ffffff'
              }
            }}
          >
            {date ? date.getDate() : ''}
          </button>
        ))}
      </div>
    </div>
  )
}

