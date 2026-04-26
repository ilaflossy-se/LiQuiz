const category = localStorage.getItem("category");
let currentQuestionIndex = 0;
let questions = [];
let correctAnswers = 0;
let wrongAnswers = 0;
let total = 0;
let selectedAnswerIndex = null;

//timer variable
const TIME_LIMIT = 15;      
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let isMoving = false;        

// DOM elements
const questionText = document.querySelector("#textQuestion");
const answersContainer = document.querySelector("#answers");
const nextBtn = document.querySelector("#next");
const timerDisplay = document.querySelector("#timerValue");
const progressBar = document.querySelector("#progress")


// Timer stop function
function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// Lauch timer function
function startTimer() {
    stopTimer(); 
    timeLeft = TIME_LIMIT;
    if (timerDisplay) timerDisplay.textContent = timeLeft;

    timerInterval = setInterval(() => {
        if (isMoving) return; 

        if (timeLeft <= 1) {
            stopTimer();
            if (!isMoving) {
                isMoving = true;
                if (selectedAnswerIndex === null) {
                    wrongAnswers++;
                } else {
                    const currentQ = questions[currentQuestionIndex];
                    const isCorrect = (selectedAnswerIndex === currentQ.correct);
                    if (isCorrect) correctAnswers++;
                    else wrongAnswers++;
                }
                currentQuestionIndex++;
                showQuestion(currentQuestionIndex);
                isMoving = false;
            }
        } else {
            timeLeft--;
            if (timerDisplay) timerDisplay.textContent = timeLeft;
        }
    }, 1000);
}

// Show question function
function showQuestion(index) {
    stopTimer();                 
    selectedAnswerIndex = null;  
    isMoving = false;            

    if (index >= questions.length) {
        localStorage.setItem("correct", correctAnswers);
        localStorage.setItem("wrong", wrongAnswers);
        localStorage.setItem("total", total);
        window.location.href = "/finish";
        return;
    }

    const q = questions[index];
    questionText.textContent = q.question;
    answersContainer.innerHTML = "";
    q.answers.forEach((answer, idx) => {
        const btn = document.createElement("button");
        btn.classList.add("answer");
        btn.textContent = answer;
        btn.setAttribute("data-answer-index", idx);
        btn.addEventListener("click", () => {
            document.querySelectorAll(".answer").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            selectedAnswerIndex = idx;
        });
        answersContainer.appendChild(btn);
    });
    startTimer();
}

// Next question button
nextBtn.addEventListener("click", () => {
    if (isMoving) return;
    
    if (selectedAnswerIndex === null) {
        alert("Пожалуйста, выберите ответ!");
        return;
    }

    stopTimer();
    isMoving = true;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = (selectedAnswerIndex === currentQuestion.correct);
    if (isCorrect) {
        correctAnswers++;
    } else {
        wrongAnswers++;
    }

    currentQuestionIndex++;
    showQuestion(currentQuestionIndex);
    progressBar.setAttribute("value",currentQuestionIndex)
    isMoving = false;
});

// Load questions from server
fetch(`/api/questions/${category}`)
    .then(response => response.json())
    .then(data => {
        if (data.length === 0) {
            alert("Нет вопросов в этой категории. Возврат на главную.");
            window.location.href = "/";
            return;
        }
        questions = data;
        total = questions.length;
        progressBar.setAttribute("max", total)
        showQuestion(currentQuestionIndex);
    })
    .catch(error => {
        console.error("Ошибка загрузки вопросов:", error);
        alert("Не удалось загрузить вопросы. Попробуйте позже.");
        window.location.href = "/";
    });