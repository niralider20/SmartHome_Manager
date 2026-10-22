import { useState } from 'react'
import { runCommand } from '../logic'

function Voice({ home, setHome }) {
  const [text, setText] = useState('')
  const [reply, setReply] = useState('')

  function send(e) {
    e.preventDefault()
    if (text.trim() === '') {
      return
    }
    const result = runCommand(home, text, Date.now())
    setHome(result.home)
    setReply(result.reply)
    setText('')
  }

  return (
    <div>
      <h2>Voice Control</h2>
      <form className="row" onSubmit={send}>
        <input placeholder="Type a command, e.g. Turn off all lights" value={text} onChange={e => setText(e.target.value)} />
        <button type="submit">Send</button>
      </form>
      {reply !== '' && <p className="item">{reply}</p>}
    </div>
  )
}

export default Voice
