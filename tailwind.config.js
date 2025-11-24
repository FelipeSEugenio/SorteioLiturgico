/*
 * Configuração do Tailwind CSS
 * Movida do HTML para arquivo separado
 * 
 * Define as cores customizadas, fontes e configurações
 * que o Tailwind CSS usará para gerar as classes utilitárias
 */

tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                'serif': ['Cormorant Garamond', 'serif'],
                'sans': ['Inter', 'sans-serif'],
            },
            colors: {
                'azul-real': '#1A2E6A',
                'dourado': '#C8A54B',
                'bege-claro': '#F2E9D8',
                'branco-luminoso': '#FFFFFF',
                'marrom-terroso': '#6A4F38',
                'azul-celeste': '#5F8CCB',
                'azul-noite': '#0D1B3E',
                // Mantendo a paleta neutra existente para uso geral, mas priorizando as novas cores específicas.
                neutral: {
                    '0': '#ffffff',
                    '50': '#f8f7f6',
                    '100': '#e7e5e4',
                    '200': '#e5e7eb',
                    '300': '#d1d5db',
                    '400': '#9ca3af',
                    '500': '#6b7280',
                    '600': '#4b5563',
                    '700': '#374151',
                    '800': '#1f2937',
                    '900': '#111827',
                },
            },
        },
    },
};

// Aplicar a configuração após o carregamento do Tailwind
document.addEventListener('DOMContentLoaded', function() {
    // Garantir que o Tailwind seja configurado quando disponível
    if (window.tailwind) {
        window.tailwind.config = tailwind.config;
    }
});