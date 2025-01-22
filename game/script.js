document.getElementById("fetch-problem-btn").addEventListener("click", async () => {
    const handle = document.getElementById("handle").value.trim();
    const filter = document.getElementById("problem-filter").value;
    const problemContainer = document.getElementById("problem-statement");
    const ratingSection = document.getElementById("rating-section");
    const resultDiv = document.getElementById("result");

    problemContainer.classList.add("d-none");
    ratingSection.classList.add("d-none");
    resultDiv.classList.add("d-none");

    if (!handle) {
        resultDiv.className = "alert alert-danger";
        resultDiv.textContent = "Please enter a valid handle.";
        resultDiv.classList.remove("d-none");
        return;
    }

    problemContainer.textContent = "Fetching problem...";
    problemContainer.classList.remove("d-none");

    try {
        const userStatusResponse = await fetch(`https://codeforces.com/api/user.status?handle=${handle}`);
        if (!userStatusResponse.ok) throw new Error("Failed to fetch user's problems.");
        const userStatusData = await userStatusResponse.json();

        if (userStatusData.status !== "OK") {   
            throw new Error("Failed to fetch user's problems. 1 ");
        }

        const solvedProblems = new Set(
            userStatusData.result.filter(p => p.verdict === "OK").map(p => `${p.problem.contestId}-${p.problem.index}`)
        );

        const problemsetResponse = await fetch("https://codeforces.com/api/problemset.problems");
        if (!problemsetResponse.ok) throw new Error("Failed to fetch problemset.");
        const problemsetData = await problemsetResponse.json();

        if (problemsetData.status !== "OK") {
            throw new Error("Failed to fetch problemset. 2 ");
        }

        const problems = problemsetData.result.problems.filter(
            p => p.rating && p.tags.length > 0 
        );

        const filteredProblems = problems.filter(p => {
            const problemKey = `${p.contestId}-${p.index}`;
            return filter === "solved" ? solvedProblems.has(problemKey) : !solvedProblems.has(problemKey);
        });

        if (filteredProblems.length === 0) {
            problemContainer.textContent = "No problems available for the selected criteria.";
            return;
        }

        const randomProblem = filteredProblems[Math.floor(Math.random() * filteredProblems.length)];
        const problemLink = `https://codeforces.com/contest/${randomProblem.contestId}/problem/${randomProblem.index}`;

        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(problemLink)}`;
        const problemResponse = await fetch(proxyUrl);
        const problemData = await problemResponse.json();

        if (!problemData.contents) {
            throw new Error("Problem statement could not be retrieved.");
        }

        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(problemData.contents, "text/html");

        const statementDiv = htmlDoc.querySelector(".problem-statement");

        if (statementDiv) {
            const nameElem = statementDiv.querySelector(".header .title");
            if (nameElem) nameElem.remove();

            statementDiv.innerHTML = statementDiv.innerHTML.replace(/\$/g, "");

            problemContainer.innerHTML = statementDiv.innerHTML;
            problemContainer.dataset.correctRating = randomProblem.rating; 
            problemContainer.dataset.problemLink = problemLink;
            ratingSection.classList.remove("d-none");
        } else {
            throw new Error("Failed to fetch the problem statement.");
        }
    } catch (error) {
        problemContainer.textContent = `Error: ${error.message}`;
    }
});


document.getElementById("submit-rating-btn").addEventListener("click", () => {
    const userRatingGuess = parseInt(document.getElementById("rating-guess").value.trim());
    const problemContainer = document.getElementById("problem-statement");
    const correctRating = parseInt(problemContainer.dataset.correctRating);
    const problemLink = problemContainer.dataset.problemLink;
    const resultDiv = document.getElementById("result");

    resultDiv.classList.add("d-none");

    if (isNaN(userRatingGuess)) {
        resultDiv.className = "alert alert-danger";
        resultDiv.textContent = "Please enter a valid numeric rating.";
        resultDiv.classList.remove("d-none");
        return;
    }

    if (userRatingGuess === correctRating) {
        resultDiv.className = "alert alert-success";
        resultDiv.innerHTML = `
            <strong>Accepted!</strong> Your guess is correct. 
            <a href="${problemLink}" target="_blank">View Problem</a>
        `;
    } else {
        resultDiv.className = "alert alert-warning";
        resultDiv.innerHTML = `
            <strong>Wrong Answer!</strong> The correct rating is ${correctRating}. 
            <a href="${problemLink}" target="_blank">View Problem</a>
        `;
    }

    resultDiv.classList.remove("d-none");
});
