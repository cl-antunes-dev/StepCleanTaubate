const botoesWhatsapp = document.querySelectorAll(".botao-whatsapp");
const linksMenu = document.querySelectorAll('a[href^="#"]');
const perguntasFaq = document.querySelectorAll(".faq-pergunta");
const cabecalho = document.querySelector(".cabecalho");



// WHATSAPP

botoesWhatsapp.forEach((botao) => {
    botao.addEventListener("click", (event) => {
        event.preventDefault();

        const telefone = "5512988881170";
        const paginaAtual = window.location.pathname;

        let mensagem = "Olá! Gostaria de renovar meu tênis. Posso enviar uma foto para avaliação?";

        if (paginaAtual.includes("franqueado")) {
            mensagem = "Olá! Tenho interesse em ser franqueado StepClean. Gostaria de receber mais informações.";
        }

        const link = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;

        window.open(link, "_blank");
    });
});


// ROLAGEM SUAVE PERSONALIZADA

linksMenu.forEach((link) => {
    link.addEventListener("click", function (event) {
        const destino = this.getAttribute("href");

        if (!destino || destino === "#") {
            return;
        }

        const secaoDestino = document.querySelector(destino);

        if (!secaoDestino) {
            return;
        }

        event.preventDefault();

        const posicaoInicial = window.scrollY;
        const posicaoFinal = secaoDestino.offsetTop - 80;
        const distancia = posicaoFinal - posicaoInicial;

        const duracao = 1200;
        let tempoInicial = null;

        function animarScroll(tempoAtual) {
            if (tempoInicial === null) {
                tempoInicial = tempoAtual;
            }

            const tempoPassado = tempoAtual - tempoInicial;
            const progresso = Math.min(tempoPassado / duracao, 1);

            const suavizacao = 1 - Math.pow(1 - progresso, 3);

            window.scrollTo(0, posicaoInicial + distancia * suavizacao);

            if (tempoPassado < duracao) {
                requestAnimationFrame(animarScroll);
            }
        }

        requestAnimationFrame(animarScroll);
    });
});


// FAQ ABRE E FECHA

perguntasFaq.forEach((pergunta) => {
    pergunta.addEventListener("click", () => {
        const itemAtual = pergunta.parentElement;

        perguntasFaq.forEach((outraPergunta) => {
            const outroItem = outraPergunta.parentElement;

            if (outroItem !== itemAtual) {
                outroItem.classList.remove("ativo");
                outraPergunta.querySelector("span").textContent = "+";
            }
        });

        itemAtual.classList.toggle("ativo");

        const icone = pergunta.querySelector("span");

        if (itemAtual.classList.contains("ativo")) {
            icone.textContent = "−";
        } else {
            icone.textContent = "+";
        }
    });
});


// HEADER COM EFEITO AO ROLAR

if (cabecalho) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 40) {
            cabecalho.classList.add("rolando");
        } else {
            cabecalho.classList.remove("rolando");
        }
    });
}


// ANIMAÇÃO DE ENTRADA AO ROLAR A PÁGINA

const elementosAnimados = document.querySelectorAll(`
    .hero-conteudo,
    .hero-visual,
    .problema-texto,
    .problema-item,
    .card-servico,
    .antes-depois-card,
    .passo,
    .diferenciais-conteudo,
    .diferenciais-lista div,
    .faq-item,
    .cta-final
`);

const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
            entrada.target.classList.add("aparecer");
        }
    });
}, {
    threshold: 0.15
});

elementosAnimados.forEach((elemento) => {
    elemento.classList.add("animar");
    observador.observe(elemento);
});

const revealsSneaker = document.querySelectorAll(".reveal-sneaker");

revealsSneaker.forEach((reveal) => {
    const imagemLimpa = reveal.querySelector(".imagem-limpo");
    const linhaReveal = reveal.querySelector(".linha-reveal");

    reveal.addEventListener("mousemove", (event) => {
        const area = reveal.getBoundingClientRect();

        const x = event.clientX - area.left;
        const y = event.clientY - area.top;

        imagemLimpa.style.clipPath = `circle(85px at ${x}px ${y}px)`;

        linhaReveal.style.left = `${x}px`;
        linhaReveal.style.top = `${y}px`;

        const centerX = area.width / 2;
        const centerY = area.height / 2;

        const rotateY = ((x - centerX) / centerX) * 5;
        const rotateX = ((centerY - y) / centerY) * 5;

        reveal.style.transform = `
            perspective(1200px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale(1.01)
        `;
    });

    reveal.addEventListener("mouseleave", () => {
        imagemLimpa.style.clipPath = "circle(0px at 50% 50%)";
        linhaReveal.style.left = "50%";
        linhaReveal.style.top = "50%";
        reveal.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)";
    });
});