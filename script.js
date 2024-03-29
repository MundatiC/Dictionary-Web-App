const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const inpWord = document.getElementById("inp-word");
const result = document.getElementById("result");
const sound = document.getElementById("sound");
const searchBtn = document.getElementById("search-btn");
const container = document.querySelector("body");
const toggleBtn = document.getElementById("toggle-btn");
const toggleIcon = document.getElementById("toggle-icon");


inpWord.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    searchBtn.click(); // Trigger the click event of the search button
  }
});


toggleBtn.addEventListener('click', () => {
    container.classList.toggle('dark-mode');
  
    if (container.classList.contains('dark-mode')) {
      toggleIcon.classList.remove('fa-sun');
      toggleIcon.classList.add('fa-moon');
    } else {
      toggleIcon.classList.remove('fa-moon');
      toggleIcon.classList.add('fa-sun');
    }
  });

searchBtn.addEventListener("click", async  () => {
    let inpWord = document.getElementById("inp-word").value;
    
    if (!inpWord) {
        displayMessage("Please enter a word");
        return;
    }

    showLoadingPage(); // Show the loading page

    try {
        const encodedWord = encodeURIComponent(inpWord);
        const response = await fetch(`${url}${encodedWord}`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

            if (!data.length) {
                displayMessage("Word not found");
                hideLoadingPage(); // Hide the loading page
                return;
            }

            let html = ""; // Variable to store the HTML content

            // Iterate over each meaning
            data[0].meanings.forEach((meaning) => {
                // Build the HTML for each meaning
                let meaningHtml = `
                <div class="word">
                    <h3>${inpWord}</h3>
                    <button onclick="playSound()">
                        <i class="fas fa-volume-up"></i>
                    </button>
                </div>
                <div class="details">
                    <p>${meaning.partOfSpeech}</p>
                    <p>/${data[0].phonetic}/</p>
                </div>
                <p class="word-meaning">
                    ${meaning.definitions[0].definition}
                </p>
                <p class="word-example">
                    ${meaning.definitions[0].example || ""}
                </p>
                `;

                // Check if there are additional phonetics for the meaning
                if (meaning.phonetics) {
                    // Iterate over each phonetic and add it to the HTML
                    meaning.phonetics.forEach((phonetic) => {
                        if (phonetic.text) {
                            meaningHtml += `
                            <div class="phonetic">
                                <p>${phonetic.text}</p>
                                <audio src="${phonetic.audio}" controls></audio>
                            </div>
                            `;
                        }
                    });
                }

                html += meaningHtml; // Append the meaning HTML to the main HTML content
            });
            result.innerHTML = html; // Set the main HTML content
            hideLoadingPage(); // Hide the loading page

            sound.setAttribute("src", data[0].phonetics[0].audio);
        }
     catch (error) {
        displayMessage("Word not found");
        console.log(error)
        hideLoadingPage();
    }

        document.getElementById("inp-word").value = "";

});

function showLoadingPage() {
    result.innerHTML = `
        <div class="loading">
        <i class="fa-solid fa-spinner fa-spin"></i>
        </div>
    `;
}

function hideLoadingPage() {
    const loadingDiv = document.querySelector(".loading");
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

function displayMessage(message) {
    result.innerHTML = `<h3 class="error">${message}</h3>`;
}

function playSound() {
    sound.play();
}
