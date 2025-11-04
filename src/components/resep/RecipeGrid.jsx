import { Clock, Star, ChefHat } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import FavoriteButton from '../common/FavoriteButton';

export default function RecipeGrid({ recipes, onRecipeClick, categoryLabel }) {
  const [visibleCards, setVisibleCards] = useState(new Set());
  const cardRefs = useRef([]);

  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, recipes.length);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.dataset.index);
          setTimeout(() => {
            setVisibleCards(prev => new Set(prev).add(index));
          }, (index % 3) * 150); // Animasi bertahap
        }
      });
    }, { threshold: 0.1 });

    cardRefs.current.forEach((ref, index) => {
      if (ref) {
        ref.dataset.index = index;
        observer.observe(ref);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [recipes]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
      {recipes.map((recipe, index) => (
        <div
          key={recipe.id}
          ref={el => cardRefs.current[index] = el}
          className={`group transform transition-all duration-700 ${
            visibleCards.has(index) ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div
            onClick={() => onRecipeClick && onRecipeClick(recipe.id)}
            className="relative bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 cursor-pointer group-hover:scale-105"
          >
            <div className="relative h-32 md:h-56 overflow-hidden">
              <img
                src={recipe.image_url}
                alt={recipe.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

              {/* Favorite Button */}
              <div className="absolute top-3 right-3 z-10">
                <FavoriteButton recipeId={recipe.id} size="sm" />
              </div>
            </div>

            <div className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-3">
                {/* Category Badge */}
                {categoryLabel && (
                  <span className="text-xs font-semibold text-white bg-slate-700 px-2 py-1 rounded-full">
                    {categoryLabel}
                  </span>
                )}
                
                {/* Rating */}
                {recipe.average_rating > 0 && (
                  <div className="flex items-center space-x-1 bg-white/90 px-2 py-1 rounded-full">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-semibold text-slate-700">
                      {recipe.average_rating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              <h3 className="font-bold text-slate-800 mb-2 text-base md:text-lg line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                {recipe.name}
              </h3>

              <div className="flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center space-x-1 bg-white/70 px-2 py-1 rounded-full">
                  <Clock className="w-4 h-4" />
                  <span>{recipe.prep_time}</span>
                </div>
                <div className="flex items-center space-x-1 bg-white/70 px-2 py-1 rounded-full">
                  <ChefHat className="w-4 h-4" />
                  <span>{recipe.difficulty}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {recipes.length === 0 && (
        <div className="text-center py-16 col-span-full">
          <p className="text-slate-500">Resep tidak ditemukan. Coba kata kunci lain.</p>
        </div>
      )}
    </div>
  );
}
