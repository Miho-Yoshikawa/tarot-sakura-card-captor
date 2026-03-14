/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { clowCards, ClowCard as ClowCardType } from "./data/cards";
import { ClowCard } from "./components/ClowCard";
import { Sparkles, Download, Github } from "lucide-react";
import { toPng, toBlob } from "html-to-image";

type SpreadPosition = "Passado" | "Presente" | "Futuro";

interface DrawnCard {
  card: ClowCardType;
  position: SpreadPosition;
  isFlipped: boolean;
}

export default function App() {
  const [userName, setUserName] = useState("");
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const drawCards = () => {
    setIsDrawing(true);
    setDrawnCards([]);
    
    // Shuffle and pick 3
    const shuffled = [...clowCards].sort(() => 0.5 - Math.random());
    const picked = shuffled.slice(0, 3);
    
    const positions: SpreadPosition[] = ["Passado", "Presente", "Futuro"];
    
    setTimeout(() => {
      setDrawnCards(
        picked.map((card, index) => ({
          card,
          position: positions[index],
          isFlipped: false,
        }))
      );
      setIsDrawing(false);
    }, 500);
  };

  const flipCard = (index: number) => {
    setDrawnCards((prev) => 
      prev.map((c, i) => i === index ? { ...c, isFlipped: true } : c)
    );
  };

  const downloadImage = async () => {
    if (!printRef.current) return;
    setIsDownloading(true);
    try {
      // Ensure all images are loaded before capturing
      const images = printRef.current.querySelectorAll("img");
      await Promise.all(
        Array.from(images).map((img) => {
          const image = img as HTMLImageElement;
          if (image.complete) return Promise.resolve();
          return new Promise((resolve, reject) => {
            image.onload = resolve;
            image.onerror = reject;
          });
        })
      );

      const blob = await toBlob(printRef.current, {
        backgroundColor: "#fff0f5",
        pixelRatio: 2,
        skipFonts: true,
      });

      if (!blob) throw new Error("Failed to generate blob");

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `leitura-clow-${new Date().toISOString().split("T")[0]}.png`;
      link.href = url;
      link.click();
      
      // Cleanup
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (err) {
      console.error("Failed to generate image", err);
      alert("Erro ao gerar a imagem. Tente novamente.");
    } finally {
      setIsDownloading(false);
    }
  };

  const allFlipped = drawnCards.length === 3 && drawnCards.every(c => c.isFlipped);

  const generateStaticInterpretation = () => {
    if (drawnCards.length < 3) return "";
    const [past, present, future] = drawnCards;
    return `Sua jornada mágica revela que o passado foi influenciado por ${past.card.namePt}, trazendo ${past.card.meaning.toLowerCase()}. No presente, ${present.card.namePt} sugere que ${present.card.meaning.toLowerCase()}. Para o futuro, ${future.card.namePt} indica que ${future.card.meaning.toLowerCase()}.`;
  };

  return (
    <div className="min-h-screen bg-[#fff0f5] text-[#8b1c31] font-sans selection:bg-[#ffb7c5] selection:text-[#8b1c31] overflow-x-hidden relative flex flex-col">
      {/* Header */}
      <header className="py-12 flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-serif italic mb-4 text-[#e05a7e] flex items-center gap-3 justify-center">
            <Sparkles className="text-[#e6c27a]" size={40} />
            Oráculo Clow
            <Sparkles className="text-[#e6c27a]" size={40} />
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-80">
            Conecte-se com a magia das Cartas Clow. Descubra as mensagens que o passado, o presente e o futuro reservam para você.
          </p>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-24 flex-grow">
        {!drawnCards.length && !isDrawing ? (
          <motion.div 
            className="flex flex-col items-center justify-center mt-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <input 
              type="text" 
              placeholder="Digite seu nome (opcional)" 
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="px-6 py-3 rounded-full border-2 border-[#e6c27a] bg-white text-[#8b1c31] focus:outline-none focus:border-[#e05a7e] text-center text-lg mb-8 w-full max-w-md shadow-sm placeholder:text-[#8b1c31]/40"
            />

            <div className="relative w-[147px] h-[324px] mb-12">
              {/* Stack of cards effect */}
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute inset-0 rounded-xl border-[6px] border-[#e6c27a] bg-[#8b1c31] shadow-xl"
                  style={{ 
                    transform: `translateY(${i * -4}px) translateX(${i * 2}px) rotate(${i * 1}deg)`,
                    zIndex: 10 - i
                  }}
                >
                  <div className="absolute inset-2 border border-[#e6c27a] rounded-lg opacity-70"></div>
                </div>
              ))}
            </div>
            
            <button
              onClick={drawCards}
              className="px-8 py-4 bg-[#e05a7e] text-white rounded-full font-bold text-xl shadow-lg hover:bg-[#8b1c31] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
            >
              <Sparkles size={24} />
              Tirar as Cartas
            </button>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center">
            {/* Cards Spread */}
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 justify-center items-center md:items-start mt-4 mb-16">
              <AnimatePresence>
                {drawnCards.map((drawn, index) => (
                  <motion.div
                    key={drawn.card.id}
                    initial={{ opacity: 0, y: 100, rotate: -10 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="flex flex-col items-center"
                  >
                    <h3 className="text-xl font-serif italic mb-4 text-[#e05a7e]">{drawn.position}</h3>
                    <ClowCard
                      card={drawn.card}
                      isFlipped={drawn.isFlipped}
                      onClick={() => flipCard(index)}
                      className="hover:-translate-y-2 transition-transform duration-300"
                    />
                    {!drawn.isFlipped && (
                      <p className="mt-4 text-sm opacity-60 animate-pulse">Clique para revelar</p>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Meanings Section */}
            <AnimatePresence>
              {drawnCards.some(c => c.isFlipped) && (
                <div className="w-full max-w-4xl space-y-8">
                  {allFlipped && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[#8b1c31] text-white p-8 rounded-3xl shadow-xl border-2 border-[#e6c27a] relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-20">
                        <Sparkles size={64} />
                      </div>
                      <h3 className="text-2xl font-serif italic mb-4 flex items-center gap-2">
                        <Sparkles className="text-[#e6c27a]" size={24} />
                        Resumo da sua Jornada
                      </h3>
                      <p className="text-lg leading-relaxed italic">
                        "{generateStaticInterpretation()}"
                      </p>
                      <div className="mt-6 pt-6 border-t border-white/20">
                        <p className="text-sm uppercase tracking-widest font-bold text-[#e6c27a]">Conselho Final</p>
                        <p className="text-xl mt-1">"{drawnCards[2].card.advice}"</p>
                      </div>
                    </motion.div>
                  )}

                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {drawnCards.map((drawn, index) => (
                    <div key={`meaning-${index}`} className="flex flex-col h-full">
                      {drawn.isFlipped ? (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-white p-6 rounded-2xl shadow-md border border-[#ffb7c5] h-full flex flex-col"
                        >
                          <h4 className="text-lg font-bold text-[#e05a7e] mb-0">{drawn.card.namePt}</h4>
                          <p className="text-xs opacity-70 mb-2 italic">{drawn.card.name}</p>
                          <div className="w-12 h-1 bg-[#e6c27a] mb-4"></div>
                          
                          <div className="mb-4 flex-grow">
                            <h5 className="text-xs uppercase tracking-wider text-[#8b1c31] font-bold mb-1 opacity-70">Significado</h5>
                            <p className="text-sm leading-relaxed">{drawn.card.meaning}</p>
                          </div>
                          
                          <div>
                            <h5 className="text-xs uppercase tracking-wider text-[#8b1c31] font-bold mb-1 opacity-70">Conselho</h5>
                            <p className="text-sm leading-relaxed italic bg-[#fff0f5] p-3 rounded-lg border border-[#ffb7c5]/50">
                              "{drawn.card.advice}"
                            </p>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="bg-white/50 p-6 rounded-2xl border border-dashed border-[#ffb7c5] h-full flex items-center justify-center opacity-50">
                          <p className="text-sm text-center">Revele a carta para ver o significado</p>
                        </div>
                      )}
                    </div>
                  ))}
                </motion.div>
              </div>
            )}
            </AnimatePresence>

            {/* Actions */}
            <AnimatePresence>
              {allFlipped && (
                <motion.div
                  initial={{ opacity: 0, mt: 0 }}
                  animate={{ opacity: 1, mt: 48 }}
                  className="mt-12 flex flex-col sm:flex-row gap-4"
                >
                  <button
                    onClick={downloadImage}
                    disabled={isDownloading}
                    className="px-6 py-3 bg-[#e05a7e] text-white rounded-full font-bold shadow-md hover:bg-[#8b1c31] transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    <Download size={20} />
                    {isDownloading ? "Gerando Imagem..." : "Salvar Leitura (PNG)"}
                  </button>
                  <button
                    onClick={() => {
                      setDrawnCards([]);
                      setUserName("");
                    }}
                    className="px-6 py-3 bg-white text-[#e05a7e] border-2 border-[#e05a7e] rounded-full font-bold shadow-sm hover:bg-[#fff0f5] transition-colors duration-300 flex items-center justify-center"
                  >
                    Nova Leitura
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-8 mt-auto border-t border-[#ffb7c5]/30">
        <div className="container mx-auto px-4 text-center flex flex-col items-center justify-center gap-3">
          <p className="opacity-80 flex items-center gap-1 justify-center">
            Desenvolvido por
            <a 
              href="https://github.com/Miho-Yoshikawa" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-bold hover:text-[#e05a7e] transition-colors duration-300 ml-1"
            >
              Miho-Yoshikawa
            </a>
          </p>
          <a
            href="https://github.com/Miho-Yoshikawa/tarot-sakura-card-captor"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm opacity-70 hover:opacity-100 hover:text-[#e05a7e] transition-all duration-300 bg-white/50 px-4 py-2 rounded-full border border-[#ffb7c5]"
          >
            <Github size={16} />
            <span className="font-medium">Projeto no GitHub</span>
          </a>
        </div>
      </footer>

      {/* Hidden Shareable View for html2canvas */}
      {allFlipped && (
        <div className="absolute left-[-9999px] top-0">
          <div ref={printRef} className="w-[1080px] bg-[#fff0f5] p-12 text-[#8b1c31] font-sans flex flex-col items-center">
            <h1 className="text-5xl font-serif italic mb-4 text-[#e05a7e] flex items-center gap-3">
              <Sparkles className="text-[#e6c27a]" size={32} />
              Oráculo Clow
              <Sparkles className="text-[#e6c27a]" size={32} />
            </h1>
            <p className="text-2xl mb-12 opacity-80">
              Leitura para <span className="font-bold">{userName || "um viajante"}</span> • {new Date().toLocaleDateString('pt-BR')}
            </p>
            
            <div className="flex gap-8 w-full justify-center mb-12">
              {drawnCards.map((drawn, i) => (
                <div key={i} className="flex flex-col items-center w-1/3">
                  <h3 className="text-2xl font-serif italic mb-6 text-[#e05a7e]">{drawn.position}</h3>
                  <div className="w-[178px] h-[392px] rounded-xl overflow-hidden border-[6px] border-[#e6c27a] bg-white shadow-xl mb-6">
                    <img 
                      src={drawn.card.imageUrl} 
                      className="w-full h-full object-contain bg-[#fdf5e6]" 
                      alt={drawn.card.namePt}
                    />
                  </div>
                  <h4 className="text-2xl font-bold text-[#e05a7e] mb-1">{drawn.card.namePt}</h4>
                  <p className="text-lg opacity-70">{drawn.card.name}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-8 w-full mb-12">
              {drawnCards.map((drawn, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-[#ffb7c5]">
                  <h5 className="text-sm uppercase tracking-wider text-[#8b1c31] font-bold mb-2 opacity-70">Significado</h5>
                  <p className="text-lg mb-6 leading-relaxed">{drawn.card.meaning}</p>
                  <h5 className="text-sm uppercase tracking-wider text-[#8b1c31] font-bold mb-2 opacity-70">Conselho</h5>
                  <p className="text-lg italic bg-[#fff0f5] p-4 rounded-xl border border-[#ffb7c5]/50 leading-relaxed text-[#e05a7e]">
                    "{drawn.card.advice}"
                  </p>
                </div>
              ))}
            </div>

            <div className="w-full bg-[#8b1c31] text-white p-10 rounded-3xl border-4 border-[#e6c27a]">
              <h3 className="text-3xl font-serif italic mb-4">Resumo da Leitura</h3>
              <p className="text-xl leading-relaxed italic">
                "{generateStaticInterpretation()}"
              </p>
              <div className="mt-8 pt-8 border-t border-white/20">
                <p className="text-sm uppercase tracking-widest font-bold text-[#e6c27a]">Conselho das Cartas</p>
                <p className="text-2xl mt-2">"{drawnCards[2].card.advice}"</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
