import { useState } from 'react'
import './App.css'
import { supabase } from './lib/supabase'
import Calendar from './Calendar'
import RoomSelector from './RoomSelector'
import TimeSlotSelector from './TimeSlotSelector'
import ParticipantsSection from './ParticipantsSection'
import BookingPreview from './BookingPreview'
import Dialog from './Dialog'

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedFloor, setSelectedFloor] = useState('3 sal')
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
  const [participantEmail, setParticipantEmail] = useState('')
  const [participants, setParticipants] = useState([])
  const [validationErrors, setValidationErrors] = useState({})
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  const floors = ['1 sal', '2 sal', '3 sal', '4 sal']
  const rooms = {
    '1 sal': ['1.1', '1.2', '1.3'],
    '2 sal': ['2.1', '2.2', '2.3'],
    '3 sal': ['3.1', '3.2', '3.3 '],
    '4 sal': ['4.1', '4.2', '4.3']
  }
  
  const timeSlots = [
    '08:00-09:15', '09:30-10:45', '11:00-12:15', '12:30-13:45',
    '15:30-16:45', '17:00-18:15', '18:30-19:45', '20:00-21:15', '23:00-00:15'
  ]

  const handleMonthChange = (direction) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1))
  }

  const handleRoomToggle = (room) => {
    setSelectedRoom(room === selectedRoom ? null : room)
    if (room !== selectedRoom) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.room
        return newErrors
      })
    }
  }

  const handleFloorChange = (floor) => {
    setSelectedFloor(floor)
    setSelectedRoom(null)
  }

  const handleAddParticipant = (e) => {
    e.preventDefault()
    if (participantEmail && !participants.includes(participantEmail)) {
      setParticipants([...participants, participantEmail])
      setParticipantEmail('')
    }
  }

  const handleTimeSlotSelect = (slot) => {
    setSelectedTimeSlot(slot)
    setValidationErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors.timeSlot
      return newErrors
    })
  }

  const calculateEndTime = (date, timeSlot) => {
    const endTime = timeSlot.split('-')[1]
    const [hours, minutes] = endTime.split(':').map(Number)
    const endDate = new Date(date)
    endDate.setHours(hours, minutes, 0, 0)
    return endDate.toISOString()
  }

  const formatDateForPreview = (date) => {
    const dayName = date.toLocaleDateString('da-DK', { weekday: 'long' })
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    return `${dayName} d. ${day}/${month}/${year}`
  }

  const handleBook = () => {
    const errors = {}
    if (!selectedRoom) errors.room = true
    if (!selectedTimeSlot) errors.timeSlot = true
    
    setValidationErrors(errors)
    if (Object.keys(errors).length > 0) return
    
    setShowConfirmDialog(true)
  }

  const handleConfirmBooking = async () => {
    try {
      const endsAt = calculateEndTime(selectedDate, selectedTimeSlot)
      const bookingData = {
        room_id: selectedRoom,
        ends_at: endsAt,
        participation_: participants.length,
        booked_by: 0,
        participants: participants // Gem deltagernes emails som array
      }

      const { data, error } = await supabase
        .from('session-table') 
        .insert([bookingData])
        .select()

      if (error) {
        console.error('Error creating booking:', error)
        alert('Der opstod en fejl ved oprettelse af bookingen: ' + error.message)
        return
      }

      setShowConfirmDialog(false)
      setShowSuccessDialog(true)
      console.log('Booking created successfully:', data)
    } catch (error) {
      console.error('Unexpected error:', error)
      alert('Der opstod en uventet fejl: ' + error.message)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo-container">
            <img src="/timeann.png" alt="TimeAnn Logo" className="logo-image" />
          </div>
          <div className="breadcrumb">Dashboard / Book mødelokale</div>
        </div>
      </header>

      <main className="main-content">
        <h1 className="page-title">Book mødelokale</h1>

        <div className="booking-container">
          <div className="booking-section">
            <h2 className="section-title">Vælg dato*</h2>
            <Calendar
              selectedDate={selectedDate}
              currentMonth={currentMonth}
              onDateClick={setSelectedDate}
              onMonthChange={handleMonthChange}
            />
          </div>

          <div className="booking-section">
            <RoomSelector
              floors={floors}
              rooms={rooms}
              selectedFloor={selectedFloor}
              selectedRoom={selectedRoom}
              onFloorChange={handleFloorChange}
              onRoomToggle={handleRoomToggle}
              hasError={validationErrors.room}
            />
          </div>

          <div className="booking-section">
            <TimeSlotSelector
              timeSlots={timeSlots}
              selectedTimeSlot={selectedTimeSlot}
              onTimeSlotSelect={handleTimeSlotSelect}
              hasError={validationErrors.timeSlot}
            />
            <ParticipantsSection
              participantEmail={participantEmail}
              participants={participants}
              onEmailChange={setParticipantEmail}
              onAddParticipant={handleAddParticipant}
              onRemoveParticipant={(email) => setParticipants(participants.filter(p => p !== email))}
            />
          </div>
        </div>

        <div className="bottom-section">
          <BookingPreview
            selectedDate={selectedDate}
            selectedRoom={selectedRoom}
            selectedTimeSlot={selectedTimeSlot}
            participants={participants}
            hasValidationErrors={Object.keys(validationErrors).length > 0}
          />
          <div className="book-button-container">
            <button className="book-button" onClick={handleBook}>Book</button>
          </div>
        </div>
      </main>

      <Dialog
        isOpen={showConfirmDialog}
        message={`Bekræft venligst din bookning af ${selectedRoom}, ${formatDateForPreview(selectedDate)} kl. ${selectedTimeSlot}`}
        buttons={[
          { label: 'Annuller', onClick: () => setShowConfirmDialog(false) },
          { label: 'Bekræft', onClick: handleConfirmBooking }
        ]}
        onClose={() => setShowConfirmDialog(false)}
      />

      <Dialog
        isOpen={showSuccessDialog}
        message="Din bookning blev gennemført!"
        buttons={[
          { label: 'Se alle bookninger', onClick: () => setShowSuccessDialog(false) },
          { label: 'Tilbage til dashboard', onClick: () => setShowSuccessDialog(false) }
        ]}
        onClose={() => setShowSuccessDialog(false)}
      />
    </div>
  )
}

export default App
