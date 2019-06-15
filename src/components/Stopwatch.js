import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const Button = styled.button`
  font-size: 2rem;
  padding: 1rem;
  margin: 1rem;
  background: transparent;
  color: ${props => props.theme.dark};
  border: 2px solid ${props => props.theme.dark};
  border-radius: 10px;
  &:hover {
    transform: translateY(-3px);
    transition: all 0.2s;
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.8);
  }
`;

const Label = styled.label`
  display: block;
  font-size: 4rem;
  margin: 2rem;
  background: transparent;
  color: ${props => props.theme.dark};
  text-align: center;
`;

const time = ms => {
  return new Date(ms).toISOString().slice(11, -1);
};

export const Stopwatch = () => {
  const [lapse, setLapse] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const handleRunClick = () => {
    if (running) {
      clearInterval(intervalRef.current);
    } else {
      const startTime = Date.now() - lapse;
      intervalRef.current = setInterval(() => {
        setLapse(Date.now() - startTime);
      }, 0);
    }
    setRunning(!running);
  };

  const handleClearClick = () => {
    clearInterval(intervalRef.current);
    setLapse(0);
    setRunning(false);
  };

  const salary = 60000;
  const days = 260;
  const hours = 7.5;
  const minutes = 60;
  const seconds = 60;
  const milliseconds = 1000;

  return (
    <div style={{ textAlign: 'center' }}>
      <Label>{time(lapse)}</Label>
      <h2>
        {new Intl.NumberFormat('en-GB', {
          style: 'currency',
          currency: 'GBP',
        }).format(
          (salary / days / hours / minutes / seconds / milliseconds) *
            parseInt(lapse)
        )}
      </h2>
      <Button onClick={handleRunClick}>
        {running ? 'Stop' : 'Start'}
      </Button>
      <Button onClick={handleClearClick}>Clear</Button>
    </div>
  );
};
