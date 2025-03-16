console.log("uie")

if(localStorage.getItem('tutorial') == 1) {
    $('.talk').css("display", "none");
} else {
    $('.hp-table').css("display", "none");
    $('.main').css("display", "none");
    $('.score-table').css("display", "none");

    $('.talk').css("display", "flex");
}

function selectChoice(element) {
    let choice = $(element).text();
    let talk = $('#talk-area');
    let button1 = $("#talk-button1");
    let button2 = $("#talk-button2");

    if(choice == "Ben mi?") {
        talk.text("Evet sen, benim çöplüğümde ne arıyorsun?");

        button1.text("Hiçbir şey?");
        button2.text("...");
    } else if (choice == "..?") {
        talk.text("Benim çöplüğümde ne arıyorsun?");

        button1.text("Hiçbir şey?");
        button2.text("...");
    }

    if(choice == "Hiçbir şey?") {
        talk.text("Öyleyse kart oynamaya ne dersin?");

        button1.text("Olur.");
        button2.text("Nasıl oynanır bilmiyorum.");
    } else if (choice == "...") {
        talk.text("Kart oynamaya ne dersin?");

        button1.text("Olur.");
        button2.text("Nasıl oynanır bilmiyorum.");
    }

    if(choice == "Olur." || choice == "Nasıl oynanır bilmiyorum.") {
        talk.text("Kurallar basit ben kazanırsam çöplüğümü terk edersin, sen kazanırsan devam ederiz.");
        button1.text("**OYUNU AÇIKLA**");
        button2.css('display', 'none');
    }

    if(choice == "**OYUNU AÇIKLA**") {
        showTutorial();
        localStorage.setItem('tutorial', 1);

        $('.talk').css("display", "none");

        $('.hp-table').css("display", "block");
        $('.main').css("display", "block");
        $('.score-table').css("display", "block");
    }
}

function showTutorial() {
    $("#tutorial-area").css('display', 'block');
}

function hideTutorial() {
    $("#tutorial-area").css('display', 'none');
}

let botScore = 0; // Botun skoru

function startGame() {
    console.log("Oyun Başlatıldı.");
    $("#start-game-button").css("display", "none");
    $('#main-cards').children('div').removeClass().addClass('empty card');
    $('#opponent-hands').children('div').removeClass().addClass('empty card');
    $('#character-hands').children('div').removeClass().addClass('empty card');

    let cardList = ["red", "green", "blue", "black"];

    $('#main-card1').removeClass().addClass(cardList[Math.floor(Math.random() * 3)] + ' card');
    $('#main-card2').removeClass().addClass(cardList[Math.floor(Math.random() * 3)] + ' card');
    $('#main-card3').removeClass().addClass(cardList[Math.floor(Math.random() * 3)] + ' card');
    $('#main-card4').removeClass().addClass(cardList[Math.floor(Math.random() * 3)] + ' card');

    // Butonu tekrar görünür yap
    $("#score-button").css("display", "block");
}

function selectCard(element) {
    let cards = $('#character-hands').children('div');
    let first = $(cards[0]).attr("class").split(" ");
    let second = $(cards[1]).attr("class").split(" ");
    let third = $(cards[2]).attr("class").split(" ");
    let classes = $(element).attr("class").split(" ");

    if (classes[2] == "selected" || classes[0] == "empty" || (first[0] !== "empty" && second[0] !== "empty" && third[0] !== "empty")) {
        console.log("uie");
        return;
    } else {
        $(element).addClass("selected");
    }

    if (["red", "green", "blue", "black"].includes(classes[0])) {
        console.log("Seçilen Kart: ", element);

        if (first[0] == "empty") {
            $(cards[0]).removeClass().addClass(classes[0] + ' card');
        } else if (second[0] == "empty") {
            $(cards[1]).removeClass().addClass(classes[0] + ' card');
        } else if (third[0] == "empty") {
            $(cards[2]).removeClass().addClass(classes[0] + ' card');
        }
    }
}

function scoreCards() {
    let selectedCards = $("#main-cards .selected");

    if (selectedCards.length === 3) {
        let colors = [];

        selectedCards.each(function () {
            let classes = $(this).attr("class").split(" ");
            colors.push(classes[0]);
        });

        let score = calculateScore(colors);
        app.score += score;
        app.hp += score;

        console.log("Toplam Puan: " + score);
        
        // "Kartları Tut" butonunu gizle
        $("#score-button").css("display", "none");

        // Botun sırasını başlat
        resetMainTable();
        startBotTurn();
    } else {
        console.log("Lütfen 3 kart seçin!");
    }
}

function removeCard(element) {
    let classes = $(element).attr("class").split(" ");
    
    // Eğer zaten boş bir karta tıklandıysa işlem yapma
    if (classes[0] === "empty") return;

    // Kaldırılan kartın rengini sakla (red, green, blue, black)
    let removedColor = classes[0];

    // Kartı boş hale getir
    $(element).removeClass().addClass("empty card");

    // Aynı renkteki **ilk** seçili kartı main-cards içinden temizle
    $("#main-cards .selected").each(function () {
        if ($(this).hasClass(removedColor)) {
            $(this).removeClass("selected");
            return false; // İlk bulunanı temizleyip döngüden çık
        }
    });

    console.log("Kart kaldırıldı:", element.id);
}

