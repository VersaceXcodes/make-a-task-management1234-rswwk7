import React, { useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/store/main';

import { BarChart } from '@/components/chart';

const fetchReports = async () => {
  try {
    const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/reports`);
    useAppStore.setState({ reports: data }); // Dispatch to Redux store
  } catch (error) {
    console.error('Error fetching reports:', error);
  }
};

export default function ReportsView() {
  useEffect(() => { fetchReports(); }, []);

  return (
    <div>
      <BarChart data={useAppStore().reports} />
    </div>
  );
}