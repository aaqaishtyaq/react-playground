import React, {useState, useEffect, useRef, FunctionComponent} from 'react';
import {format} from 'date-fns';
import {useIdleTimer} from 'react-idle-timer';
import Modal from 'react-modal';

Modal.setAppElement('#root');

type IdleTimeProps = {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

export const IdleTimerContainer: FunctionComponent<IdleTimeProps> = ({
  isLoggedIn,
  setIsLoggedIn,
}) => {
  const timeout = 3000;
  const [remaining, setRemaining] = useState(timeout);
  const [elapsed, setElapsed] = useState(0);
  const [lastActive, setLastActive] = useState(+new Date());
  const [lastEvent, setLastEvent] = useState('Events Emitted on Leader');
  const [leader, setLeader] = useState(true);
  const [modelIsOpen, setModelIsOpen] = useState(false);
  const sessionTimeoutRef = useRef(setTimeout(() => [], 100000000));

  const handleOnActive = () => setLastEvent('active');
  const handleOnIdle = () => {
    console.log('Idle');
    setLastEvent('idle');
    setModelIsOpen(true);
    sessionTimeoutRef.current = setTimeout(logOut, 5000);
  };

  const {
    reset,
    pause,
    resume,
    getRemainingTime,
    getLastActiveTime,
    getElapsedTime,
    isIdle,
    isLeader,
  } = useIdleTimer({
    timeout,
    onActive: handleOnActive,
    onIdle: handleOnIdle,
    crossTab: {
      emitOnAllTabs: false,
    },
  });

  const handleReset = () => reset();
  const handlePause = () => pause();
  const handleResume = () => resume();

  const stayActive = () => {
    setModelIsOpen(false);
    clearTimeout(sessionTimeoutRef.current);
    console.log('User is active');
  };

  const logOut = () => {
    setModelIsOpen(false);
    setIsLoggedIn(false);
    clearTimeout(sessionTimeoutRef.current);
    console.log('User has been logged out');
  };

  useEffect(() => {
    // Close the timer when logout, otherwise potential memory leak
    if (isLoggedIn) {
      setRemaining(getRemainingTime());
      setLastActive(getLastActiveTime());
      setElapsed(getElapsedTime());

      setInterval(() => {
        setRemaining(getRemainingTime());
        setLastActive(getLastActiveTime());
        setElapsed(getElapsedTime());
        setLeader(isLeader());
      }, 1000);
    }
  }, []);

  return (
    <div>
      <div>
        <h1>Timeout: {timeout}ms</h1>
        <h1>Time Remaining: {remaining}</h1>
        <h1>Time Elapsed: {elapsed}</h1>
        <h1>Last Active: {format(lastActive, 'MM-dd-yyyy HH:MM:ss.SSS')}</h1>
        <h1>Last Event: {lastEvent}</h1>
        <h1>Is Leader: {leader.toString()}</h1>
        <h1>Idle: {isIdle().toString()}</h1>
      </div>
      <div>
        <button onClick={handleReset}>RESET</button>
        <button onClick={handlePause}>PAUSE</button>
        <button onClick={handleResume}>RESUME</button>
      </div>

      {isLoggedIn ? <h2>Hey Aaqa</h2> : <h2>Hello Guest</h2>}
      {isLoggedIn ? (
        <Modal
          isOpen={modelIsOpen}
          style={{
            content: {
              background: '#868585',
            },
          }}
        >
          <h2>You've been idle for a while!</h2>
          <p> You will be logged out soon </p>
          <div>
            <button onClick={logOut}> Log me out </button>
            <button onClick={stayActive}> Keep me signed in </button>
          </div>
        </Modal>
      ) : (
        <div></div>
      )}
    </div>
  );
};
