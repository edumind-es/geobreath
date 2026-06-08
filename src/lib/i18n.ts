/*
 * Copyright (C) 2024-2025 EDUmind - Los Mundos Edufis
 * Author: Luis Vilela Acuna
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

export type Language = "es" | "gl" | "cat" | "eu" | "en" | "zh";

export interface FaqItem {
    q: string;
    a: string;
}

export interface AppTranslations {
    inspire: string;
    exhale: string;
    hold: string;
    start: string;
    pause: string;
    seconds: string;
    feedback: string;
    shape: string;
    quickRoutines: string;
    calm: string;
    calmDesc: string;
    focus: string;
    focusDesc: string;
    recover: string;
    recoverDesc: string;
    sessionTime: string;
    cycles: string;
    goal: string;
    distracted: string;
    challengeWon: string;
    private: string;
    challenge: string;
    sides: string;
    footer: string;
    faqTitle: string;
    faq: FaqItem[];
    tagline: string;
    description: string;
    sound: string;
    vibration: string;
    pictograms: string;
    voice: string;
    focusMode: string;
    exitFocusMode: string;
    help: string;
    close: string;
    currentPhase: string;
    howToUse: string;
    stepOne: string;
    stepTwo: string;
    stepThree: string;
    shape2: string;
    shape3: string;
    shape4: string;
    shape5: string;
    shape6: string;
    ready: string;
    shortcuts: string;
    reset: string;
}

export const translations: Record<Language, AppTranslations> = {
    es: {
        inspire: "Inspira",
        exhale: "Exhala",
        hold: "Aguanta",
        start: "EMPEZAR",
        pause: "PAUSAR",
        seconds: "Segundos por lado",
        feedback: "Apoyos sensoriales",
        shape: "Figura / ritmo",
        quickRoutines: "Rutinas rapidas",
        calm: "Calma rapida",
        calmDesc: "Triangulo · 3.5 s · sonido activo",
        focus: "Foco estudio",
        focusDesc: "Cuadrado · 4 s · voz activa",
        recover: "Recupero expres",
        recoverDesc: "Hexagono · 2.5 s · vibracion activa",
        sessionTime: "Tiempo de sesion",
        cycles: "Ciclos",
        goal: "Meta",
        distracted: "Me despiste",
        challengeWon: "Reto superado",
        private: "100% privado",
        challenge: "Reto",
        sides: "lados",
        footer: "Sistema propiedad de EDUmind",
        faqTitle: "Preguntas frecuentes",
        faq: [
            { q: "Que es Respira LME?", a: "Es una herramienta de respiracion guiada para regular el ritmo, mejorar la concentracion y bajar la carga mental usando recorridos geometricos." },
            { q: "Es privado?", a: "Si. La experiencia principal funciona localmente en el dispositivo y no necesita crear una cuenta para empezar." },
            { q: "Como se usa mejor?", a: "Elige una figura, ajusta los segundos por lado y sigue el punto. Puedes activar apoyos de sonido, vibracion, pictogramas o voz." }
        ],
        tagline: "Respira con una interfaz mas clara y menos ruido",
        description: "Una experiencia de respiracion guiada pensada para sesiones cortas, foco cognitivo y regulacion emocional.",
        sound: "Sonido",
        vibration: "Vibracion",
        pictograms: "Pictogramas",
        voice: "Voz",
        focusMode: "Modo foco",
        exitFocusMode: "Salir de foco",
        help: "Ayuda",
        close: "Cerrar",
        currentPhase: "Fase actual",
        howToUse: "Como usarlo",
        stepOne: "1. Ajusta figura y duracion antes de empezar.",
        stepTwo: "2. Sigue el punto y deja que la etiqueta central marque el ritmo.",
        stepThree: "3. Usa el reto y el contador para mantener continuidad.",
        shape2: "Circular",
        shape3: "Triangulo",
        shape4: "Cuadrado",
        shape5: "Pentagono",
        shape6: "Hexagono",
        ready: "Listo para arrancar",
        shortcuts: "Atajos: espacio inicia o pausa, F activa foco y ? abre ayuda.",
        reset: "Reiniciar reto"
    },
    gl: {
        inspire: "Inspira",
        exhale: "Expulsa",
        hold: "Aguanta",
        start: "COMEZAR",
        pause: "PAUSAR",
        seconds: "Segundos por lado",
        feedback: "Apoios sensoriais",
        shape: "Figura / ritmo",
        quickRoutines: "Rutinas rapidas",
        calm: "Calma rapida",
        calmDesc: "Triangulo · 3.5 s · son activo",
        focus: "Foco estudo",
        focusDesc: "Cadrado · 4 s · voz activa",
        recover: "Recuperacion expres",
        recoverDesc: "Hexagono · 2.5 s · vibracion activa",
        sessionTime: "Tempo de sesion",
        cycles: "Ciclos",
        goal: "Meta",
        distracted: "Despisteime",
        challengeWon: "Reto superado",
        private: "100% privado",
        challenge: "Reto",
        sides: "lados",
        footer: "Sistema propiedade de EDUmind",
        faqTitle: "Preguntas frecuentes",
        faq: [
            { q: "Que e Respira LME?", a: "E unha ferramenta de respiracion guiada para regular o ritmo, mellorar a concentracion e reducir a carga mental con percorridos xeometricos." },
            { q: "E privado?", a: "Si. A experiencia principal funciona localmente no dispositivo e non precisa conta para comezar." },
            { q: "Como se usa mellor?", a: "Escolle unha figura, axusta os segundos por lado e segue o punto. Podes activar son, vibracion, pictogramas ou voz." }
        ],
        tagline: "Respira cunha interface mais clara e menos ruido",
        description: "Unha experiencia de respiracion guiada pensada para sesions curtas, foco cognitivo e regulacion emocional.",
        sound: "Son",
        vibration: "Vibracion",
        pictograms: "Pictogramas",
        voice: "Voz",
        focusMode: "Modo foco",
        exitFocusMode: "Saer do foco",
        help: "Axuda",
        close: "Pechar",
        currentPhase: "Fase actual",
        howToUse: "Como usalo",
        stepOne: "1. Axusta figura e duracion antes de comezar.",
        stepTwo: "2. Sigue o punto e deixa que a etiqueta central marque o ritmo.",
        stepThree: "3. Usa o reto e o contador para manter continuidade.",
        shape2: "Circular",
        shape3: "Triangulo",
        shape4: "Cadrado",
        shape5: "Pentagono",
        shape6: "Hexagono",
        ready: "Listo para comezar",
        shortcuts: "Atallos: espazo comeza ou pausa, F activa foco e ? abre axuda.",
        reset: "Reiniciar reto"
    },
    cat: {
        inspire: "Inspira",
        exhale: "Exhala",
        hold: "Aguanta",
        start: "COMENCAR",
        pause: "PAUSAR",
        seconds: "Segons per costat",
        feedback: "Suports sensorials",
        shape: "Figura / ritme",
        quickRoutines: "Rutines rapides",
        calm: "Calma rapida",
        calmDesc: "Triangle · 3.5 s · so actiu",
        focus: "Focus estudi",
        focusDesc: "Quadrat · 4 s · veu activa",
        recover: "Recuperacio expres",
        recoverDesc: "Hexagon · 2.5 s · vibracio activa",
        sessionTime: "Temps de sessio",
        cycles: "Cicles",
        goal: "Meta",
        distracted: "M'he despistat",
        challengeWon: "Repte superat",
        private: "100% privat",
        challenge: "Repte",
        sides: "costats",
        footer: "Sistema propietat d'EDUmind",
        faqTitle: "Preguntes frequents",
        faq: [
            { q: "Que es Respira LME?", a: "Es una eina de respiracio guiada per regular el ritme, millorar la concentracio i reduir la carrega mental amb recorreguts geometrics." },
            { q: "Es privat?", a: "Si. L'experiencia principal funciona localment al dispositiu i no cal cap compte per comencar." },
            { q: "Com s'utilitza millor?", a: "Tria una figura, ajusta els segons per costat i segueix el punt. Pots activar so, vibracio, pictogrames o veu." }
        ],
        tagline: "Respira amb una interficie mes clara i menys soroll",
        description: "Una experiencia de respiracio guiada pensada per a sessions curtes, focus cognitiu i regulacio emocional.",
        sound: "So",
        vibration: "Vibracio",
        pictograms: "Pictogrames",
        voice: "Veu",
        focusMode: "Mode focus",
        exitFocusMode: "Sortir del focus",
        help: "Ajuda",
        close: "Tancar",
        currentPhase: "Fase actual",
        howToUse: "Com usar-ho",
        stepOne: "1. Ajusta figura i duracio abans de comencar.",
        stepTwo: "2. Segueix el punt i deixa que l'etiqueta central marqui el ritme.",
        stepThree: "3. Fes servir el repte i el comptador per mantenir la continuitat.",
        shape2: "Circular",
        shape3: "Triangle",
        shape4: "Quadrat",
        shape5: "Pentagon",
        shape6: "Hexagon",
        ready: "A punt per comencar",
        shortcuts: "Dreceres: espai inicia o pausa, F activa focus i ? obre ajuda.",
        reset: "Reiniciar repte"
    },
    eu: {
        inspire: "Arnasa hartu",
        exhale: "Arnasa bota",
        hold: "Eutsi",
        start: "HASI",
        pause: "GELDITU",
        seconds: "Segundoak aldeko",
        feedback: "Laguntza sentsorialak",
        shape: "Irudia / erritmoa",
        quickRoutines: "Errutina azkarrak",
        calm: "Lasaitasun azkarra",
        calmDesc: "Triangelua · 3.5 s · soinua aktibo",
        focus: "Ikasketa fokua",
        focusDesc: "Karratua · 4 s · ahotsa aktibo",
        recover: "Berreskuratze azkarra",
        recoverDesc: "Hexagonoa · 2.5 s · bibrazioa aktibo",
        sessionTime: "Saio denbora",
        cycles: "Zikloak",
        goal: "Helburua",
        distracted: "Despistatu naiz",
        challengeWon: "Erronka gaindituta",
        private: "100% pribatua",
        challenge: "Erronka",
        sides: "alde",
        footer: "EDUmind-en sistema",
        faqTitle: "Ohiko galderak",
        faq: [
            { q: "Zer da Respira LME?", a: "Arnasketa gidatuko tresna bat da, erritmoa erregulatzeko, kontzentrazioa hobetzeko eta karga mentala jaisteko ibilbide geometrikoekin." },
            { q: "Pribatua al da?", a: "Bai. Esperientzia nagusia gailuan bertan funtzionatzen du eta ez du konturik behar hasteko." },
            { q: "Nola erabili hobeto?", a: "Aukeratu irudi bat, doitu segundoak alde bakoitzeko eta jarraitu puntua. Soinua, bibrazioa, pictogramak edo ahotsa aktiba ditzakezu." }
        ],
        tagline: "Arnasa hartu interfaze argiago batekin eta zarata gutxiagorekin",
        description: "Saio laburretarako, fokurako eta erregulazio emozionalerako pentsatutako arnasketa gidatuko esperientzia.",
        sound: "Soinua",
        vibration: "Bibrazioa",
        pictograms: "Piktogramak",
        voice: "Ahotsa",
        focusMode: "Foku modua",
        exitFocusMode: "Atera fokutik",
        help: "Laguntza",
        close: "Itxi",
        currentPhase: "Uneko fasea",
        howToUse: "Nola erabili",
        stepOne: "1. Doitu irudia eta iraupena hasi aurretik.",
        stepTwo: "2. Jarraitu puntua eta utzi erdiko etiketak erritmoa markatzen.",
        stepThree: "3. Erabili erronka eta kontagailua jarraitutasuna mantentzeko.",
        shape2: "Zirkularra",
        shape3: "Triangelua",
        shape4: "Karratua",
        shape5: "Pentagonoa",
        shape6: "Hexagonoa",
        ready: "Hasteko prest",
        shortcuts: "Lasterbideak: espazioak hasi edo gelditu, F fokua eta ? laguntza irekitzen du.",
        reset: "Erronka berrabiarazi"
    },
    en: {
        inspire: "Inhale",
        exhale: "Exhale",
        hold: "Hold",
        start: "START",
        pause: "PAUSE",
        seconds: "Seconds per side",
        feedback: "Sensory support",
        shape: "Shape / rhythm",
        quickRoutines: "Quick routines",
        calm: "Quick calm",
        calmDesc: "Triangle · 3.5 s · sound enabled",
        focus: "Study focus",
        focusDesc: "Square · 4 s · voice enabled",
        recover: "Rapid recovery",
        recoverDesc: "Hexagon · 2.5 s · vibration enabled",
        sessionTime: "Session time",
        cycles: "Cycles",
        goal: "Goal",
        distracted: "I got distracted",
        challengeWon: "Challenge complete",
        private: "100% private",
        challenge: "Challenge",
        sides: "sides",
        footer: "System owned by EDUmind",
        faqTitle: "Frequently asked questions",
        faq: [
            { q: "What is Respira LME?", a: "It is a guided breathing tool built to regulate pace, improve focus and reduce mental load through geometric breathing paths." },
            { q: "Is it private?", a: "Yes. The main experience runs locally on the device and does not require an account to begin." },
            { q: "How should I use it?", a: "Pick a shape, adjust the seconds per side and follow the moving point. You can enable sound, vibration, pictograms or voice." }
        ],
        tagline: "Breathe with a clearer interface and less noise",
        description: "A guided breathing experience designed for short sessions, cognitive focus and emotional regulation.",
        sound: "Sound",
        vibration: "Vibration",
        pictograms: "Pictograms",
        voice: "Voice",
        focusMode: "Focus mode",
        exitFocusMode: "Exit focus",
        help: "Help",
        close: "Close",
        currentPhase: "Current phase",
        howToUse: "How to use it",
        stepOne: "1. Set the shape and duration before you start.",
        stepTwo: "2. Follow the point and let the center label keep the pace.",
        stepThree: "3. Use the challenge counter to stay consistent.",
        shape2: "Circular",
        shape3: "Triangle",
        shape4: "Square",
        shape5: "Pentagon",
        shape6: "Hexagon",
        ready: "Ready to begin",
        shortcuts: "Shortcuts: space starts or pauses, F toggles focus and ? opens help.",
        reset: "Reset challenge"
    },
    zh: {
        inspire: "吸气",
        exhale: "呼气",
        hold: "停住",
        start: "开始",
        pause: "暂停",
        seconds: "每边秒数",
        feedback: "感官辅助",
        shape: "图形 / 节奏",
        quickRoutines: "快速模式",
        calm: "快速平静",
        calmDesc: "三角形 · 3.5 秒 · 开启声音",
        focus: "学习专注",
        focusDesc: "正方形 · 4 秒 · 开启语音",
        recover: "快速恢复",
        recoverDesc: "六边形 · 2.5 秒 · 开启震动",
        sessionTime: "会话时间",
        cycles: "循环",
        goal: "目标",
        distracted: "我分心了",
        challengeWon: "挑战完成",
        private: "100% 私密",
        challenge: "挑战",
        sides: "边",
        footer: "EDUmind 拥有的系统",
        faqTitle: "常见问题",
        faq: [
            { q: "什么是 Respira LME？", a: "这是一个引导呼吸工具，通过几何路径帮助你调节节奏、提升专注并降低心理负荷。" },
            { q: "它是私密的吗？", a: "是的。主要体验在设备本地运行，开始使用不需要账户。" },
            { q: "怎样使用更好？", a: "选择图形，调整每边秒数，并跟随移动点。你也可以开启声音、震动、图示或语音。" }
        ],
        tagline: "用更清晰、更安静的界面呼吸",
        description: "为短时练习、认知专注和情绪调节设计的引导呼吸体验。",
        sound: "声音",
        vibration: "震动",
        pictograms: "图示",
        voice: "语音",
        focusMode: "专注模式",
        exitFocusMode: "退出专注",
        help: "帮助",
        close: "关闭",
        currentPhase: "当前阶段",
        howToUse: "使用方式",
        stepOne: "1. 开始前先设置图形和时长。",
        stepTwo: "2. 跟随移动点，让中央标签帮助你保持节奏。",
        stepThree: "3. 使用挑战和计数保持连续练习。",
        shape2: "圆形",
        shape3: "三角形",
        shape4: "正方形",
        shape5: "五边形",
        shape6: "六边形",
        ready: "准备开始",
        shortcuts: "快捷键：空格开始或暂停，F 切换专注，? 打开帮助。",
        reset: "重置挑战"
    }
};
