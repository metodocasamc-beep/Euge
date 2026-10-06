import React, { useState } from 'react';
import { ArrowRight, Eye, Layers, Maximize2, Sparkles, CheckCircle2 } from 'lucide-react';

interface PortfolioViewProps {
  onOpenBooking: () => void;
  onOpenCalculator: () => void;
}

interface ProjectItem {
  id: string;
  title: string;
  category: 'integral' | 'muebles' | 'tecnica';
  categoryLabel: string;
  location: string;
  m2: string;
  description: string;
  imageUrl: string;
  tags: string[];
  keyHighlight: string;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({
  onOpenBooking,
  onOpenCalculator
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('todos');

  const projects: ProjectItem[] = [
    {
      id: 'p1',
      title: 'Living & Espacio de Guardado Integrado',
      category: 'integral',
      categoryLabel: 'Diseño Integral 3D',
      location: 'Palermo, CABA',
      m2: '32 m²',
      description: 'Zonificación de estar y comedor en un departamento clásico. Se diseñó un mueble de pared a pared en petiribí y laca cálida que resuelve TV, biblioteca y guardado cerrado.',
      imageUrl: '/src/assets/images/portfolio_renovation_living_1790774122491.jpg',
      tags: ['Renders 3D', 'Mueble a Medida', 'Iluminación Indirecta'],
      keyHighlight: 'Ganancia de 40% de volumen de guardado sin saturar la circulación'
    },
    {
      id: 'p2',
      title: 'Monoambiente Multiuso con Divisor Inteligente',
      category: 'muebles',
      categoryLabel: 'Mobiliario a Medida',
      location: 'Colegiales, CABA',
      m2: '28 m²',
      description: 'División sutil entre área de descanso y sector social mediante celosía de madera clara y mueble giratorio para TV y barra desayunadora.',
      imageUrl: '/src/assets/images/moodboard_living_sample_1790705529895.jpg',
      tags: ['Aprovechamiento Espacial', 'Planos de Fabricación'],
      keyHighlight: 'Separación visual sin perder luz natural ni sensación de amplitud'
    },
    {
      id: 'p3',
      title: 'Carpeta Técnica Ejecutiva para Reforma Integral',
      category: 'tecnica',
      categoryLabel: 'Carpeta Técnica',
      location: 'Belgrano, CABA',
      m2: '65 m²',
      description: 'Documentación técnica completa: replanteo de tabiques, plano de tomas e iluminación, cómputo de revestimientos y especificaciones para contratistas.',
      imageUrl: '/src/assets/images/sample_floorplan_render_1790705541634.jpg',
      tags: ['Planos 2D', 'Instalación Eléctrica', 'Detalles Constructivos'],
      keyHighlight: 'Cero improvisaciones en obra con gremios y albañiles'
    },
    {
      id: 'p4',
      title: 'Renovación Cálida con Paleta Texturada',
      category: 'integral',
      categoryLabel: 'Diseño Integral 3D',
      location: 'San Isidro, GBA',
      m2: '45 m²',
      description: 'Transformación de un espacio frío en un ambiente sereno combinando linos, maderas naturales y una cuidada temperatura lumínica de 2700K.',
      imageUrl: '/src/assets/images/hero_interior_warm_1790705518861.jpg',
      tags: ['Texturas', 'Paleta Serena', 'Asesoría + 3D'],
      keyHighlight: 'Ambiente armónico y acústicamente confortable'
    }
  ];

  const filteredProjects = activeFilter === 'todos' 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f2ece4] border border-[#d9d1c5] text-xs font-mont font-bold text-[#1c2120]">
          <Layers className="w-3.5 h-3.5 text-[#fed767]" />
          <span>Trabajos realizados</span>
        </div>
        <h1 className="font-mont font-extrabold text-3xl sm:text-5xl text-[#1c2120]">
          Portfolio de Espacios
        </h1>
        <p className="text-sm sm:text-base text-[#1c2120]/80">
          Proyectos reales pensados con intención. Cada imagen refleja soluciones de distribución, identidad y funcionalidad cotidiana.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-[#f2ece4] rounded-2xl max-w-lg mx-auto border border-[#d9d1c5]">
        {[
          { id: 'todos', label: 'Todos los proyectos' },
          { id: 'integral', label: 'Diseño Integral 3D' },
          { id: 'muebles', label: 'Mobiliario a Medida' },
          { id: 'tecnica', label: 'Carpeta Técnica' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-mont font-bold transition-colors cursor-pointer ${
              activeFilter === tab.id
                ? 'bg-[#1c2120] text-white shadow-xs'
                : 'text-[#1c2120]/70 hover:text-[#1c2120] hover:bg-white/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredProjects.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-3xl overflow-hidden border border-[#d9d1c5] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="relative aspect-16/10 overflow-hidden bg-[#f2ece4]">
              <img
                src={p.imageUrl}
                alt={p.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[#1c2120] font-mont font-bold text-xs shadow-xs">
                  {p.categoryLabel}
                </span>
              </div>
              <div className="absolute bottom-4 right-4">
                <span className="px-2.5 py-1 rounded-md bg-[#1c2120]/80 text-white font-mont text-xs">
                  {p.location} · {p.m2}
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="font-mont font-bold text-xl text-[#1c2120] leading-snug">
                  {p.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#1c2120]/80 leading-relaxed font-normal">
                  {p.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#d9d1c5]/60 space-y-3">
                <div className="flex items-start gap-2 text-xs font-mont font-medium text-[#1c2120]">
                  <CheckCircle2 className="w-4 h-4 text-[#fed767] shrink-0 mt-0.5" />
                  <span>{p.keyHighlight}</span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {p.tags.map((t, idx) => (
                    <span key={idx} className="text-[10px] font-mont px-2.5 py-1 rounded-md bg-[#FAF8F5] text-[#1c2120]/80 border border-[#d9d1c5]/50">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Banner Call to Action */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[#1c2120] text-white text-center space-y-6">
        <h3 className="font-mont font-extrabold text-2xl sm:text-3xl">
          ¿Querés que tu espacio sea el próximo?
        </h3>
        <p className="text-sm text-white/80 max-w-xl mx-auto font-normal">
          Comenzamos con una videollamada para entender tu forma de vivir y te presentamos la propuesta integral en 3D.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <button
            onClick={onOpenBooking}
            className="px-6 py-3 rounded-xl bg-[#fed767] text-[#1c2120] font-mont font-bold text-xs hover:bg-[#fed458] transition-colors cursor-pointer"
          >
            Reservar reunión virtual
          </button>
          <button
            onClick={onOpenCalculator}
            className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mont font-semibold text-xs transition-colors cursor-pointer"
          >
            Calcular presupuesto online
          </button>
        </div>
      </div>
    </div>
  );
};
