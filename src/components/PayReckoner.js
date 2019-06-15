import React from 'react';

// 260 working days in a year
const days = 260;
const salary = 35000;
const hours = 7.5;

export const PayReckoner = () => {
  return <>{salary / days / hours / 60 / 1000}</>;
};
