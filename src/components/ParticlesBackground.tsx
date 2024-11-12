import { useCallback, useMemo } from "react";
import type { Engine } from "tsparticles-engine";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

interface Props {
  isDark: boolean;
}

export default function ParticlesBackground({ isDark }: Props) {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const options = useMemo(() => ({
    fullScreen: {
      enable: false,
      zIndex: 0
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: "push",
        },
        onHover: {
          enable: true,
          mode: "repulse",
        },
        resize: true,
      },
      modes: {
        push: {
          quantity: 3,
        },
        repulse: {
          distance: 150,
          duration: 0.3,
        },
      },
    },
    particles: {
      color: {
        value: isDark ? "#ffffff" : "#000000",
      },
      links: {
        color: isDark ? "#ffffff" : "#000000",
        distance: 125,
        enable: true,
        opacity: 0.15,
        width: 1,
      },
      move: {
        enable: true,
        outModes: {
          default: "bounce",
        },
        random: false,
        speed: 1.5,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 1000,
        },
        value: window?.innerWidth < 768 ? 40 : 60,
      },
      opacity: {
        value: 0.15,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 3 },
      },
    },
    detectRetina: true,
  }), [isDark]);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={options}
      className="absolute inset-0 w-full h-full"
    />
  );
}