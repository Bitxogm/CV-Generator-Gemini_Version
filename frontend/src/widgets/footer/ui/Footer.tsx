import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { type Container, type ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { motion } from 'framer-motion';

export default function Footer() {
  const [init, setInit] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (_container?: Container): Promise<void> => {};

  const options: ISourceOptions = useMemo(
    () => ({
      background: {
        color: {
          value: "transparent",
        },
      },
      fpsLimit: 60,
      particles: {
        color: {
          value: ["#ff4500", "#ff6347", "#ffa500", "#ffff00"],
        },
        move: {
          direction: "top",
          enable: true,
          outModes: {
            default: "destroy", // ← CAMBIO: destruir al salir
          },
          random: true,
          speed: 2,
          straight: false,
        },
        number: {
          density: {
            enable: true,
          },
          value: 80, // ← REDUCIDO de 150
        },
        opacity: {
          value: { min: 0.2, max: 0.6 },
          animation: {
            enable: true,
            speed: 1,
            minimumValue: 0,
          },
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 5 },
          animation: {
            enable: true,
            speed: 2,
            minimumValue: 0.1,
          },
        },
      },
      detectRetina: true,
    }),
    []
  );

  return (
    <footer className="relative border-t overflow-hidden bg-slate-900/95 backdrop-blur-sm">
      {/* Partículas de fuego - SOLO EN FOOTER */}
      {init && (
        <div className="absolute bottom-0 left-0 right-0 h-full pointer-events-none overflow-hidden">
          <Particles
            id="tsparticles-fire"
            particlesLoaded={particlesLoaded}
            options={options}
            className="w-full h-full"
          />
        </div>
      )}

      {/* Resplandor sutil */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-orange-600/10 to-transparent blur-xl pointer-events-none" />

      {/* Contenido del footer */}
      <div className="relative container mx-auto px-4 py-6 z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm"
        >
          {/* Lado izquierdo */}
          <motion.div
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="flex items-center gap-2"
          >
            <motion.span
              animate={{
                scale: isHovered ? [1, 1.15, 1] : 1,
              }}
              transition={{ duration: 0.3 }}
              className="text-orange-300"
            >
              Made with 🔥 and 💪 by
            </motion.span>

            <motion.span
              whileHover={{ scale: 1.05 }}
              className="font-bold cursor-pointer"
              style={{
                background: "linear-gradient(to right, #ffa500, #ff6347, #ffd700)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 10px rgba(255,165,0,0.8))",
              }}
            >
              Otaku&Obama Development
            </motion.span>
          </motion.div>

          {/* Lado derecho */}
          <div className="flex items-center gap-4 text-gray-300">
            <motion.span
              whileHover={{
                color: '#fff',
              }}
              transition={{ duration: 0.2 }}
            >
              © 2026 CV Crafter
            </motion.span>
            <span>·</span>
            <motion.a
              href="https://bitxodev.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{
                scale: 1.05,
                color: '#ffa500',
              }}
              className="transition-colors hover:drop-shadow-[0_0_8px_rgba(255,165,0,0.6)]"
            >
              bitxodev.com
            </motion.a>
          </div>
        </motion.div>

        {/* Línea decorativa */}
        <motion.div
          className="mt-4 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"
          animate={{
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      </div>
    </footer>
  );
}