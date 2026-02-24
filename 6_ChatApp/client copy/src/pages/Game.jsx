import React from 'react'
import { useNavigate } from 'react-router';

const Game = () => {
  const navigate= useNavigate();
  return (
    <div>
      <div>
            return to dashboard:
            <div>
        <button onClick={()=>navigate('/dashboard')}>dashboard</button>
      </div>
        </div>
        <br />

        new game
      <br />

      <div className="friendPlayer">
        <input type="text" placeholder='friend id' />
        <button>send invite</button>
      </div>
    </div>
  )
}

export default Game
