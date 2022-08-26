import './App.css';
import { useState, useEffect, useMemo } from 'react';
import socketIOClient from "socket.io-client";
import { events, ENDPOINT } from './config';

// To add more change this
const additionalButtons = 0;
const initialCounter = [0, 0, 0].concat(Array.from({ length: additionalButtons }).fill(0));

function App() {
  const senderId = useMemo(() => `project2-${new Date().getTime()}`, [])
  const [counters, setCounters] = useState(initialCounter)
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    setSocket(socketIOClient(ENDPOINT))
    return () => socket?.disconnect()
  }, [])

  useEffect(() => {
    socket?.on(events.BROADCAST, data => {
      senderId != data.senderId && handleUpdate(data.idx)
    })
  }, [socket])

  const handleUpdate = (idx) => {
    setCounters(prev => {
      let newVal = [...prev];
      newVal[idx] += 1;

      return newVal;
    })
  }

  const handleClick = (idx) => {
    handleUpdate(idx);
    socket.emit(events.UPDATE, {idx, senderId});
  }

  const handleSubmit = () => {
    fetch(`${ENDPOINT}/save`, {
      method: 'POST',
      body: new URLSearchParams({ value: counters })
    })
      .then(resp => resp.json())
      .then(data => {
        console.log(data)
      })
  }

  return (
    <div className="App">
      {
        counters.map((val, idx) => <Counter key={idx} val={val} handleClick={() => handleClick(idx)} />)
      }

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}


function Counter({ val, handleClick }) {
  return <div className='Counter'>
    <button onClick={handleClick}>Button</button>
    <span>{val}</span>
  </div>
}
export default App;
