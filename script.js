const startBtn = document.getElementById("startBtn");
const startPage = document.querySelector(".startPage");
const quizPage = document.querySelector(".questionsPage");
const resultPage = document.querySelector(".resultsPage");

const questionsEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const progressEl = document.getElementById("progress");

const resultTitle = document.getElementById("resultTitle");
const resultDesc = document.getElementById("resultDesc");
const restartBtn = document.getElementById("resetBtn");
const shareBtn = document.getElementById("shareBtn");

let currentQuestion = 0;
let scores = {
        Strategist:0,
        Harmonizer: 0,
        Visionary: 0,
        "Free Spirit": 0
    };
let questions = [];

fetch("questions.json")
    .then(res => res.json())
    .then(data => {questions = data;
    })
    .catch(error => console.error("Error loading questions:" + error));

startBtn.addEventListener("click", () => {
    if (questions.length === 0) {
        alert("Questions not loaded yet."); return;
    }

    startPage.classList.add("hidden");
    quizPage.classList.remove("hidden");

    showQuestion();
});

function showQuestion() {
    const question = questions[currentQuestion];
    questionsEl.textContent = question.text;
    progressEl.textContent = `${currentQuestion + 1} / ${questions.length}`;
    optionsEl.innerHTML = "";

    question.options.forEach(option => {
        const btn = document.createElement("button");
        btn.textContent = option.text;
        btn.classList.add("optionBtn");

        btn.addEventListener("click", () => {
            scores[option.type]++;
            currentQuestion++;

            if (currentQuestion < questions.length) {
                showQuestion();
            } else {
                showResult();
            }
        });

        optionsEl.appendChild(btn);
    });
}

function showResult() {
    quizPage.classList.add("hidden");

    resultPage.classList.remove("hidden");

    let toptype = Object.keys(scores).reduce((a,b) => scores[a] > scores[b] ? a:b);
    
    const descriptions = {

  "Strategist": {
    title: "The Strategist",
    text: "You are analytical, thoughtful, and future-focused. You prefer logic over impulse and long-term growth over temporary comfort.",
    strengths: "Clarity, critical thinking, strategic planning, emotional control.",
    weakness: "Overthinking, hesitation, difficulty acting quickly.",
    growth: "Trust your preparation and take action faster. Progress beats perfection."
  },

  "Visionary": {
    title: "The Visionary",
    text: "You are ambitious, driven, and competitive. You think big and constantly look for ways to grow and expand your impact.",
    strengths: "Momentum, confidence, leadership energy, bold decision-making.",
    weakness: "Impatience, burnout, chasing too many goals at once.",
    growth: "Focus on consistency. Sustainable discipline will amplify your ambition."
  },

  "Harmonizer": {
    title: "The Harmonizer",
    text: "You are emotionally intelligent and deeply loyal. You value connection, understanding, and meaningful relationships.",
    strengths: "Empathy, loyalty, emotional depth, supportive nature.",
    weakness: "Self-doubt, overthinking emotions, putting others before yourself too often.",
    growth: "Build stronger self-trust. Your kindness should include yourself too."
  },

  "Free Spirit": {
    title: "The Free Spirit",
    text: "You value independence and personal freedom. You adapt easily and resist rigid systems or restrictions.",
    strengths: "Flexibility, creativity, adaptability, open-mindedness.",
    weakness: "Inconsistency, avoidance of structure, difficulty committing long-term.",
    growth: "Create light structure in your life. Freedom becomes powerful when supported by discipline."
  }

};

    const resultData = descriptions[toptype];

resultTitle.textContent = resultData.title;

resultDesc.innerHTML = `
  <p>${resultData.text}</p>
  <p><strong id="strenght">Strengths:</strong> ${resultData.strengths}</p>
  <p><strong id="weak">Weakness:</strong> ${resultData.weakness}</p>
  <p><strong id="grow">Growth:</strong> ${resultData.growth}</p>
`;

}

restartBtn.addEventListener("click", () => {
    currentQuestion = 0;
    scores = {Strategist:0, Harmonizer: 0, Visionary: 0, "Free Spirit": 0};
    resultPage.classList.add("hidden");

startPage.classList.remove("hidden");
});

shareBtn.addEventListener("click", () => {
    if (navigator.share) {
        navigator.share({
            title: "My personality Result",
            text:`I got ${resultTitle.textContent}!`,
            url: window.location.href
        });
   } else {
    alert("Sharing not supported on this device");
   }
});