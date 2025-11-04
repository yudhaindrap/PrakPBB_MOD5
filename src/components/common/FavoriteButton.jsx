// src/components/common/FavoriteButton.jsx

import { Heart } from 'lucide-react';
import { useIsFavorited } from '../../hooks/useFavorites';

export default function FavoriteButton({ recipeId, size = 'md' }) {
  const {
    isFavorited,
    loading: isUpdating,
    toggleFavorite,
  } = useIsFavorited(recipeId);

  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (!isUpdating) {
      toggleFavorite();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isUpdating}
      className={`
        ${sizes[size]} rounded-full flex items-center justify-center
        transition-all duration-200 
        ${isFavorited
          ? 'bg-red-500 hover:bg-red-600 text-white'
          : 'bg-white/90 hover:bg-white text-slate-700 hover:text-red-500'
        }
        backdrop-blur-sm shadow-md hover:shadow-lg
        ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      title={isFavorited ? 'Hapus dari favorit' : 'Tambah ke favorit'}
    >
      <Heart
        className={`${iconSizes[size]} ${isFavorited ? 'fill-current text-white' : ''}`}
      />
    </button>
  );
}
