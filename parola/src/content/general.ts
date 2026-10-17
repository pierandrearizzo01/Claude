import type { Course } from "./types";

export const general: Course = {
  id: "general",
  title: "Corso generale",
  desc: "Le basi per principianti, per immagini",
  langs: ["en", "es", "fr", "de", "ja"],
  mode: "picture",
  units: [
    {
      id: "people",
      title: "Persone e cose",
      sub: "Chi è, che cos'è",
      items: [
        { id: "man", pic: "👨", it: "l'uomo", t: { en: "the man", es: "el hombre", fr: "l'homme", de: "der Mann", ja: "男の人" }, ja: { romaji: "otoko no hito", kana: "おとこのひと" } },
        { id: "woman", pic: "👩", it: "la donna", t: { en: "the woman", es: "la mujer", fr: "la femme", de: "die Frau", ja: "女の人" }, ja: { romaji: "onna no hito", kana: "おんなのひと" } },
        { id: "boy", pic: "👦", it: "il bambino", t: { en: "the boy", es: "el niño", fr: "le garçon", de: "der Junge", ja: "男の子" }, ja: { romaji: "otoko no ko", kana: "おとこのこ" } },
        { id: "girl", pic: "👧", it: "la bambina", t: { en: "the girl", es: "la niña", fr: "la fille", de: "das Mädchen", ja: "女の子" }, ja: { romaji: "onna no ko", kana: "おんなのこ" } },
        { id: "dog", pic: "🐕", it: "il cane", t: { en: "the dog", es: "el perro", fr: "le chien", de: "der Hund", ja: "犬" }, ja: { romaji: "inu", kana: "いぬ" } },
        { id: "cat", pic: "🐈", it: "il gatto", t: { en: "the cat", es: "el gato", fr: "le chat", de: "die Katze", ja: "猫" }, ja: { romaji: "neko", kana: "ねこ" } },
        { id: "apple", pic: "🍎", it: "la mela", t: { en: "the apple", es: "la manzana", fr: "la pomme", de: "der Apfel", ja: "りんご" }, ja: { romaji: "ringo", kana: "りんご" } },
        { id: "bread", pic: "🍞", it: "il pane", t: { en: "the bread", es: "el pan", fr: "le pain", de: "das Brot", ja: "パン" }, ja: { romaji: "pan", kana: "ぱん" } },
      ],
      sentences: [
        { id: "girl-dog", pic: "👧🐕", it: "La bambina ha un cane", t: { en: "The girl has a dog", es: "La niña tiene un perro", fr: "La fille a un chien", de: "Das Mädchen hat einen Hund", ja: "女の子 は 犬 を 飼って います" }, ja: { romaji: "onna no ko wa inu o katte imasu", kana: "おんなのこはいぬをかっています" } },
        { id: "man-bread", pic: "👨🍞", it: "L'uomo mangia il pane", t: { en: "The man eats bread", es: "El hombre come pan", fr: "L'homme mange du pain", de: "Der Mann isst Brot", ja: "男の人 は パン を 食べます" }, ja: { romaji: "otoko no hito wa pan o tabemasu", kana: "おとこのひとはぱんをたべます" } },
      ],
    },
    {
      id: "actions",
      title: "Azioni",
      sub: "Che cosa fa",
      items: [
        { id: "eats", pic: "🍽️", it: "lui mangia", t: { en: "he eats", es: "él come", fr: "il mange", de: "er isst", ja: "彼は食べます" }, ja: { romaji: "kare wa tabemasu", kana: "かれはたべます" } },
        { id: "drinks", pic: "🥤", it: "lei beve", t: { en: "she drinks", es: "ella bebe", fr: "elle boit", de: "sie trinkt", ja: "彼女は飲みます" }, ja: { romaji: "kanojo wa nomimasu", kana: "かのじょはのみます" } },
        { id: "runs", pic: "🏃", it: "lui corre", t: { en: "he runs", es: "él corre", fr: "il court", de: "er läuft", ja: "彼は走ります" }, ja: { romaji: "kare wa hashirimasu", kana: "かれははしります" } },
        { id: "reads", pic: "📖", it: "lei legge", t: { en: "she reads", es: "ella lee", fr: "elle lit", de: "sie liest", ja: "彼女は読みます" }, ja: { romaji: "kanojo wa yomimasu", kana: "かのじょはよみます" } },
        { id: "sleeps", pic: "😴", it: "lui dorme", t: { en: "he sleeps", es: "él duerme", fr: "il dort", de: "er schläft", ja: "彼は寝ます" }, ja: { romaji: "kare wa nemasu", kana: "かれはねます" } },
        { id: "swims", pic: "🏊", it: "lei nuota", t: { en: "she swims", es: "ella nada", fr: "elle nage", de: "sie schwimmt", ja: "彼女は泳ぎます" }, ja: { romaji: "kanojo wa oyogimasu", kana: "かのじょはおよぎます" } },
        { id: "cooks", pic: "🍳", it: "lui cucina", t: { en: "he cooks", es: "él cocina", fr: "il cuisine", de: "er kocht", ja: "彼は料理します" }, ja: { romaji: "kare wa ryōri shimasu", kana: "かれはりょうりします" } },
        { id: "writes", pic: "✍️", it: "lei scrive", t: { en: "she writes", es: "ella escribe", fr: "elle écrit", de: "sie schreibt", ja: "彼女は書きます" }, ja: { romaji: "kanojo wa kakimasu", kana: "かのじょはかきます" } },
      ],
      sentences: [
        { id: "woman-book", pic: "👩📖", it: "La donna legge un libro", t: { en: "The woman reads a book", es: "La mujer lee un libro", fr: "La femme lit un livre", de: "Die Frau liest ein Buch", ja: "女の人 は 本 を 読みます" }, ja: { romaji: "onna no hito wa hon o yomimasu", kana: "おんなのひとはほんをよみます" } },
        { id: "boy-water", pic: "👦💧", it: "Il bambino beve l'acqua", t: { en: "The boy drinks water", es: "El niño bebe agua", fr: "Le garçon boit de l'eau", de: "Der Junge trinkt Wasser", ja: "男の子 は 水 を 飲みます" }, ja: { romaji: "otoko no ko wa mizu o nomimasu", kana: "おとこのこはみずをのみます" } },
      ],
    },
    {
      id: "city",
      title: "In città",
      sub: "Muoversi e orientarsi",
      items: [
        { id: "train", pic: "🚆", it: "il treno", t: { en: "the train", es: "el tren", fr: "le train", de: "der Zug", ja: "電車" }, ja: { romaji: "densha", kana: "でんしゃ" } },
        { id: "car", pic: "🚗", it: "la macchina", t: { en: "the car", es: "el coche", fr: "la voiture", de: "das Auto", ja: "車" }, ja: { romaji: "kuruma", kana: "くるま" } },
        { id: "bicycle", pic: "🚲", it: "la bicicletta", t: { en: "the bicycle", es: "la bicicleta", fr: "le vélo", de: "das Fahrrad", ja: "自転車" }, ja: { romaji: "jitensha", kana: "じてんしゃ" } },
        { id: "house", pic: "🏠", it: "la casa", t: { en: "the house", es: "la casa", fr: "la maison", de: "das Haus", ja: "家" }, ja: { romaji: "ie", kana: "いえ" } },
        { id: "hospital", pic: "🏥", it: "l'ospedale", t: { en: "the hospital", es: "el hospital", fr: "l'hôpital", de: "das Krankenhaus", ja: "病院" }, ja: { romaji: "byōin", kana: "びょういん" } },
        { id: "coffee", pic: "☕", it: "il caffè", t: { en: "the coffee", es: "el café", fr: "le café", de: "der Kaffee", ja: "コーヒー" }, ja: { romaji: "kōhī", kana: "こーひー" } },
        { id: "hotel", pic: "🏨", it: "l'albergo", t: { en: "the hotel", es: "el hotel", fr: "l'hôtel", de: "das Hotel", ja: "ホテル" }, ja: { romaji: "hoteru", kana: "ほてる" } },
        { id: "ticket", pic: "🎫", it: "il biglietto", t: { en: "the ticket", es: "el billete", fr: "le billet", de: "die Fahrkarte", ja: "切符" }, ja: { romaji: "kippu", kana: "きっぷ" } },
      ],
      sentences: [
        { id: "train-late", pic: "🚆⏰", it: "Il treno è in ritardo", t: { en: "The train is late", es: "El tren llega tarde", fr: "Le train est en retard", de: "Der Zug hat Verspätung", ja: "電車 が 遅れて います" }, ja: { romaji: "densha ga okurete imasu", kana: "でんしゃがおくれています" } },
        { id: "where-hospital", pic: "🏥❓", it: "Dov'è l'ospedale?", t: { en: "Where is the hospital?", es: "¿Dónde está el hospital?", fr: "Où est l'hôpital ?", de: "Wo ist das Krankenhaus?", ja: "病院 は どこ です か" }, ja: { romaji: "byōin wa doko desu ka", kana: "びょういんはどこですか" } },
      ],
    },
  ],
};
