import { useState, useEffect, useCallback } from 'react';
import { BusinessSummary } from '@/core/types';
import { apiClient } from '@/core/api/client';

export function useBusinessSearchViewModel() {
  const [businesses, setBusinesses] = useState<BusinessSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBusinessForJoin, setSelectedBusinessForJoin] = useState<BusinessSummary | null>(null);

  const categories = [
    'All',
    'Clinics & Healthcare',
    'Salons & Spas',
    'Repair & Service Centers',
    'Banking & Finance',
    'Education & Colleges',
  ];

  const fetchBusinesses = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await apiClient.getBusinesses(searchQuery, selectedCategory);
      setBusinesses(data);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    fetchBusinesses();
    const unsubscribe = apiClient.subscribe(fetchBusinesses);
    return () => unsubscribe();
  }, [fetchBusinesses]);

  return {
    businesses,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    isLoading,
    selectedBusinessForJoin,
    setSelectedBusinessForJoin,
  };
}
