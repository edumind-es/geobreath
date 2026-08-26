/*
 * Copyright (C) 2024-2025 EDUmind - Los Mundos Edufis
 * Author: Luis Vilela Acuña
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
    // Editor de tiempos respiratorios
    rhythmEditor: string;
    modeSimple: string;
    modeAdvanced: string;
    perSideHint: string;
    freeStepsHint: string;
    cycleDuration: string;
    breathsPerMin: string;
    addStep: string;
    removeStep: string;
    moveUp: string;
    moveDown: string;
    resetTimes: string;
    customized: string;
    holdWarning: string;
    savePattern: string;
    patternName: string;
    myPatterns: string;
    deletePattern: string;
    storedLocally: string;
    forgetData: string;
    // Patrones con respaldo
    guidedPatterns: string;
    patternResonance: string;
    patternResonanceDesc: string;
    patternBox: string;
    patternBoxDesc: string;
    pattern478: string;
    pattern478Desc: string;
    patternSigh: string;
    patternSighDesc: string;
    // Modo aula
    roundsTarget: string;
    roundsTargetHint: string;
    roundsFree: string;
    roundsDone: string;
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
        quickRoutines: "Rutinas rápidas",
        calm: "Calma rápida",
        calmDesc: "Triángulo · 3.5 s · sonido activo",
        focus: "Foco estudio",
        focusDesc: "Cuadrado · 4 s · voz activa",
        recover: "Recupero exprés",
        recoverDesc: "Hexágono · 2.5 s · vibración activa",
        sessionTime: "Tiempo de sesión",
        cycles: "Ciclos",
        goal: "Meta",
        distracted: "Me despisté",
        challengeWon: "Reto superado",
        private: "100% privado",
        challenge: "Reto",
        sides: "lados",
        footer: "Sistema propiedad de EDUmind",
        faqTitle: "Preguntas frecuentes",
        faq: [
            { q: "¿Qué es Respira LME?", a: "Es una herramienta de respiración guiada para regular el ritmo, mejorar la concentración y bajar la carga mental usando recorridos geométricos." },
            { q: "¿Es privado?", a: "Sí. La experiencia principal funciona localmente en el dispositivo y no necesita crear una cuenta para empezar." },
            { q: "¿Cómo se usa mejor?", a: "Elige una figura, ajusta los segundos por lado y sigue el punto. Puedes activar apoyos de sonido, vibración, pictogramas o voz." }
        ],
        tagline: "Respira con una interfaz más clara y menos ruido",
        description: "Una experiencia de respiración guiada pensada para sesiones cortas, foco cognitivo y regulación emocional.",
        sound: "Sonido",
        vibration: "Vibración",
        pictograms: "Pictogramas",
        voice: "Voz",
        focusMode: "Modo foco",
        exitFocusMode: "Salir de foco",
        help: "Ayuda",
        close: "Cerrar",
        currentPhase: "Fase actual",
        howToUse: "Cómo usarlo",
        stepOne: "1. Ajusta figura y duración antes de empezar.",
        stepTwo: "2. Sigue el punto y deja que la etiqueta central marque el ritmo.",
        stepThree: "3. Usa el reto y el contador para mantener continuidad.",
        shape2: "Circular",
        shape3: "Triángulo",
        shape4: "Cuadrado",
        shape5: "Pentágono",
        shape6: "Hexágono",
        ready: "Listo para arrancar",
        shortcuts: "Atajos: espacio inicia o pausa, F activa foco y ? abre ayuda.",
        reset: "Reiniciar reto",
        rhythmEditor: "Tiempos de respiración",
        modeSimple: "Simple",
        modeAdvanced: "Avanzado",
        perSideHint: "Ajusta cuánto dura cada lado de la figura.",
        freeStepsHint: "Crea tu propio ciclo: añade, ordena y mide cada fase.",
        cycleDuration: "Ciclo",
        breathsPerMin: "resp/min",
        addStep: "Añadir fase",
        removeStep: "Quitar fase",
        moveUp: "Subir",
        moveDown: "Bajar",
        resetTimes: "Ritmo uniforme",
        customized: "Personalizado",
        holdWarning: "Retención larga. Mantenla cómoda y sin ahogo, sobre todo con niñas y niños.",
        savePattern: "Guardar",
        patternName: "Nombre del patrón",
        myPatterns: "Mis patrones",
        deletePattern: "Borrar",
        storedLocally: "Todo se guarda solo en este dispositivo.",
        forgetData: "Borrar mis datos",
        guidedPatterns: "Patrones con respaldo",
        patternResonance: "Resonancia",
        patternResonanceDesc: "≈5,5 respiraciones por minuto, la frecuencia de resonancia del barorreflejo.",
        patternBox: "Caja 4-4-4-4",
        patternBoxDesc: "Cuatro tiempos iguales. Foco y autocontrol.",
        pattern478: "4-7-8",
        pattern478Desc: "Exhalación alargada para bajar revoluciones.",
        patternSigh: "Suspiro fisiológico",
        patternSighDesc: "Doble inspiración y exhalación larga. Cinco minutos al día.",
        roundsTarget: "Rondas",
        roundsTargetHint: "La sesión se detiene sola al completarlas.",
        roundsFree: "Libre",
        roundsDone: "Rondas completadas"
    },
    gl: {
        inspire: "Inspira",
        exhale: "Expira",
        hold: "Aguanta",
        start: "COMEZAR",
        pause: "PAUSAR",
        seconds: "Segundos por lado",
        feedback: "Apoios sensoriais",
        shape: "Figura / ritmo",
        quickRoutines: "Rutinas rápidas",
        calm: "Calma rápida",
        calmDesc: "Triángulo · 3.5 s · son activo",
        focus: "Foco estudo",
        focusDesc: "Cadrado · 4 s · voz activa",
        recover: "Recuperación exprés",
        recoverDesc: "Hexágono · 2.5 s · vibración activa",
        sessionTime: "Tempo de sesión",
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
            { q: "Que é Respira LME?", a: "É unha ferramenta de respiración guiada para regular o ritmo, mellorar a concentración e reducir a carga mental con percorridos xeométricos." },
            { q: "É privado?", a: "Si. A experiencia principal funciona localmente no dispositivo e non precisa conta para comezar." },
            { q: "Como se usa mellor?", a: "Escolle unha figura, axusta os segundos por lado e segue o punto. Podes activar son, vibración, pictogramas ou voz." }
        ],
        tagline: "Respira cunha interface máis clara e menos ruído",
        description: "Unha experiencia de respiración guiada pensada para sesións curtas, foco cognitivo e regulación emocional.",
        sound: "Son",
        vibration: "Vibración",
        pictograms: "Pictogramas",
        voice: "Voz",
        focusMode: "Modo foco",
        exitFocusMode: "Saer do foco",
        help: "Axuda",
        close: "Pechar",
        currentPhase: "Fase actual",
        howToUse: "Como usalo",
        stepOne: "1. Axusta figura e duración antes de comezar.",
        stepTwo: "2. Sigue o punto e deixa que a etiqueta central marque o ritmo.",
        stepThree: "3. Usa o reto e o contador para manter continuidade.",
        shape2: "Circular",
        shape3: "Triángulo",
        shape4: "Cadrado",
        shape5: "Pentágono",
        shape6: "Hexágono",
        ready: "Listo para comezar",
        shortcuts: "Atallos: espazo comeza ou pausa, F activa foco e ? abre axuda.",
        reset: "Reiniciar reto",
        rhythmEditor: "Tempos de respiración",
        modeSimple: "Simple",
        modeAdvanced: "Avanzado",
        perSideHint: "Axusta canto dura cada lado da figura.",
        freeStepsHint: "Crea o teu propio ciclo: engade, ordena e mide cada fase.",
        cycleDuration: "Ciclo",
        breathsPerMin: "resp/min",
        addStep: "Engadir fase",
        removeStep: "Quitar fase",
        moveUp: "Subir",
        moveDown: "Baixar",
        resetTimes: "Ritmo uniforme",
        customized: "Personalizado",
        holdWarning: "Retención longa. Mantena cómoda e sen afogo, sobre todo coas nenas e nenos.",
        savePattern: "Gardar",
        patternName: "Nome do patrón",
        myPatterns: "Os meus patróns",
        deletePattern: "Borrar",
        storedLocally: "Todo se garda só neste dispositivo.",
        forgetData: "Borrar os meus datos",
        guidedPatterns: "Patróns con respaldo",
        patternResonance: "Resonancia",
        patternResonanceDesc: "≈5,5 respiracións por minuto, a frecuencia de resonancia do barorreflexo.",
        patternBox: "Caixa 4-4-4-4",
        patternBoxDesc: "Catro tempos iguais. Foco e autocontrol.",
        pattern478: "4-7-8",
        pattern478Desc: "Exhalación alongada para baixar revolucións.",
        patternSigh: "Suspiro fisiolóxico",
        patternSighDesc: "Dobre inspiración e exhalación longa. Cinco minutos ao día.",
        roundsTarget: "Roldas",
        roundsTargetHint: "A sesión detense soa ao completalas.",
        roundsFree: "Libre",
        roundsDone: "Roldas completadas"
    },
    cat: {
        inspire: "Inspira",
        exhale: "Expira",
        hold: "Aguanta",
        start: "COMENÇAR",
        pause: "PAUSAR",
        seconds: "Segons per costat",
        feedback: "Suports sensorials",
        shape: "Figura / ritme",
        quickRoutines: "Rutines ràpides",
        calm: "Calma ràpida",
        calmDesc: "Triangle · 3.5 s · so actiu",
        focus: "Focus estudi",
        focusDesc: "Quadrat · 4 s · veu activa",
        recover: "Recuperació exprés",
        recoverDesc: "Hexàgon · 2.5 s · vibració activa",
        sessionTime: "Temps de sessió",
        cycles: "Cicles",
        goal: "Meta",
        distracted: "M'he despistat",
        challengeWon: "Repte superat",
        private: "100% privat",
        challenge: "Repte",
        sides: "costats",
        footer: "Sistema propietat d'EDUmind",
        faqTitle: "Preguntes freqüents",
        faq: [
            { q: "Què és Respira LME?", a: "És una eina de respiració guiada per regular el ritme, millorar la concentració i reduir la càrrega mental amb recorreguts geomètrics." },
            { q: "És privat?", a: "Sí. L'experiència principal funciona localment al dispositiu i no cal cap compte per començar." },
            { q: "Com s'utilitza millor?", a: "Tria una figura, ajusta els segons per costat i segueix el punt. Pots activar so, vibració, pictogrames o veu." }
        ],
        tagline: "Respira amb una interfície més clara i menys soroll",
        description: "Una experiència de respiració guiada pensada per a sessions curtes, focus cognitiu i regulació emocional.",
        sound: "So",
        vibration: "Vibració",
        pictograms: "Pictogrames",
        voice: "Veu",
        focusMode: "Mode focus",
        exitFocusMode: "Sortir del focus",
        help: "Ajuda",
        close: "Tancar",
        currentPhase: "Fase actual",
        howToUse: "Com usar-ho",
        stepOne: "1. Ajusta figura i duració abans de començar.",
        stepTwo: "2. Segueix el punt i deixa que l'etiqueta central marqui el ritme.",
        stepThree: "3. Fes servir el repte i el comptador per mantenir la continuïtat.",
        shape2: "Circular",
        shape3: "Triangle",
        shape4: "Quadrat",
        shape5: "Pentàgon",
        shape6: "Hexàgon",
        ready: "A punt per començar",
        shortcuts: "Dreceres: espai inicia o pausa, F activa focus i ? obre ajuda.",
        reset: "Reiniciar repte",
        rhythmEditor: "Temps de respiració",
        modeSimple: "Simple",
        modeAdvanced: "Avançat",
        perSideHint: "Ajusta quant dura cada costat de la figura.",
        freeStepsHint: "Crea el teu propi cicle: afegeix, ordena i mesura cada fase.",
        cycleDuration: "Cicle",
        breathsPerMin: "resp/min",
        addStep: "Afegir fase",
        removeStep: "Treure fase",
        moveUp: "Pujar",
        moveDown: "Baixar",
        resetTimes: "Ritme uniforme",
        customized: "Personalitzat",
        holdWarning: "Retenció llarga. Mantén-la còmoda i sense ofec, sobretot amb infants.",
        savePattern: "Desar",
        patternName: "Nom del patró",
        myPatterns: "Els meus patrons",
        deletePattern: "Esborrar",
        storedLocally: "Tot es desa només en aquest dispositiu.",
        forgetData: "Esborrar les meves dades",
        guidedPatterns: "Patrons amb suport",
        patternResonance: "Ressonància",
        patternResonanceDesc: "≈5,5 respiracions per minut, la freqüència de ressonància del baroreflex.",
        patternBox: "Caixa 4-4-4-4",
        patternBoxDesc: "Quatre temps iguals. Focus i autocontrol.",
        pattern478: "4-7-8",
        pattern478Desc: "Exhalació allargada per baixar revolucions.",
        patternSigh: "Sospir fisiològic",
        patternSighDesc: "Doble inspiració i exhalació llarga. Cinc minuts al dia.",
        roundsTarget: "Rondes",
        roundsTargetHint: "La sessió s'atura sola en completar-les.",
        roundsFree: "Lliure",
        roundsDone: "Rondes completades"
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
        reset: "Erronka berrabiarazi",
        rhythmEditor: "Arnasketa denborak",
        modeSimple: "Sinplea",
        modeAdvanced: "Aurreratua",
        perSideHint: "Doitu figuraren alde bakoitzak zenbat irauten duen.",
        freeStepsHint: "Sortu zure zikloa: gehitu, ordenatu eta neurtu fase bakoitza.",
        cycleDuration: "Zikloa",
        breathsPerMin: "arn/min",
        addStep: "Gehitu fasea",
        removeStep: "Kendu fasea",
        moveUp: "Igo",
        moveDown: "Jaitsi",
        resetTimes: "Erritmo uniformea",
        customized: "Pertsonalizatua",
        holdWarning: "Eusteko denbora luzea. Mantendu erosoa eta itolarririk gabe, batez ere haurrekin.",
        savePattern: "Gorde",
        patternName: "Ereduaren izena",
        myPatterns: "Nire ereduak",
        deletePattern: "Ezabatu",
        storedLocally: "Dena gailu honetan bakarrik gordetzen da.",
        forgetData: "Ezabatu nire datuak",
        guidedPatterns: "Oinarri zientifikoa duten ereduak",
        patternResonance: "Erresonantzia",
        patternResonanceDesc: "≈5,5 arnasketa minutuko, barorreflexuaren erresonantzia maiztasuna.",
        patternBox: "Kutxa 4-4-4-4",
        patternBoxDesc: "Lau denbora berdin. Fokua eta autokontrola.",
        pattern478: "4-7-8",
        pattern478Desc: "Arnasa botatzea luzatuta, erritmoa jaisteko.",
        patternSigh: "Hasperen fisiologikoa",
        patternSighDesc: "Arnasa bi aldiz hartu eta luze bota. Bost minutu egunean.",
        roundsTarget: "Txandak",
        roundsTargetHint: "Saioa bakarrik gelditzen da osatzean.",
        roundsFree: "Askea",
        roundsDone: "Osatutako txandak"
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
        reset: "Reset challenge",
        rhythmEditor: "Breathing times",
        modeSimple: "Simple",
        modeAdvanced: "Advanced",
        perSideHint: "Set how long each side of the shape lasts.",
        freeStepsHint: "Build your own cycle: add, reorder and time every phase.",
        cycleDuration: "Cycle",
        breathsPerMin: "breaths/min",
        addStep: "Add phase",
        removeStep: "Remove phase",
        moveUp: "Move up",
        moveDown: "Move down",
        resetTimes: "Even rhythm",
        customized: "Customised",
        holdWarning: "Long hold. Keep it comfortable and free of air hunger, especially with children.",
        savePattern: "Save",
        patternName: "Pattern name",
        myPatterns: "My patterns",
        deletePattern: "Delete",
        storedLocally: "Everything is stored on this device only.",
        forgetData: "Delete my data",
        guidedPatterns: "Evidence-based patterns",
        patternResonance: "Resonance",
        patternResonanceDesc: "≈5.5 breaths per minute, the resonance frequency of the baroreflex.",
        patternBox: "Box 4-4-4-4",
        patternBoxDesc: "Four equal counts. Focus and self-control.",
        pattern478: "4-7-8",
        pattern478Desc: "A longer exhale to wind down.",
        patternSigh: "Physiological sigh",
        patternSighDesc: "Double inhale and long exhale. Five minutes a day.",
        roundsTarget: "Rounds",
        roundsTargetHint: "The session stops on its own once completed.",
        roundsFree: "Open",
        roundsDone: "Rounds completed"
    },
    zh: {
        inspire: "吸气",
        exhale: "呼气",
        hold: "屏住",
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
        reset: "重置挑战",
        rhythmEditor: "呼吸时长",
        modeSimple: "简易",
        modeAdvanced: "进阶",
        perSideHint: "调整图形每一边持续多久。",
        freeStepsHint: "自订呼吸循环：新增、排序并设定每个阶段的时长。",
        cycleDuration: "循环",
        breathsPerMin: "次/分",
        addStep: "新增阶段",
        removeStep: "移除阶段",
        moveUp: "上移",
        moveDown: "下移",
        resetTimes: "均匀节奏",
        customized: "已自订",
        holdWarning: "屏息时间较长。请保持舒适、不要憋气，尤其是儿童。",
        savePattern: "保存",
        patternName: "模式名称",
        myPatterns: "我的模式",
        deletePattern: "删除",
        storedLocally: "所有资料仅保存在本装置。",
        forgetData: "删除我的资料",
        guidedPatterns: "有研究依据的模式",
        patternResonance: "共振呼吸",
        patternResonanceDesc: "每分钟约 5.5 次，压力反射的共振频率。",
        patternBox: "箱式 4-4-4-4",
        patternBoxDesc: "四段等长。专注与自制。",
        pattern478: "4-7-8",
        pattern478Desc: "延长呼气，帮助放慢节奏。",
        patternSigh: "生理性叹息",
        patternSighDesc: "两次吸气加一次长呼气。每天五分钟。",
        roundsTarget: "轮数",
        roundsTargetHint: "完成后练习会自动停止。",
        roundsFree: "不限",
        roundsDone: "已完成轮数"
    }
};
