'use client';
import { useState } from 'react';
import { DateTimePicker } from '@/components/package/DateTimePicker';

const DatetimePickerDemo = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  return <DateTimePicker value={date} onChange={setDate} />;
};

export default DatetimePickerDemo;
