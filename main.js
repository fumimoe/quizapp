(() => {

    const url = 'https://opentdb.com/api.php?amount=10&type=multiple';

    const gameState = {
        quizzes: [],
        currentIndex: 0,
        numberOfCorrects: 0
    }

    const questionElement = document.getElementById('question');
    const resultElement = document.getElementById('result');
    const answersContainer = document.getElementById('answers');
    const restartButton = document.getElementById('restart-button');


    window.addEventListener('load', (e) => {
        fetchQuizData();
    })

    restartButton.addEventListener('click', (e) => {
        fetchQuizData();
    })


    const fetchQuizData = async () => {
        questionElement.textContent = 'Now loading...';
        resultElement.textContent = '';
        restartButton.hidden = true;

        try {
            const res = await fetch(url);
            const data = await res.json();


            gameState.quizzes = data.results;
            gameState.currentIndex = 0;
            gameState.numberOfCorrects = 0;
            setNextQuiz();

        } catch (error) {
            console.log('エラー：', error);
        }
    };



    const setNextQuiz = () => {
        questionElement.textContent = '';
        removeAllAnswers();

        if (gameState.currentIndex < gameState.quizzes.length) {
            const quiz = gameState.quizzes[gameState.currentIndex];
            console.log('次の問題');
            makeQuiz(quiz);
        } else {
            console.log('終了');
            finishQuiz();
        }
    };

    const finishQuiz = () => {
        resultElement.textContent = `${gameState.numberOfCorrects}/${gameState.quizzes.length}corrects`;
        restartButton.hidden = false;
    }


    const removeAllAnswers = () => {
        while (answersContainer.firstChild) {
            answersContainer.removeChild(answersContainer.firstChild);
        }
    }

    const makeQuiz = (quiz) => {
        const answers = buildAnswers(quiz);
        

        questionElement.textContent = quiz.question;
        
        answers.forEach((result, index)=>{
            const liElement = document.createElement('li');
            liElement.textContent = result;
            answersContainer.appendChild(liElement);

            liElement.addEventListener('click',(event)=>{
                const correctAnswer = quiz.correct_answer;
                if (correctAnswer === liElement.textContent) {
                    gameState.numberOfCorrects++;
                    alert('正解');
                } else {
                    alert('不正解')
                }

                gameState.currentIndex++;
                setNextQuiz();
        })
        })

       
    }

    const buildAnswers = (quiz) => {
        const answers = [
            quiz.correct_answer,
            ...quiz.incorrect_answers
        ];
        return shuffle(answers);
    }

    const shuffle = (array) => {
        const shffuledArray = array.slice();
        for (let i = shffuledArray.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shffuledArray[i], shffuledArray[j]] = [shffuledArray[j], shffuledArray[i]];
        }
        return shffuledArray;
    }


})();