// dyad.config.ts
export default {
  components: {
    // habilite apenas o que você precisa
    button: true,
    input: true,
    select: true, // <‑‑ ativar o Select aqui
    // ...outros componentes
  },
  theme: {
    // (opcional) sobrescrita de tokens
    select: {
      borderRadius: '8px',
      background: '#fff',
    },
  },
};
