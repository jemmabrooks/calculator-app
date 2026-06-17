import { useState } from 'react'
import './App.css'

const BUTTONS = [
  ['C', '±', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '−'],
  ['1', '2', '3', '+'],
  ['0', '.', '='],
]

export default function App() {
  const [display, setDisplay] = useState('0')
  const [prev, setPrev] = useState(null)
  const [op, setOp] = useState(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  function inputDigit(digit) {
    if (waitingForOperand) {
      setDisplay(String(digit))
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit)
    }
  }

  function inputDecimal() {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
      return
    }
    if (!display.includes('.')) setDisplay(display + '.')
  }

  function calculate(a, b, operator) {
    switch (operator) {
      case '+': return a + b
      case '−': return a - b
      case '×': return a * b
      case '÷': return b !== 0 ? a / b : 'Error'
      default: return b
    }
  }

  function handleOperator(nextOp) {
    const current = parseFloat(display)
    if (prev !== null && !waitingForOperand) {
      const result = calculate(prev, current, op)
      setDisplay(String(result))
      setPrev(result)
    } else {
      setPrev(current)
    }
    setOp(nextOp)
    setWaitingForOperand(true)
  }

  function handleEquals() {
    if (op === null || waitingForOperand) return
    const current = parseFloat(display)
    const result = calculate(prev, current, op)
    setDisplay(String(result))
    setPrev(null)
    setOp(null)
    setWaitingForOperand(true)
  }

  function handleButton(label) {
    if (label >= '0' && label <= '9') return inputDigit(label)
    if (label === '.') return inputDecimal()
    if (label === '=') return handleEquals()
    if (label === 'C') {
      setDisplay('0'); setPrev(null); setOp(null); setWaitingForOperand(false)
      return
    }
    if (label === '±') { setDisplay(String(parseFloat(display) * -1)); return }
    if (label === '%') { setDisplay(String(parseFloat(display) / 100)); return }
    handleOperator(label)
  }

  const isOperator = (l) => ['÷', '×', '−', '+'].includes(l)

  return (
    <div className="calculator">
      <div className="display">{display}</div>
      <div className="buttons">
        {BUTTONS.map((row, r) => (
          <div key={r} className="row">
            {row.map((label) => (
              <button
                key={label}
                className={`btn${label === '0' ? ' wide' : ''}${isOperator(label) || label === '=' ? ' operator' : ''}${['C', '±', '%'].includes(label) ? ' function' : ''}`}
                onClick={() => handleButton(label)}
              >
                {label}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