function resetMainTable() {
    // Ana masa üzerindeki seçili kartları temizle
    let selectedCards = $("#main-cards .card");
    selectedCards.removeClass("selected").removeClass().addClass("empty card");

    // Karakter kartlarını da sıfırla (yani sil)
    let characterCards = $("#character-hands .card");
    characterCards.removeClass().addClass("empty card");

    // main-cards'deki kartları sıfırla ve yenileriyle değiştir
    let colors = ["red", "green", "blue", "black"];
    
    // main-cards'deki boş kartlara rastgele kart ekle
    $("#main-cards .empty.card").each(function () {
        let randomColor = colors[Math.floor(Math.random() * colors.length)];
        $(this).removeClass("empty card").addClass(randomColor + " card");
    });
}


function startBotTurn() {
    // Ekranı yarı saydam yap ve "Rakibin sırası" yazısını göster
    $("body").append('<div id="bot-turn-overlay">Rakibin Sırası...</div>');
    $("#bot-turn-overlay").css({
        "position": "fixed",
        "top": "0",
        "left": "0",
        "width": "100%",
        "height": "100%",
        "background": "rgba(0, 0, 0, 0.7)",
        "color": "white",
        "font-size": "30px",
        "display": "flex",
        "align-items": "center",
        "justify-content": "center",
        "z-index": "9999"
    });

    setTimeout(() => {
        botPlay();
        $("#bot-turn-overlay").remove();
    }, 1000);
}

function botPlay() {
    let mainTableCards = $('#main-cards').children('div');
    let availableCards = [];

    // Masadaki tüm kartları diziye ekle
    mainTableCards.each(function () {
        availableCards.push($(this).attr("class").split(" ")[0]);
    });

    let selectedCards = [];

    // 1. Öncelik: 3 siyah varsa gönder
    if (availableCards.filter(c => c === "black").length >= 3) {
        selectedCards = ["black", "black", "black"];
    }
    // 2. Öncelik: Kırmızı + 2 mavi varsa
    else if (availableCards.includes("red") && availableCards.filter(c => c === "blue").length >= 2) {
        selectedCards = ["red", "blue", "blue"];
    }
    // 3. Öncelik: Kırmızı + 2 yeşil varsa
    else if (availableCards.includes("red") && availableCards.filter(c => c === "green").length >= 2) {
        selectedCards = ["red", "green", "green"];
    }
    // 4. Öncelik: 3 kırmızı varsa
    else if (availableCards.filter(c => c === "red").length >= 3) {
        selectedCards = ["red", "red", "red"];
    }
    // 5. Öncelik: 2 kırmızı varsa
    else if (availableCards.filter(c => c === "red").length >= 2) {
        selectedCards = ["red", "red", availableCards.find(c => c !== "red") || "red"];
    }
    // 6. Öncelik: Kırmızı varsa, rastgele 2 kart ekle
    else if (availableCards.includes("red")) {
        selectedCards.push("red");
        let remainingCards = availableCards.filter(c => c !== "red").slice(0, 2);
        selectedCards = selectedCards.concat(remainingCards);
    }
    // 7. Öncelik: Hiçbir özel kombinasyon yoksa ilk üç kartı al
    else {
        selectedCards = availableCards.slice(0, 3);
    }

    console.log("Bot seçimi:", selectedCards);

    let botScoreGain = calculateScore(selectedCards);

    botScore += botScoreGain;
    app.hp -= botScoreGain; // Bot kazanırsa oyuncunun skorundan düş

    resetMainTable();

    console.log("Bot toplam " + botScoreGain + " puan kazandı!");
    $("#score-button").css("display", "flex");
}





































function calculateScore(colors) {
    // Renkleri sıralıyoruz
    colors.sort();

    // Kombolar
    if (colors[0] === "black" && colors[1] === "black" && colors[2] === "black") {
        return 500;
    }
    if (
        (colors.includes("red") && colors.filter(c => c === "blue").length === 2) ||
        (colors.includes("red") && colors.filter(c => c === "green").length === 2)
    ) {
        return 250;
    }

    // Bireysel puanlar
    let score = 0;
    for (let color of colors) {
        if (color === "red") score += 50;
    }

    return score;
}



function finishGame(who) {
    if (who == "c") {
        $("body").append('<div id="ch-win-overlay">Kazandın...<br>Skor: ' + app.score + '<br>Tekrar Oynamak İçin Tıkla</div>');
        $("#ch-win-overlay").css({
            "position": "fixed",
            "top": "0",
            "left": "0",
            "width": "100%",
            "height": "100%",
            "background": "rgba(0, 0, 0, 0.7)",
            "color": "white",
            "font-size": "30px",
            "display": "flex",
            "align-items": "center",
            "justify-content": "center",
            "z-index": "9999"
        });

        $("#bot-win-overlay").click(function() {
            location.reload();
        });
    } else {
        $("body").append('<div id="bot-win-overlay">Kaybettin...<br>Skor: ' + app.score + '<br>Tekrar Oynamak İçin Tıkla</div>');
        $("#bot-win-overlay").css({
            "position": "fixed",
            "top": "0",
            "left": "0",
            "width": "100%",
            "height": "100%",
            "background": "rgba(0, 0, 0, 0.7)",
            "color": "white",
            "font-size": "30px",
            "display": "flex",
            "align-items": "center",
            "justify-content": "center",
            "z-index": "9999"
        });

        $("#bot-win-overlay").click(function() {
            location.reload();
        });
    }
}