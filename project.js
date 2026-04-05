document.addEventListener('DOMContentLoaded', function() {

    const searchButton = document.getElementById('search-button');
    const userInput = document.getElementById('user-input');
    const statsContainer = document.querySelector('.stats-container');
    const easyProgressCircle = document.querySelector('.easy-progress');
    const mediumProgressCircle = document.querySelector('.medium-progress');
    const hardProgressCircle = document.querySelector('.hard-progress');    
    const easyLabel = document.getElementById('easy-label');
    const mediumLabel = document.getElementById('medium-label');
    const hardLabel = document.getElementById('hard-label');
    const cardstatsContainer = document.querySelector('.stats-cards');

    statsContainer.style.display = 'none';

    //this  validate function gives the returns true or false based on the regex pattern of username which is only alphanumeric and length between 3 to 20 characters
        
    function validateUsername(username) {
        const regex = /^[a-zA-Z0-9_-]{3,20}$/;
        if(regex.test(username)) {
            return true;
        } 
        else {
            alert('Invalid username..');
            return false;
        }
    }


    //FETCH API SECTION 
    async function fetchuserdetails(username) {
        try {
            searchButton.textContent = 'Searching...';
            searchButton.disabled = true;
            statsContainer.style.display = 'block'; // Show stats container

            // ✅ Correct REST endpoint (dynamic username)
            const targetUrl = `https://leetcode-api-faisalshohag.vercel.app/${username}`;

            // ✅ No headers / body needed
            const response = await fetch(targetUrl);

            // ✅ Check response
            if (!response.ok) {
                throw new Error("User not found or API error");
            }

            const parsedData = await response.json();

            console.log("Logging data:", parsedData);

            displayUserData(parsedData);

        } 

        catch (error) {
            statsContainer.innerHTML = `<p>${error.message}</p>`;
        } 

        finally {
            searchButton.textContent = 'Search';
            searchButton.disabled = false;
        }
    }

    function displayUserData(parsedData) {
        // Implementation for displaying user data
        const totalquestions = parsedData.totalQuestions;
        const totaleasy = parsedData.totalEasy;
        const totalmedium = parsedData.totalMedium;
        const totalhard = parsedData.totalHard;

        const totalsolved = parsedData.totalSolved;
        const easysolved = parsedData.easySolved;  
        const mediumsolved = parsedData.mediumSolved;
        const hardsolved = parsedData.hardSolved;

        updateProgress(easysolved, totaleasy, easyLabel, easyProgressCircle);
        updateProgress(mediumsolved, totalmedium, mediumLabel, mediumProgressCircle);
        updateProgress(hardsolved, totalhard, hardLabel, hardProgressCircle);

        const cardsdata = [
            {label : "Overall Submissions :", value : parsedData.totalSubmissions[0].submissions},
            {label : "Overall Easy Submissions :", value : parsedData.totalSubmissions[1].submissions},
            {label : "Overall Medium Submissions :", value : parsedData.totalSubmissions[2].submissions},
            {label : "Overall Hard Submissions :", value : parsedData.totalSubmissions[3].submissions},
        ];

        console.log("Cards ka data :", cardsdata);
        cardstatsContainer.innerHTML = cardsdata.map(
            data => 
                `<div class="card">
                <h3>${data.label}</h3>
                <p>${data.value}</p>
                </div>`
        ).join(""); // Clear previous cards

    }

    function updateProgress(solved, total, label, circle) {
        const progressDegree = (solved / total)*100;
        circle.style.setProperty('--progress-degree', `${progressDegree}%`);
        label.textContent = `${solved} / ${total}`;

    }


    searchButton.addEventListener('click', function() {
        const username = userInput.value.trim();
        if(validateUsername(username)) {
            fetchuserdetails(username); 
        }
    });

});
