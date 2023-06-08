const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById("result");
const sound = document.getElementById("sound");
const searchBtn = document.getElementById("search-btn");

searchBtn.addEventListener("click", () => {
    let inpWord = document.getElementById("inp-word").value;
    
    if (!inpWord) {
        displayMessage("Please enter a word");
        return;
    }

    showLoadingPage(); // Show the loading page

    fetch(`${url}${inpWord}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);

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
        })
        .catch(() => {
            displayMessage("An error occurred");
            hideLoadingPage(); // Hide the loading page
        });

        document.getElementById("inp-word").value = "";

});

function showLoadingPage() {
    result.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            Loading...
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
